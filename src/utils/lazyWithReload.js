import { lazy } from 'react';

/**
 * React.lazy that survives redeploys: if a chunk from an older build is gone
 * (the visitor's tab still runs the previous index.html), reload the page
 * once to fetch the current build instead of showing a blank page.
 */
export function lazyWithReload(factory) {
  return lazy(() =>
    factory().catch((err) => {
      const key = 'seair:chunk-reload';
      let reloaded = false;
      try {
        reloaded = sessionStorage.getItem(key) === '1';
        if (!reloaded) sessionStorage.setItem(key, '1');
      } catch {
        /* storage blocked: fall through and reload anyway */
      }
      if (!reloaded) {
        window.location.reload();
        return new Promise(() => {}); // keep Suspense fallback until reload
      }
      throw err;
    })
  );
}

/** Clear the reload guard once the app has loaded successfully. */
export function clearChunkReloadFlag() {
  try {
    sessionStorage.removeItem('seair:chunk-reload');
  } catch {
    /* ignore */
  }
}
