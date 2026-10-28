# MyTrainer public leaderboard API

Dependency-free Worker ESM with a Sites-managed D1 database. The frontend remains at robertsoumx.github.io/MyTrainer/. The public API only stores confirmed usernames, hashed device keys, timed attempt records and submitted benchmark metrics. No email, native-game credentials or private drill histories are collected.

The v5 composite averages the latest three level-3 quality values for each of eight mechanical skills, treats missing skills as zero, and scales the result to 0–1000. A player appears after three skills. Game and input devices have separate boards. Results are browser-reported and unverified; server timing, ownership and replay checks are not anti-cheat.

Run `npm test`, `npm run db:generate` after schema changes, and `npm run build`. The build packages worker/index.js as dist/server/index.js and includes the manifest plus immutable Drizzle migrations in dist/.openai/. Hosted migrations run through Sites publication. Local tests apply the same SQL to a separate SQLite database.
