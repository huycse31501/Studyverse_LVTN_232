import "expo-constants";

declare module "expo-constants" {
  export interface AppManifest {
    extra: {
      host: string;
      port: string;
    };
  }
}
