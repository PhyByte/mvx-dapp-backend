-- CreateEnum
CREATE TYPE "Token_Type" AS ENUM ('FungibleESDT', 'NonFungibleESDT', 'SemiFungibleESDT', 'MetaESDT');

-- CreateEnum
CREATE TYPE "Asset_Status" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "Mvx_Constants" (
    "id" SERIAL NOT NULL,
    "chainId" TEXT NOT NULL,
    "gasPerDataByte" INTEGER NOT NULL,
    "minGasLimit" INTEGER NOT NULL,
    "minGasPrice" INTEGER NOT NULL,
    "minTransactionVersion" INTEGER NOT NULL,

    CONSTRAINT "Mvx_Constants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mvx_Economics" (
    "id" SERIAL NOT NULL,
    "totalSupply" INTEGER NOT NULL,
    "circulatingSupply" INTEGER NOT NULL,
    "staked" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "marketCap" INTEGER NOT NULL,
    "apr" DOUBLE PRECISION NOT NULL,
    "topUpApr" DOUBLE PRECISION NOT NULL,
    "baseApr" DOUBLE PRECISION NOT NULL,
    "tokenMarketCap" BIGINT,

    CONSTRAINT "Mvx_Economics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mvx_Stats" (
    "id" SERIAL NOT NULL,
    "shards" INTEGER NOT NULL,
    "blocks" INTEGER NOT NULL,
    "accounts" INTEGER NOT NULL,
    "transactions" INTEGER NOT NULL,
    "scResults" INTEGER NOT NULL,
    "refreshRate" INTEGER NOT NULL,
    "epoch" INTEGER NOT NULL,
    "roundsPassed" INTEGER NOT NULL,
    "roundsPerEpoch" INTEGER NOT NULL,

    CONSTRAINT "Mvx_Stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Esdt" (
    "id" SERIAL NOT NULL,
    "type" "Token_Type" NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "minted" TEXT NOT NULL,
    "burnt" TEXT NOT NULL,
    "initialMinted" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "assetsId" INTEGER,
    "transactions" INTEGER,
    "accounts" INTEGER,
    "canUpgrade" BOOLEAN NOT NULL DEFAULT false,
    "canMint" BOOLEAN DEFAULT false,
    "canBurn" BOOLEAN DEFAULT false,
    "canChangeOwner" BOOLEAN DEFAULT false,
    "canAddSpecialRoles" BOOLEAN DEFAULT false,
    "canPause" BOOLEAN NOT NULL DEFAULT false,
    "canFreeze" BOOLEAN DEFAULT false,
    "canWipe" BOOLEAN NOT NULL DEFAULT false,
    "canTransfer" BOOLEAN,
    "canTransferNftCreateRole" BOOLEAN DEFAULT false,
    "price" DOUBLE PRECISION,
    "marketCap" DOUBLE PRECISION,
    "supply" TEXT NOT NULL,
    "circulatingSupply" TEXT NOT NULL,
    "timestamp" INTEGER,
    "roles" BOOLEAN,

    CONSTRAINT "Esdt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Esdt_Assets" (
    "id" SERIAL NOT NULL,
    "website" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Asset_Status" NOT NULL,
    "pngUrl" TEXT NOT NULL,
    "svgUrl" TEXT NOT NULL,
    "socialId" INTEGER,
    "ESDTId" INTEGER,

    CONSTRAINT "Esdt_Assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Esdt_Assets_Socials" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "blog" TEXT NOT NULL,
    "telegram" TEXT NOT NULL,
    "twitter" TEXT NOT NULL,
    "whitepaper" TEXT NOT NULL,
    "coinmarketcap" TEXT NOT NULL,
    "coingecko" TEXT NOT NULL,
    "ESDTAssetId" INTEGER,

    CONSTRAINT "Esdt_Assets_Socials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "herotag" TEXT,
    "address" TEXT NOT NULL,
    "shard" INTEGER,
    "bearerToken" TEXT NOT NULL,
    "tokenExpiration" TIMESTAMP(3),
    "balance" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet_Esdt" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "balance" TEXT NOT NULL,
    "walletId" INTEGER NOT NULL,

    CONSTRAINT "Wallet_Esdt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Esdt_identifier_key" ON "Esdt"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Esdt_assetsId_key" ON "Esdt"("assetsId");

-- CreateIndex
CREATE UNIQUE INDEX "Esdt_Assets_svgUrl_key" ON "Esdt_Assets"("svgUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Esdt_Assets_socialId_key" ON "Esdt_Assets"("socialId");

-- CreateIndex
CREATE UNIQUE INDEX "Esdt_Assets_Socials_ESDTAssetId_key" ON "Esdt_Assets_Socials"("ESDTAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_bearerToken_key" ON "Wallet"("bearerToken");

-- AddForeignKey
ALTER TABLE "Esdt" ADD CONSTRAINT "Esdt_assetsId_fkey" FOREIGN KEY ("assetsId") REFERENCES "Esdt_Assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Esdt_Assets" ADD CONSTRAINT "Esdt_Assets_socialId_fkey" FOREIGN KEY ("socialId") REFERENCES "Esdt_Assets_Socials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet_Esdt" ADD CONSTRAINT "Wallet_Esdt_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
