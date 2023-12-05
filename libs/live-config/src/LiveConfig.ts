import { ProviderGetValueMethod } from "./providers";

export class LiveConfig {
  public appVersion?: string;
  public platform?: string;
  public environment?: string;
  public providerGetvalueMethod?: ProviderGetValueMethod;

  private static instance: LiveConfig; // Singleton instance

  private constructor() {}

  public static init(config: { appVersion: string; platform: string; environment: string }) {
    if (!LiveConfig.instance) {
      LiveConfig.instance = new LiveConfig();
      LiveConfig.instance.appVersion = config.appVersion;
      LiveConfig.instance.platform = config.platform;
    }
  }

  public static getInstance(): LiveConfig {
    if (!LiveConfig.instance) {
      throw new Error("LiveConfig instance is not initialized. Call init() first.");
    }

    return LiveConfig.instance;
  }

  public static setProviderGetValueMethod(provider2Method: ProviderGetValueMethod) {
    if (!LiveConfig.getInstance().providerGetvalueMethod) {
      LiveConfig.instance.providerGetvalueMethod = {};
    }

    LiveConfig.instance.providerGetvalueMethod = {
      ...LiveConfig.instance.providerGetvalueMethod,
      ...provider2Method,
    };
  }
}
