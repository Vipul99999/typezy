# Typezy Installation Guide

## Overview

Typezy is an installable Progressive Web App (PWA) in **production**.

Important:

- `localhost` is **not** intended to be installable
- Typezy unregisters the service worker on local development hosts on purpose
- install testing should be done on a deployed **HTTPS** domain

## Installability Status

Typezy currently includes:

- a valid web app manifest
- install prompt handling
- production service-worker registration
- offline fallback route
- app icons
- standalone display mode

That means Typezy is installable when deployed correctly.

## Requirements For Installation

Typezy will be installable when all of the following are true:

1. The app is served over `https://`
2. `/manifest.webmanifest` is accessible
3. `/sw.js` is accessible
4. the service worker registers successfully
5. the browser supports PWA installation

## Local Development Note

Typezy intentionally disables service-worker registration on:

- `localhost`
- `127.0.0.1`
- `[::1]`

This is done to avoid stale local caches breaking development.

Because of that:

- you can run and test the app locally
- but local `localhost` should not be treated as the final install test environment

## How To Verify Installability After Deployment

### 1. Open the deployed HTTPS site

Example:

- `https://your-typezy-domain.com`

### 2. Open the manifest directly

Check:

- `https://your-typezy-domain.com/manifest.webmanifest`

It should load successfully.

### 3. Open the service worker directly

Check:

- `https://your-typezy-domain.com/sw.js`

It should load successfully.

### 4. Open the site in Chrome or Edge

Visit:

- `/`
- `/practice`

Use the site normally.

### 5. Trigger install eligibility

Typezy’s install banner is designed to appear after at least 2 sessions when the browser fires `beforeinstallprompt`.

So:

1. complete 2 practice sessions
2. return to the page
3. look for the install banner

### 6. Check browser install UI

In Chromium-based browsers, you may also see:

- install icon in the address bar
- browser menu option like `Install app`

## User Installation Steps

### Chrome or Edge on Desktop

1. Open the deployed Typezy site
2. Complete a couple of practice sessions if the custom banner has not appeared yet
3. Click the browser install icon or the Typezy install banner
4. Confirm installation

Typezy should then open in standalone app mode.

### Chrome on Android

1. Open the deployed Typezy site
2. Use the app briefly
3. Tap the install banner or browser install prompt
4. Confirm `Install`

### Safari on iPhone

Safari does not use the Chromium install event flow.

Users can install manually:

1. Open the deployed Typezy site in Safari
2. Tap the Share button
3. Choose `Add to Home Screen`
4. Confirm

## Troubleshooting

### The install prompt does not appear

Check:

- the site is on HTTPS
- the manifest loads correctly
- the service worker is registered
- the site is not already installed
- enough interaction has happened for the browser to consider installability

### The app installs but does not feel app-like

Check:

- manifest `display` is `standalone`
- `start_url` points to `/practice`
- theme and background colors are set

### The install banner never appears on localhost

That is expected.

Typezy disables service workers locally, so localhost is not the right environment for final PWA installation verification.

## Recommended Deployment QA

After deployment, verify:

1. `/manifest.webmanifest` returns `200`
2. `/sw.js` returns `200`
3. `/practice` works online
4. offline fallback works after first load
5. the install prompt or browser install UI appears on supported browsers
6. installed app opens directly into a clean app-like experience

## Current Practice-Page Gaps To Keep In Mind

The practice page is strong, but still worth polishing further:

- some interactions still need more device-by-device mobile tuning
- the practice surface can become even calmer during active typing
- the finish moment can still become more rewarding
- install behavior itself is ready, but the banner timing and education can be refined more

## Summary

Typezy is installable in production.

Use this rule:

- **local dev for building**
- **HTTPS deployment for real installation testing**
