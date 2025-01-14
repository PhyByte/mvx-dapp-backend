// ---------------------
// ---------------------
//        Wallet
// ---------------------
// ---------------------
export type ESDTValue = {
  identifier: string;
  balance: string;
};
// ----------------------------------
//        ESDT: (FungibleESDT)
// ----------------------------------
export enum AssetStatus {
  Active = 'active',
  Inactive = 'inactive',
}
export type ESDT = {
  identifier: string;
  name: string;
  ticker: string;
  owner: string;
  minted: string;
  burnt: string;
  initialMinted: string;
  decimals: number;
  isPaused: boolean;
  assets?: ESDTAssets; // Define TokenAssets type based on your requirement
  transactions?: number;
  accounts?: number;
  canUpgrade: boolean;
  canMint?: boolean;
  canBurn?: boolean;
  canChangeOwner?: boolean;
  canAddSpecialRoles?: boolean;
  canPause: boolean;
  canFreeze?: boolean;
  canWipe?: boolean;
  canTransfer?: boolean;
  canTransferNftCreateRole?: boolean;
  price?: number;
  marketCap?: number;
  supply: string;
  circulatingSupply: string;
  timestamp?: number;
  roles?: boolean;
};

export type ESDTAssets = {
  id: number;
  website: string;
  description: string;
  status: AssetStatus;
  pngUrl: string;
  svgUrl: string;
  social?: ESDTAssetsSocial;
};

export type ESDTAssetsSocial = {
  id: number;
  email: string;
  blog: string;
  telegram: string;
  twitter: string;
  whitepaper: string;
  coinmarketcap: string;
  coingecko: string;
};