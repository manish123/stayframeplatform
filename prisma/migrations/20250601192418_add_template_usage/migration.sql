-- CreateTable
CREATE TABLE "template_usage" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "template_name" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "template_usage_type_idx" ON "template_usage"("type");

-- CreateIndex
CREATE INDEX "template_usage_template_id_idx" ON "template_usage"("template_id");

-- CreateIndex
CREATE INDEX "template_usage_timestamp_idx" ON "template_usage"("timestamp");
