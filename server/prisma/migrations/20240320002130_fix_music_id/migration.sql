/*
  Warnings:

  - The primary key for the `Music` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `genreId` to the `MetaMusic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MetaMusic" DROP CONSTRAINT "MetaMusic_musicId_fkey";

-- DropIndex
DROP INDEX "Music_id_genreId_key";

-- AlterTable
ALTER TABLE "MetaMusic" ADD COLUMN     "genreId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Music" DROP CONSTRAINT "Music_pkey",
ADD CONSTRAINT "Music_pkey" PRIMARY KEY ("id", "genreId");

-- AddForeignKey
ALTER TABLE "MetaMusic" ADD CONSTRAINT "MetaMusic_musicId_genreId_fkey" FOREIGN KEY ("musicId", "genreId") REFERENCES "Music"("id", "genreId") ON DELETE RESTRICT ON UPDATE CASCADE;
