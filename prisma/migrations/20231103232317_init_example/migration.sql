/*
  Warnings:

  - You are about to drop the column `wordMeaningId` on the `WordMeaningExample` table. All the data in the column will be lost.
  - You are about to drop the `Word` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WordMeaning` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WordPronunciation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cardTextEnd` to the `WordMeaningExample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardTextStart` to the `WordMeaningExample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `WordMeaningExample` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WordMeaning" DROP CONSTRAINT "WordMeaning_wordId_fkey";

-- DropForeignKey
ALTER TABLE "WordMeaningExample" DROP CONSTRAINT "WordMeaningExample_wordMeaningId_fkey";

-- DropForeignKey
ALTER TABLE "WordPronunciation" DROP CONSTRAINT "WordPronunciation_wordId_fkey";

-- AlterTable
TRUNCATE TABLE "WordMeaningExample";
ALTER TABLE "WordMeaningExample" DROP COLUMN "wordMeaningId",
ADD COLUMN     "cardTextEnd" INTEGER NOT NULL,
ADD COLUMN     "cardTextStart" INTEGER NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;

-- DropTable
DROP TABLE "Word";

-- DropTable
DROP TABLE "WordMeaning";

-- DropTable
DROP TABLE "WordPronunciation";

-- DropEnum
DROP TYPE "LearnStatus";
