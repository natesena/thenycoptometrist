/*
  Warnings:

  - Changed the type of `event_type` on the `metrics_events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('visit', 'book_now_clicked', 'phone_clicked', 'email_clicked', 'social_media_clicked', 'product_referral_clicked', 'blog_post_clicked', 'external_link_clicked');

-- AlterTable
ALTER TABLE "metrics_events" DROP COLUMN "event_type",
ADD COLUMN     "event_type" "EventType" NOT NULL;

-- CreateIndex
CREATE INDEX "metrics_events_event_type_idx" ON "metrics_events"("event_type");
