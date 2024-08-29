-- CreateEnum
CREATE TYPE "AuthorityType" AS ENUM ('ADMIN', 'GUEST');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "authority" "AuthorityType" NOT NULL DEFAULT 'GUEST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refreshTokenId" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Music" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "assetBundleName" TEXT,
    "genreId" INTEGER NOT NULL,
    "releasedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Music_pkey" PRIMARY KEY ("id","genreId")
);

-- CreateTable
CREATE TABLE "Scores" (
    "id" TEXT NOT NULL,
    "musicId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    "totalNoteCount" INTEGER NOT NULL,
    "perfectPlusCount" INTEGER,
    "perfectCount" INTEGER,
    "greatCount" INTEGER,
    "goodCount" INTEGER,
    "badCount" INTEGER,
    "musicDifficulty" TEXT,
    "missCount" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "metaMusicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaMusic" (
    "id" TEXT NOT NULL,
    "musicId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    "musicDifficulty" TEXT NOT NULL,
    "playLevel" TEXT NOT NULL,
    "totalNoteCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetaMusic_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "UnitProfile" (
    "id" SERIAL NOT NULL,
    "seq" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    "unitName" TEXT NOT NULL,
    "unitProfileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitProfile_pkey" PRIMARY KEY ("seq","genreId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_refreshTokenId_key" ON "users"("refreshTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Scores_id_key" ON "Scores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_id_key" ON "Genre"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MetaMusic_id_key" ON "MetaMusic"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MusicTag_id_key" ON "MusicTag"("id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_user_id_key" ON "refresh_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "Music" ADD CONSTRAINT "Music_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_musicId_genreId_fkey" FOREIGN KEY ("musicId", "genreId") REFERENCES "Music"("id", "genreId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_metaMusicId_fkey" FOREIGN KEY ("metaMusicId") REFERENCES "MetaMusic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaMusic" ADD CONSTRAINT "MetaMusic_musicId_genreId_fkey" FOREIGN KEY ("musicId", "genreId") REFERENCES "Music"("id", "genreId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicTag" ADD CONSTRAINT "MusicTag_musicId_genreId_fkey" FOREIGN KEY ("musicId", "genreId") REFERENCES "Music"("id", "genreId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicMusicList" ADD CONSTRAINT "MusicMusicList_musicId_musicGenreId_fkey" FOREIGN KEY ("musicId", "musicGenreId") REFERENCES "Music"("id", "genreId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicMusicList" ADD CONSTRAINT "MusicMusicList_musicListId_fkey" FOREIGN KEY ("musicListId") REFERENCES "MusicList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
