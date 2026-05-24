CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"program_id" uuid NOT NULL,
	"title" text NOT NULL,
	"severity" text NOT NULL,
	"priority" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"weakness" text,
	"affected_url" text,
	"affected_method" text,
	"root_cause" text,
	"impact" text,
	"steps_to_reproduce" text,
	"remediation" text,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "findings_id_user_id_unique" UNIQUE("id","user_id")
);
--> statement-breakpoint
CREATE TABLE "generated_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"finding_id" uuid NOT NULL,
	"template_id" uuid,
	"content_markdown" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "http_artifacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"finding_id" uuid NOT NULL,
	"type" text NOT NULL,
	"raw_input" text,
	"parsed_method" text,
	"parsed_url" text,
	"parsed_headers" jsonb,
	"parsed_body" text,
	"response_status" integer,
	"response_headers" jsonb,
	"response_body" text,
	"redacted_output" text,
	"redacted_fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"platform" text,
	"program_url" text,
	"scope_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "programs_id_user_id_unique" UNIQUE("id","user_id")
);
--> statement-breakpoint
CREATE TABLE "report_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"weakness" text,
	"content_markdown" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_program_id_user_id_programs_fk" FOREIGN KEY ("program_id","user_id") REFERENCES "public"."programs"("id","user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_reports" ADD CONSTRAINT "generated_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_reports" ADD CONSTRAINT "generated_reports_template_id_report_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."report_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_reports" ADD CONSTRAINT "generated_reports_finding_id_user_id_findings_fk" FOREIGN KEY ("finding_id","user_id") REFERENCES "public"."findings"("id","user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "http_artifacts" ADD CONSTRAINT "http_artifacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "http_artifacts" ADD CONSTRAINT "http_artifacts_finding_id_user_id_findings_fk" FOREIGN KEY ("finding_id","user_id") REFERENCES "public"."findings"("id","user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_templates" ADD CONSTRAINT "report_templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "findings_user_id_idx" ON "findings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "findings_user_id_program_id_idx" ON "findings" USING btree ("user_id","program_id");--> statement-breakpoint
CREATE INDEX "findings_user_id_severity_idx" ON "findings" USING btree ("user_id","severity");--> statement-breakpoint
CREATE INDEX "findings_user_id_status_idx" ON "findings" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "findings_user_id_created_at_idx" ON "findings" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "generated_reports_user_id_idx" ON "generated_reports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "generated_reports_user_id_finding_id_idx" ON "generated_reports" USING btree ("user_id","finding_id");--> statement-breakpoint
CREATE INDEX "http_artifacts_user_id_idx" ON "http_artifacts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "http_artifacts_user_id_finding_id_idx" ON "http_artifacts" USING btree ("user_id","finding_id");--> statement-breakpoint
CREATE INDEX "programs_user_id_idx" ON "programs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "programs_user_id_name_idx" ON "programs" USING btree ("user_id","name");--> statement-breakpoint
CREATE INDEX "report_templates_user_id_idx" ON "report_templates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "report_templates_weakness_idx" ON "report_templates" USING btree ("weakness");--> statement-breakpoint
CREATE INDEX "report_templates_is_default_idx" ON "report_templates" USING btree ("is_default");