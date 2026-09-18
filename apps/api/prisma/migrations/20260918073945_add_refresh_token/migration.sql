-- CreateTable
CREATE TABLE "refresh_token" (
    "id" UUID NOT NULL,
    "id_utilisateur" UUID NOT NULL,
    "token_hash" VARCHAR(128) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_hash_key" ON "refresh_token"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_token_id_utilisateur_idx" ON "refresh_token"("id_utilisateur");

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
