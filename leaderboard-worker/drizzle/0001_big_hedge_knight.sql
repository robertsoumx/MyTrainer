ALTER TABLE `attempts` ADD `protocol` text DEFAULT 'v5' NOT NULL;--> statement-breakpoint
ALTER TABLE `benchmarks` ADD `protocol` text DEFAULT 'v5' NOT NULL;