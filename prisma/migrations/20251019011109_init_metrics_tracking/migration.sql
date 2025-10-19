-- CreateTable
CREATE TABLE "metrics_events" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "user_agent" TEXT,
    "referrer" TEXT,
    "event_data" JSONB,

    CONSTRAINT "metrics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "metrics_events_event_type_idx" ON "metrics_events"("event_type");

-- CreateIndex
CREATE INDEX "metrics_events_pathname_idx" ON "metrics_events"("pathname");

-- CreateIndex
CREATE INDEX "metrics_events_created_at_idx" ON "metrics_events"("created_at");
