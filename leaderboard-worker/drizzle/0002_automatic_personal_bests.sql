CREATE TABLE `personal_bests` (
	`player_id` text NOT NULL,
	`game` text NOT NULL,
	`input` text NOT NULL,
	`skill` text NOT NULL,
	`protocol` text NOT NULL,
	`score` real NOT NULL,
	`level` integer NOT NULL,
	`success` integer NOT NULL,
	`trials` integer NOT NULL,
	`duration` real NOT NULL,
	`attempt_id` text NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`player_id`, `game`, `input`, `skill`, `protocol`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `personal_best_attempt` ON `personal_bests` (`attempt_id`);--> statement-breakpoint
CREATE INDEX `personal_best_group` ON `personal_bests` (`game`,`input`,`protocol`);--> statement-breakpoint
ALTER TABLE `attempts` ADD `level` integer DEFAULT 3 NOT NULL;