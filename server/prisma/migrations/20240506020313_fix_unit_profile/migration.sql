/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Scores" ADD COLUMN     "musicDifficulty" TEXT;

-- CreateTable
CREATE TABLE "UnitProfile" (
    "id" SERIAL NOT NULL,
    "seq" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    "unitName" TEXT NOT NULL,
    "unitProfileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UnitProfile_seq_genreId_key" ON "UnitProfile"("seq", "genreId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_user_id_key" ON "refresh_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_musicId_genreId_fkey" FOREIGN KEY ("musicId", "genreId") REFERENCES "Music"("id", "genreId") ON DELETE RESTRICT ON UPDATE CASCADE;
