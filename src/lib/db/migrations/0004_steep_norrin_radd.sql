CREATE TABLE "oauth_access_token" (
	"id" text PRIMARY KEY NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"client_id" text,
	"user_id" text,
	"scopes" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "oauth_access_token_access_token_unique" UNIQUE("access_token"),
	CONSTRAINT "oauth_access_token_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
CREATE TABLE "oauth_application" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"icon" text,
	"metadata" text,
	"client_id" text,
	"client_secret" text,
	"redirect_u_r_ls" text,
	"type" text,
	"disabled" boolean,
	"user_id" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "oauth_application_client_id_unique" UNIQUE("client_id")
);
--> statement-breakpoint
CREATE TABLE "oauth_consent" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text,
	"user_id" text,
	"scopes" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	"consent_given" boolean
);
--> statement-breakpoint
DROP INDEX "account_user_id_index";--> statement-breakpoint
DROP INDEX "account_provider_id_index";--> statement-breakpoint
DROP INDEX "invitation_organization_id_index";--> statement-breakpoint
DROP INDEX "invitation_email_index";--> statement-breakpoint
DROP INDEX "member_organization_id_index";--> statement-breakpoint
DROP INDEX "member_user_id_index";--> statement-breakpoint
DROP INDEX "organization_slug_index";--> statement-breakpoint
DROP INDEX "passkey_user_id_index";--> statement-breakpoint
DROP INDEX "passkey_credential_id_index";--> statement-breakpoint
DROP INDEX "session_user_id_index";--> statement-breakpoint
DROP INDEX "session_token_index";--> statement-breakpoint
DROP INDEX "two_factor_user_id_index";--> statement-breakpoint
DROP INDEX "two_factor_secret_index";--> statement-breakpoint
DROP INDEX "user_email_index";--> statement-breakpoint
DROP INDEX "user_id_index";--> statement-breakpoint
DROP INDEX "verification_identifier_index";--> statement-breakpoint
DROP INDEX "verification_value_index";--> statement-breakpoint
ALTER TABLE "invitation" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "role" SET DEFAULT 'member';