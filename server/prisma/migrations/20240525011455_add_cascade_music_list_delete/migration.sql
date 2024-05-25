-- DropForeignKey
ALTER TABLE "MusicMusicList" DROP CONSTRAINT "MusicMusicList_musicListId_fkey";

-- AddForeignKey
ALTER TABLE "MusicMusicList" ADD CONSTRAINT "MusicMusicList_musicListId_fkey" FOREIGN KEY ("musicListId") REFERENCES "MusicList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
