-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "avgOrderValue" DOUBLE PRECISION,
ADD COLUMN     "cartWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
ADD COLUMN     "favoriteWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
ADD COLUMN     "lastCalculated" TIMESTAMP(3),
ADD COLUMN     "priceRangeMax" DOUBLE PRECISION,
ADD COLUMN     "priceRangeMin" DOUBLE PRECISION,
ADD COLUMN     "purchaseWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.4,
ADD COLUMN     "viewWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.1;

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" SERIAL NOT NULL,
    "userProfileId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "activityType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "minAmount" DOUBLE PRECISION,
    "maxAmount" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserActivity_userProfileId_idx" ON "UserActivity"("userProfileId");

-- CreateIndex
CREATE INDEX "UserActivity_productId_idx" ON "UserActivity"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_code_key" ON "Discount"("code");

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
