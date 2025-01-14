import { ConfigService } from '@nestjs/config';

/**
 * Network environment enum for supported environments.
 */
export enum Network {
  MAINNET = 'mainnet',
  DEVNET = 'devnet',
}

/**
 * Selects a value depending on the active network configuration.
 * @param network The active network (mainnet/devnet).
 * @param mainnetValue Value for the mainnet.
 * @param devnetValue Value for the devnet.
 * @returns {string} The selected value depending on the network.
 */
export const selectDependingOnNetwork = (
  network: Network,
  mainnetValue: string,
  devnetValue: string,
) => {
  switch (network) {
    case Network.MAINNET:
      return mainnetValue;
    case Network.DEVNET:
      return devnetValue;
    default:
      throw new Error(`NETWORK: ${network} is not a valid network!`);
  }
};

/**
 * Retrieves the environment variable from ConfigService.
 * @param configService The ConfigService for accessing environment variables.
 * @param key The environment variable key to retrieve.
 * @param isUrl Boolean to indicate if the variable is a URL and should throw if missing.
 * @returns {string} The value of the environment variable or an empty string if not found (unless isUrl is true).
 */
export function getEnvVar(
  configService: ConfigService,
  key: string,
  isUrl: boolean = false,
): string {
  const value = configService.get<string>(key, { infer: true });
  if (!value) {
    const error = `${key} is not set in the environment variables.`;
    if (isUrl) {
      throw new Error(error);
    } else {
      console.warn(error);
      return '';
    }
  }
  return value;
}