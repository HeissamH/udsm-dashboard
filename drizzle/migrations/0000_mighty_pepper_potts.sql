CREATE TYPE "public"."user_role" AS ENUM('public', 'admin');--> statement-breakpoint
CREATE TYPE "public"."paper_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('view', 'download', 'citation');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" varchar(255),
	"role" "user_role" DEFAULT 'public' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "papers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"abstract" text NOT NULL,
	"authors" text[] NOT NULL,
	"keywords" text[] NOT NULL,
	"publication_date" date NOT NULL,
	"journal_name" varchar(255) NOT NULL,
	"doi" varchar(255),
	"pdf_url" varchar(500) NOT NULL,
	"cover_image_url" varchar(500),
	"category" varchar(100) NOT NULL,
	"status" "paper_status" DEFAULT 'draft' NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "papers_doi_unique" UNIQUE("doi")
);
--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"paper_id" uuid NOT NULL,
	"event_type" "event_type" NOT NULL,
	"ip_hash" varchar(64) NOT NULL,
	"country_code" varchar(2),
	"country_name" varchar(100),
	"city" varchar(100),
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"user_agent" varchar(500),
	"referrer" varchar(500),
	"session_id" varchar(255) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "geolocation_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_hash" varchar(64) NOT NULL,
	"country_code" varchar(2) NOT NULL,
	"country_name" varchar(100) NOT NULL,
	"city" varchar(100),
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"cached_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "geolocation_cache_ip_hash_unique" UNIQUE("ip_hash")
);
--> statement-breakpoint
CREATE TABLE "citations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"paper_id" uuid NOT NULL,
	"citing_work_title" varchar(500) NOT NULL,
	"citing_authors" text[] NOT NULL,
	"citation_date" date NOT NULL,
	"source" varchar(100) NOT NULL,
	"url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "papers" ADD CONSTRAINT "papers_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citations" ADD CONSTRAINT "citations_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "papers_title_idx" ON "papers" USING btree ("title");--> statement-breakpoint
CREATE INDEX "papers_publication_date_idx" ON "papers" USING btree ("publication_date");--> statement-breakpoint
CREATE INDEX "papers_status_idx" ON "papers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "papers_category_idx" ON "papers" USING btree ("category");--> statement-breakpoint
CREATE INDEX "analytics_paper_timestamp_idx" ON "analytics_events" USING btree ("paper_id","timestamp");--> statement-breakpoint
CREATE INDEX "analytics_event_type_timestamp_idx" ON "analytics_events" USING btree ("event_type","timestamp");--> statement-breakpoint
CREATE INDEX "analytics_country_code_idx" ON "analytics_events" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "analytics_session_dedupe_idx" ON "analytics_events" USING btree ("session_id","paper_id","event_type");--> statement-breakpoint
CREATE INDEX "geolocation_ip_hash_idx" ON "geolocation_cache" USING btree ("ip_hash");--> statement-breakpoint
CREATE INDEX "geolocation_expires_at_idx" ON "geolocation_cache" USING btree ("expires_at");