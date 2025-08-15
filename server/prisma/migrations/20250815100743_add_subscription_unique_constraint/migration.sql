/*
  Warnings:

  - A unique constraint covering the columns `[userId,planId,startDate]` on the table `Subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Subscriptions_userId_planId_startDate_key` ON `Subscriptions`(`userId`, `planId`, `startDate`);
