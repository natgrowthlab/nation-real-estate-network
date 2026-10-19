-- Keep existing records in the earliest available workspace while making all
-- operational data tenant-scoped going forward.
INSERT INTO "Workspace" ("id", "name", "slug", "createdAt", "updatedAt")
SELECT '00000000-0000-4000-8000-000000000001', 'Espacio inicial', 'espacio-inicial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "Workspace");

INSERT INTO "WorkspaceMember" ("workspaceId", "userId", "role", "createdAt")
SELECT (SELECT "id" FROM "Workspace" ORDER BY "createdAt" ASC LIMIT 1), "id", 'OWNER', CURRENT_TIMESTAMP
FROM "User"
WHERE NOT EXISTS (SELECT 1 FROM "WorkspaceMember")
LIMIT 1;

ALTER TABLE "Owner" ADD COLUMN "workspaceId" TEXT;
ALTER TABLE "Property" ADD COLUMN "workspaceId" TEXT;
ALTER TABLE "Lead" ADD COLUMN "workspaceId" TEXT;
ALTER TABLE "Appointment" ADD COLUMN "workspaceId" TEXT;
ALTER TABLE "Offer" ADD COLUMN "workspaceId" TEXT;
ALTER TABLE "Deal" ADD COLUMN "workspaceId" TEXT;
ALTER TABLE "CommissionRule" ADD COLUMN "workspaceId" TEXT;
ALTER TABLE "AuditEvent" ADD COLUMN "workspaceId" TEXT;

UPDATE "Owner" SET "workspaceId" = (SELECT "id" FROM "Workspace" ORDER BY "createdAt" ASC LIMIT 1) WHERE "workspaceId" IS NULL;
UPDATE "Property" SET "workspaceId" = (SELECT "id" FROM "Workspace" ORDER BY "createdAt" ASC LIMIT 1) WHERE "workspaceId" IS NULL;
UPDATE "Lead" SET "workspaceId" = (SELECT "id" FROM "Workspace" ORDER BY "createdAt" ASC LIMIT 1) WHERE "workspaceId" IS NULL;
UPDATE "Appointment" SET "workspaceId" = (SELECT "id" FROM "Workspace" ORDER BY "createdAt" ASC LIMIT 1) WHERE "workspaceId" IS NULL;
UPDATE "Offer" SET "workspaceId" = (SELECT "id" FROM "Workspace" ORDER BY "createdAt" ASC LIMIT 1) WHERE "workspaceId" IS NULL;
UPDATE "Deal" SET "workspaceId" = (SELECT "id" FROM "Workspace" ORDER BY "createdAt" ASC LIMIT 1) WHERE "workspaceId" IS NULL;
UPDATE "CommissionRule" SET "workspaceId" = (SELECT "id" FROM "Workspace" ORDER BY "createdAt" ASC LIMIT 1) WHERE "workspaceId" IS NULL;

ALTER TABLE "Owner" ALTER COLUMN "workspaceId" SET NOT NULL;
ALTER TABLE "Property" ALTER COLUMN "workspaceId" SET NOT NULL;
ALTER TABLE "Lead" ALTER COLUMN "workspaceId" SET NOT NULL;
ALTER TABLE "Appointment" ALTER COLUMN "workspaceId" SET NOT NULL;
ALTER TABLE "Offer" ALTER COLUMN "workspaceId" SET NOT NULL;
ALTER TABLE "Deal" ALTER COLUMN "workspaceId" SET NOT NULL;
ALTER TABLE "CommissionRule" ALTER COLUMN "workspaceId" SET NOT NULL;

DROP INDEX "Property_code_key";
DROP INDEX "Lead_normalizedPhone_key";
DROP INDEX "Lead_normalizedEmail_key";
CREATE UNIQUE INDEX "Property_workspaceId_code_key" ON "Property"("workspaceId", "code");
CREATE UNIQUE INDEX "Lead_workspaceId_normalizedPhone_key" ON "Lead"("workspaceId", "normalizedPhone");
CREATE UNIQUE INDEX "Lead_workspaceId_normalizedEmail_key" ON "Lead"("workspaceId", "normalizedEmail");
CREATE INDEX "Owner_workspaceId_createdAt_idx" ON "Owner"("workspaceId", "createdAt");
CREATE INDEX "Property_workspaceId_createdAt_idx" ON "Property"("workspaceId", "createdAt");
CREATE INDEX "Lead_workspaceId_createdAt_idx" ON "Lead"("workspaceId", "createdAt");
CREATE INDEX "Appointment_workspaceId_startsAt_idx" ON "Appointment"("workspaceId", "startsAt");
CREATE INDEX "Offer_workspaceId_createdAt_idx" ON "Offer"("workspaceId", "createdAt");
CREATE INDEX "Deal_workspaceId_updatedAt_idx" ON "Deal"("workspaceId", "updatedAt");
CREATE INDEX "CommissionRule_workspaceId_effectiveFrom_idx" ON "CommissionRule"("workspaceId", "effectiveFrom");
CREATE INDEX "AuditEvent_workspaceId_createdAt_idx" ON "AuditEvent"("workspaceId", "createdAt");

ALTER TABLE "Owner" ADD CONSTRAINT "Owner_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Property" ADD CONSTRAINT "Property_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommissionRule" ADD CONSTRAINT "CommissionRule_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PropertyOwner" DROP CONSTRAINT "PropertyOwner_propertyId_fkey", ADD CONSTRAINT "PropertyOwner_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyOwner" DROP CONSTRAINT "PropertyOwner_ownerId_fkey", ADD CONSTRAINT "PropertyOwner_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyMedia" DROP CONSTRAINT "PropertyMedia_propertyId_fkey", ADD CONSTRAINT "PropertyMedia_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_propertyId_fkey", ADD CONSTRAINT "Appointment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommissionRule" DROP CONSTRAINT "CommissionRule_propertyId_fkey", ADD CONSTRAINT "CommissionRule_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeadAttribution" DROP CONSTRAINT "LeadAttribution_leadId_fkey", ADD CONSTRAINT "LeadAttribution_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
