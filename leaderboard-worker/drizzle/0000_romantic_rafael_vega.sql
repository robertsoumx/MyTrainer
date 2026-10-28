CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`game` text NOT NULL,
	`input` text NOT NULL,
	`skill` text NOT NULL,
	`created_at` integer NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `attempts_player` ON `attempts` (`player_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `benchmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`attempt_id` text NOT NULL,
	`player_id` text NOT NULL,
	`game` text NOT NULL,
	`input` text NOT NULL,
	`skill` text NOT NULL,
	`success` integer NOT NULL,
	`trials` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `benchmark_attempt` ON `benchmarks` (`attempt_id`);--> statement-breakpoint
CREATE INDEX `benchmark_group` ON `benchmarks` (`game`,`input`,`player_id`,`skill`);--> statement-breakpoint
CREATE TABLE `players` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`name_key` text NOT NULL,
	`token_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `players_name` ON `players` (`name_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `players_token` ON `players` (`token_hash`);