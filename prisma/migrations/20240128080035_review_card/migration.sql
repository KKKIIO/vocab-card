-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM('TRIVIAL', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "ReviewItem" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" INTEGER NOT NULL,
    "nextReviewDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,


CONSTRAINT "ReviewItem_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "ReviewItemLog" (
    "id" SERIAL NOT NULL,
    "reviewItemId" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,


CONSTRAINT "ReviewItemLog_pkey" PRIMARY KEY ("id") );

-- CreateIndex
CREATE INDEX "ReviewItem_userId_nextReviewDate_createdAt_idx" ON "ReviewItem" (
    "userId", "nextReviewDate", "createdAt"
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewItem_userId_cardId_key" ON "ReviewItem" ("userId", "cardId");

-- AddForeignKey
ALTER TABLE "ReviewItem"
ADD CONSTRAINT "ReviewItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewItem"
ADD CONSTRAINT "ReviewItem_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewItemLog"
ADD CONSTRAINT "ReviewItemLog_reviewItemId_fkey" FOREIGN KEY ("reviewItemId") REFERENCES "ReviewItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CUSTOM:

-- Insert all cards into ReviewItem
INSERT INTO
    "ReviewItem" (
        "userId", "cardId", "nextReviewDate", "createdAt", "updatedAt"
    ) (
        SELECT d."userId", c.id, c."createdAt", current_timestamp, current_timestamp
        FROM "Card" AS c
            JOIN "Desk" AS d ON c."deskId" = d.id
    );