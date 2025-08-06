type DomChangeCallback = () => void;

class DomObserverService {
  #observer: MutationObserver | null = null;
  #callbacks: Set<DomChangeCallback> = new Set();
  #isInitialized = false;

  init() {
    if (this.#isInitialized) {
      return;
    }

    const handleChanges: MutationCallback = () => {
      for (const callback of this.#callbacks) {
        callback();
      }
    };

    this.#observer = new MutationObserver(handleChanges);

    this.#observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-theme"],
      childList: true,
      subtree: true,
    });

    this.#isInitialized = true;
  }

  subscribe(callback: DomChangeCallback): () => void {
    if (!this.#isInitialized) {
      this.init();
    }

    this.#callbacks.add(callback);
    callback();

    return () => {
      this.#callbacks.delete(callback);
    };
  }
}

export const domObserverService = new DomObserverService();
