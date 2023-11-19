import { useFeature } from "@ledgerhq/live-common/featureFlags/index";
import { Button, Flex, ProgressLoader, Text } from "@ledgerhq/native-ui";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCustomURI } from "@ledgerhq/live-common/hooks/recoverFeatureFlag";
import { useTheme } from "styled-components/native";
import { RecoverBannerType } from "./types";
import { Linking } from "react-native";
import { getStoreValue, setStoreValue } from "~/store";

function RecoverBanner() {
  const [storageData, setStorageData] = useState<string>();
  const [displayBannerData, setDisplayBannerData] = useState<boolean>();
  const [stepNumber, setStepNumber] = useState<number>(0);

  const { t } = useTranslation();
  const { colors } = useTheme();
  const recoverServices = useFeature("protectServicesMobile");

  const bannerIsEnabled = recoverServices?.params?.bannerSubscriptionNotification;
  const protectID = recoverServices?.params?.protectId ?? "";
  const maxStepNumber = 5;

  const recoverUnfinishedOnboardingPath = useCustomURI(
    recoverServices,
    "activate",
    "llm-banner-unfinished-onboarding",
    "recover-launch",
  );

  const getStorageSubscriptionState = useCallback(async () => {
    const storage = await getStoreValue("SUBSCRIPTION_STATE", protectID);
    const displayBanner = await getStoreValue("DISPLAY_BANNER", protectID);
    setStorageData(storage as string);
    setDisplayBannerData(displayBanner === "true");
  }, [protectID]);

  const recoverBannerSelected: RecoverBannerType | undefined = useMemo(() => {
    let recoverBannerWording: RecoverBannerType;

    switch (storageData) {
      case "NO_SUBSCRIPTION":
        setStepNumber(1);
        return undefined;
      case "STARGATE_SUBSCRIBE":
        setStepNumber(2);
        recoverBannerWording = t("portfolio.recoverBanner.subscribeDone", { returnObjects: true });
        break;
      case "BACKUP_VERIFY_IDENTITY":
        setStepNumber(3);
        recoverBannerWording = t("portfolio.recoverBanner.verifyIdentity", { returnObjects: true });
        break;
      case "BACKUP_DEVICE_CONNECTION":
        setStepNumber(4);
        recoverBannerWording = t("portfolio.recoverBanner.connectDevice", { returnObjects: true });
        break;
      case "BACKUP_DONE":
        setStepNumber(5);
        return undefined;
      default:
        setStepNumber(0);
        return undefined;
    }

    if (recoverBannerWording) {
      recoverBannerWording.title = t("portfolio.recoverBanner.title");
      return recoverBannerWording;
    }
  }, [storageData, t]);

  const onRedirectRecover = () => {
    if (recoverUnfinishedOnboardingPath)
      Linking.canOpenURL(recoverUnfinishedOnboardingPath).then(() =>
        Linking.openURL(recoverUnfinishedOnboardingPath),
      );
  };

  const onCloseBanner = () => {
    setStoreValue("DISPLAY_BANNER", "false", protectID);
    setDisplayBannerData(false);
  };

  useEffect(() => {
    getStorageSubscriptionState();
  }, [getStorageSubscriptionState]);

  if (!bannerIsEnabled || !recoverBannerSelected || !displayBannerData) return null;

  return (
    <Flex justifyContent="center" p={6}>
      <Flex
        position="relative"
        columnGap={3}
        bg={colors.opacityPurple.c10}
        flexDirection="row"
        justifyContent="space-between"
        borderRadius="8px"
        overflow="hidden"
        width="100%"
      >
        <Flex alignItems="center" justifyContent="center" p={3} width={68}>
          <ProgressLoader progress={stepNumber / maxStepNumber} radius={20}>
            <Text display="block" flex={1} textAlign="center" fontSize="12px" lineHeight="15px">
              {`${stepNumber}/${maxStepNumber}`}
            </Text>
          </ProgressLoader>
        </Flex>
        <Flex flex={1} flexDirection="column" py={3} overflow="hidden">
          <Text fontSize="13px" lineHeight="16px" width="100%" overflow="hidden">
            {recoverBannerSelected.title}
          </Text>
          <Text
            mt={1}
            fontSize="12px"
            lineHeight="15px"
            fontWeight="medium"
            width="100%"
            overflow="hidden"
          >
            {recoverBannerSelected.description}
          </Text>
        </Flex>
        <Flex alignItems="center" p={3} pl={0} columnGap={3}>
          <Button size="small" outline={false} onPress={onCloseBanner}>
            {recoverBannerSelected.secondaryCta}
          </Button>
          <Button type="main" size="small" outline={false} onPress={onRedirectRecover}>
            {recoverBannerSelected.primaryCta}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default memo(RecoverBanner);
