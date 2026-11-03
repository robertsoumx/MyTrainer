# MyTrainer public leaderboard

Worker/D1 API for https://robertsoumx.github.io/MyTrainer/.

The current `focus4` protocol automatically records personal bests from ordinary 30-second practice in Precision, Target Switching, Tracking and Move & Shoot. Each drill has equal weight in the 0–1000 composite; all four need a positive result to appear. Adaptive difficulty is bound to the issued attempt and scored on the existing level-3 public scale. Only strictly better results update the stored best. Games and mouse/trackpad/touch remain separate. Existing focus4 benchmark bests remain a floor for new scores.

Earlier v5, 2d1 and fps1 records remain stored and queryable without entering focus4. Migration 0002 adds personal-best storage and attempt difficulty; existing records are never deleted or rewritten. Public username consent, hashed device keys, single-use timed attempts, validation, withdrawal and origin restrictions are preserved. Browser scores are not anti-cheat verified or official game ranks.

Run `npm test` and `npm run build`. Deploy through the existing Sites project and source repository.
