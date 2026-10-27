# GitHub Pages: MyTrainer

Updated October 27, 2026 for version 1.4.0. Source: [robertsoumx/MyTrainer](https://github.com/robertsoumx/MyTrainer). The application retains the Stratum name.

**Application deployed:** [Open MyTrainer](https://robertsoumx.github.io/MyTrainer/). Version 1.4 source commit `d4539f9` passed all build steps and deployed in [Actions run 40543905439](https://github.com/robertsoumx/MyTrainer/actions/runs/40543905439). The application is published from the compiled `dist/` artifact.

The repository also has GitHub's default branch/Jekyll publisher enabled. To avoid competing final deployments, the app workflow checks the current Pages mode. In branch mode, the push run defers publishing until **pages build and deployment** completes; that completion triggers the application build and deployment. In Actions mode, pushes publish directly. Manual dispatch remains available. The workflow only reads Pages configuration; it does not change repository settings or require extra credentials.

## Repository setup

1. Keep the reviewed source tree on `main`, including `.github/workflows/pages.yml`, `package.json` / lockfile, application modules, graphics source, asset manifest/downloader, local catalog PNGs, credits, and documentation.
2. For a single publisher, open **Settings → Pages** and select **GitHub Actions** under **Build and deployment → Source**. The existing workflow supplies the build; no additional template is needed. Existing branch-mode repositories are handled by the completion trigger described above. See [GitHub's publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
3. Push the reviewed tree to `main`, or manually run **Verify and publish MyTrainer** from Actions.
4. Check the build and deploy jobs, then open the deployment URL reported by the `github-pages` environment. Verify the application and local assets at that URL before calling the migration deployed.

## What the workflow publishes

`.github/workflows/pages.yml` triggers on `main` pushes, manual dispatch and completion of GitHub’s default Pages workflow on `main`. A read-only publishing-mode job chooses when to publish, preventing the default README build from becoming the final deployment. It uses Node 22, installs locked dependencies with `npm ci`, restores licensed assets with `python3 scripts/fetch-assets.py`, runs syntax checks and the test suite, then builds `dist/graphics.js` with `npm run build`. It configures Pages, uploads **`dist/`**, and deploys that artifact with the GitHub Pages actions. The workflow requests repository-read, Pages-write, and OIDC-token permissions; the deployment job uses the `github-pages` environment.

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

On the previous host, use **Customize → Export backup** before changing hosts. On the new Pages URL, use **Import backup** and confirm replacement. Profiles are stored in browser local storage, which is separate for the new host; the repository and Pages workflow do not copy them. Older results remain archived under their original contexts, while version 1.4.0 mechanical practice establishes `:world3d4:<weapon-id>` baselines. Playable rounds use `:round3d1:<weapon-id>` and stay separate from full-skill baselines.
