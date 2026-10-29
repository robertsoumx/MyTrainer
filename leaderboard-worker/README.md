# MyTrainer public leaderboard

Worker/D1 API for https://robertsoumx.github.io/MyTrainer/.

The current `focus4` protocol ranks Precision, Target Switching, Tracking and Move & Shoot. All four accepted level-3, 30-second benchmarks are required. The latest three runs per drill are averaged; each drill has equal weight in a 0–1000 composite. Aim drills count accuracy and normalized pace; tracking counts held-fire time on target. Games and mouse/trackpad/touch remain separate.

Earlier v5, 2d1 and fps1 records remain stored and queryable without entering focus4. No migration or historical data deletion is needed. Public username consent, hashed device keys, single-use timed attempts, validation, withdrawal and origin restrictions are preserved. Browser scores are not anti-cheat verified or official game ranks.

Run `npm test` and `npm run build`. Deploy through the existing Sites project and source repository.
