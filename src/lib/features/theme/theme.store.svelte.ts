// src/lib/features/theme/theme.store.svelte.ts
import { domObserverService } from "$lib/features/dom-observer/dom-observer.service";

export type Theme = "light" | "dark";

class ThemeStore {
  #theme = $state<Theme>("light");
  #cleanupEffect: (() => void) | null = null;

  init = (): (() => void) => {
    if (this.#cleanupEffect) {
      return this.#cleanupEffect;
    }

    this.#cleanupEffect = $effect.root(() => {
      $effect(() => {
        const cleanupObserver = domObserverService.subscribe(() => {
          this.updateThemeFromDom();
        });

        return () => {
          cleanupObserver();
        };
      });
    });

    return this.#cleanupEffect;
  };

  private updateThemeFromDom() {
    const themeAttribute = document.body.getAttribute("data-theme");
    const newTheme = themeAttribute === "dark" ? "dark" : "light";

    if (this.#theme !== newTheme) {
      this.#theme = newTheme;
    }
  }

  get theme(): Theme {
    return this.#theme;
  }
}

export const themeStore = new ThemeStore();
