<<<<<<< HEAD
import useFeature from "@ledgerhq/live-config/featureFlags/useFeature";
=======
import useFeature from "@ledgerhq/live-config/FeatureFlags/useFeature";
>>>>>>> f8e0133b13 (fix: refactoring)
import { cryptopanicAvailableRegions, CryptopanicAvailableRegionsType } from "./cryptopanicApi";
import { useLocale } from "../../context/Locale";

export function useIsNewsfeedAvailable() {
  const { locale } = useLocale();
  const newsfeedPageFeature = useFeature("newsfeedPage");

  return (
    newsfeedPageFeature?.enabled &&
    newsfeedPageFeature?.params?.cryptopanicApiKey &&
    cryptopanicAvailableRegions.includes(locale as CryptopanicAvailableRegionsType) &&
    newsfeedPageFeature?.params?.whitelistedLocales?.includes(locale)
  );
}
