//------------------------------------------------
//-----------  Mainnet Configuration -------------
//------------------------------------------------
export const MAINNET_API: string = process.env.MAINNET_API as string;
export const MAINNET_PROXY = process.env.MAINNET_PROXY as string;
export const MAINNET_CRYPTOBAY_CONTRACT =
  'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8llllls4xn0vm';

export const MAINNET_ESDT: string[] = [
  'MEX-455c57',
  'USDC-c76f1f',
  'USDT-f8c08c',
  'UTK-2f80e9',
  'WEGLD-bd4d79',
  'LEGLD-d74da9',
  'HTM-f51d55',
  'QWT-46ac01',
  'TADA-5c032c',
  'ZPAY-247875',
  'ASH-a642d1',
  'CYBER-489c1c',
  'BOBER-9eb764',
  'CRT-52decf',
  'BEE-cb37b6',
  'RIDE-7d18e9',
  'CRU-a5f4aa',
  'ITHEUM-df6f26',
  'BHAT-c1fde3',
  'WBTC-5349b3',
  'WETH-b4ca29',
  'WDAI-9eeb54',
  'XOXNO-c1293a',
  'KWAK-469ab0',
  'MID-ecb7bf',
];
export const MAINNET_NFT: string[] = [];
export const MAINNET_COLLECTION: string[] = [
  'DEAD-79f8d1',
  'QWTEVCARS-d0cb53',
  'XPACHIEVE-5a0519',
  'BLOKICOR01-3f4e24',
  'BLOKICOR02-3f4e24',
];

//------------------------------------------------
//----------  Devnet Configuration----------------
//------------------------------------------------
export const DEVNET_PROXY = process.env.DEVNET_PROXY as string;
export const DEVNET_API = process.env.DEVNET_API as string;
export const DEVNET_CRYPTOBAY_CONTRACT =
  'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqyhllllsv4k7x2';

export const DEVNET_ESDT: string[] = [
  'MEX-a659d0',
  'ASH-e3d1b7',
  'WEGLD-a28c59',
  'USDC-350c4e',
  'UTK-14d57d',
  'RIDE-05b1bb',
  'ITHEUM-fce905',
  'HTM-23a1da',
  'LEGLD-e8378b',
];
export const DEVNET_NFT: string[] = [];
export const DEVNET_COLLECTION: string[] = [
  'ELVNFACE-762e9d',
  'TOKENTICKE-38b075',
];

//------------------------------------------------
//----------  Common Configuration----------------
//------------------------------------------------

export const API_RATE_LIMIT = process.env.API_RATE_LIMIT as string;

//------------------------------------------------
//---------------  Services    -------------------
//------------------------------------------------

// --- Xexchange ---

//Mainnet
export const MAINNET_XEXCHANGE_SC_FEESCOLLECTOR =
  'erd1qqqqqqqqqqqqqpgqjsnxqprks7qxfwkcg2m2v9hxkrchgm9akp2segrswt';

//Devnet
export const DEVNET_XEXCHANGE_SC_FEESCOLLECTOR =
  'erd1qqqqqqqqqqqqqpgqw88ux2l44eufvwz2uhvduhq03g8pxc4j0n4s0frzjz';
