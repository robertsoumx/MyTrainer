> Current release: v1.7, using the Three.js / Rapier FPS build. See [fps-controls.md](fps-controls.md) and [review-v17.md](review-v17.md). Earlier release notes below are historical.

# GitHub Pages: MyTrainer

Updated October 27, 2026 for version 1.5.0. Source: [robertsoumx/MyTrainer](https://github.com/robertsoumx/MyTrainer). The application retains the Stratum name.

**Application deployed:** [Open MyTrainer](https://robertsoumx.github.io/MyTrainer/). Version 1.5 source commit `ff1e3b8` passed all 94 checks, built and deployed successfully in [Actions run 40631724182](https://github.com/robertsoumx/MyTrainer/actions/runs/40631724182). The separately published Worker/D1 API supplies shared leaderboard records.

The repository also has GitHub's default branch/Jekyll publisher enabled. To avoid competing final deployments, the app workflow checks the current Pages mode. In branch mode, the workflow waits for **pages build and deployment** on the same commit to finish, then builds and publishes the application. The default dynamic workflow does not emit a usable `workflow_run` completion event here, so the order is checked directly through the Actions API. In Actions mode, pushes publish directly. Manual dispatch remains available. The workflow only reads Pages configuration; it does not change repository settings or require extra credentials.

## Repository setup

1. Keep the reviewed source tree on `main`, including `.github/workflows/pages.yml`, `package.json` / lockfile, application modules, graphics source, asset manifest/downloader, local catalog PNGs, credits, and documentation.
2. For a single publisher, open **Settings → Pages** and select **GitHub Actions** under **Build and deployment → Source**. The existing workflow supplies the build; no additional template is needed. Existing branch-mode repositories are handled by the publishing-order check described above. See [GitHub's publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
3. Push the reviewed tree to `main`, or manually run **Verify and publish MyTrainer** from Actions.
4. Check the build and deploy jobs, then open the deployment URL reported by the `github-pages` environment. Verify the application and local assets at that URL before calling the migration deployed.

## What the workflow publishes

`.github/workflows/pages.yml` triggers on `main` pushes and manual dispatch. A read-only publishing-order job waits for any default branch-mode build on the same commit, preventing the README build from becoming the final deployment. It uses Node 22, installs locked dependencies with `npm ci`, restores licensed assets with `python3 scripts/fetch-assets.py`, runs syntax checks and the test suite, then builds `dist/graphics.js` with `npm run build`. It configures Pages, uploads **`dist/`**, and deploys that artifact with the GitHub Pages actions. The workflow requests repository-read, Actions-read, Pages-write, and OIDC-token permissions; the deployment job uses the `github-pages` environment.

The website entry point is `dist/index.html`. Repository-root Markdown is source documentation; it is not the app entry point. The workflow uploads the generated app directory rather than publishing the repository root or a `docs/` branch folder. [GitHub's custom-workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) describes this artifact/deployment model.

## Assets and local development

`scripts/asset-downloads.json` identifies **23 pinned files** with upstream GitHub commit URLs and SHA-256 hashes: 21 licensed binary model/material/arm-texture files plus `dist/assets/fonts/InterVariable.woff2` and `Inter-OFL.txt`. `scripts/fetch-assets.py` reuses a matching local file or downloads, verifies, and writes the pinned payload. All 21 original model/texture remote payload hashes were checked for this migration; the browser font check confirmed local Inter loaded. Keep its OFL license, `dist/assets/credits.json`, catalog metadata, and `vendor-licenses.txt` with the output. The 19 official Riot catalog PNGs are committed source assets; they are not supplied by the downloader.

For a fresh local checkout, run:

```sh
npm ci
python3 scripts/fetch-assets.py
npm run check
npm test
npm run build
```

Serve `dist/` with a static HTTP server for preview. Rebuild after graphics-source changes; the generated graphics bundle is not a substitute for maintaining `src/realistic-renderer.js` and its build script. The migration's recorded checks are in [QA.md](../QA.md); build success does not verify Pages configuration or GPU appearance.

## Move an existing profile

On the previous host, use **Customize → Export backup** before changing hosts. On the new Pages URL, use **Import backup** and confirm replacement. Profiles are stored in browser local storage, which is separate for the new host; the repository and Pages workflow do not copy them. Older results remain archived under their original contexts, while version 1.6.0 mechanical practice establishes `:range2d1:<weapon-id>` baselines. Playable rounds use `:round2d1:<weapon-id>` and stay separate from full-skill baselines.

## Shared leaderboard

The Pages frontend calls a separate public Worker/D1 API. Its deployment manifest uses the documented `d1: "DB"` binding; generated Drizzle migrations are packaged with the Worker. API source and migration tests are retained under `leaderboard-worker/` in MyTrainer. Private session backups do not contain the public profile device credential. The public profile is tied to its browser; remove it in Customize before discarding that profile. See [version 1.5 review](review-v15.md).

The hosted API was verified after publication: health and an empty real leaderboard return HTTP 200 with the GitHub origin allowed; registration without consent is rejected, confirmed registration and challenge issuance work, an early score is rejected, and the disposable test profile is removed. No production leaderboard entries are seeded.


## 2D release · 1.6

The frontend loads `range2d.js`; the old graphics bundle is not loaded or rebuilt. Asset restoration uses `--2d` to skip 3D models and textures. The API supports separate `2d1` and legacy `v5` protocols through an additive migration, preserving existing names and results. The Pages workflow and public URLs are unchanged.
