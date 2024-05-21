-- CreateEnum
CREATE TYPE "AuthorityType" AS ENUM ('ADMIN', 'GUEST');

-- DropIndex
DROP INDEX "UnitProfile_seq_genreId_key";

-- AlterTable
ALTER TABLE "UnitProfile" ADD CONSTRAINT "UnitProfile_pkey" PRIMARY KEY ("seq", "genreId");

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "authority" "AuthorityType" NOT NULL DEFAULT 'GUEST';
