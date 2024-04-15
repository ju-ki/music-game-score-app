/*
  Warnings:

  - You are about to drop the column `difficultyLevel` on the `Scores` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `genreId` to the `Scores` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `musicId` on the `Scores` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Scores" DROP CONSTRAINT "Scores_userId_fkey";

-- AlterTable
ALTER TABLE "Scores" DROP COLUMN "difficultyLevel",
ADD COLUMN     "genreId" INTEGER NOT NULL,
DROP COLUMN "musicId",
ADD COLUMN     "musicId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refreshTokenId" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicTag" (
    "id" INTEGER NOT NULL,
    "musicId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    "tagName" TEXT NOT NULL,
    "tagId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicList" (
    "id" TEXT NOT NULL,
    "genreId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicMusicList" (
    "musicId" INTEGER NOT NULL,
    "musicGenreId" INTEGER NOT NULL,
    "musicListId" TEXT NOT NULL,

    CONSTRAINT "MusicMusicList_pkey" PRIMARY KEY ("musicId","musicGenreId","musicListId")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_refreshTokenId_key" ON "users"("refreshTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "MusicTag_id_key" ON "MusicTag"("id");

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicTag" ADD CONSTRAINT "MusicTag_musicId_genreId_fkey" FOREIGN KEY ("musicId", "genreId") REFERENCES "Music"("id", "genreId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicMusicList" ADD CONSTRAINT "MusicMusicList_musicId_musicGenreId_fkey" FOREIGN KEY ("musicId", "musicGenreId") REFERENCES "Music"("id", "genreId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicMusicList" ADD CONSTRAINT "MusicMusicList_musicListId_fkey" FOREIGN KEY ("musicListId") REFERENCES "MusicList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
