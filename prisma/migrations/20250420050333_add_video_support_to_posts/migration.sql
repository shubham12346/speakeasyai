-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "summary" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "videoUrl" TEXT;
