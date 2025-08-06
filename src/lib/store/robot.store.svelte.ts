import {
  getTotalFailedTestCount,
  parseTestFromElement,
  scrollToTest
} from '$lib/core/services/robot-dom.service';
import { createFailedTestObserver } from '$lib/core/services/robot-observer.service';
import type { RobotState, RobotTest } from '$lib/core/types';
import { scrollY } from 'svelte/reactivity/window';

export class RobotStore implements RobotState {
  #failedTestElements: HTMLElement[] = [];
  #failedTests = $state<RobotTest[]>([]);
  #totalFailedTestCount = $state(0);
  #currentTestId = $state<string | null>(null);

  readonly #currentTestIndex = $derived(
    this.#failedTests.findIndex((test) => test.id === this.#currentTestId)
  );
  readonly #currentTest = $derived(this.#failedTests[this.#currentTestIndex] ?? null);
  readonly #isLoading = $derived(
    this.#failedTests.length === 0 || this.#failedTests.length !== this.#totalFailedTestCount
  );

  /**
   * Initializes the store's DOM-related functionality and reactive effects.
   * This method should be called from within a component's `onMount` lifecycle hook.
   * It sets up the observer for failed tests and the effect for scroll tracking.
   * @returns A cleanup function to be called when the component is destroyed.
   */
  init = (): (() => void) => {
    const cleanupEffect = $effect.root(() => {
      $effect(() => {
        const y = scrollY.current;
        if (this.#isLoading || !y) return;

        this.#failedTestElements.forEach((el, index) => {
          const { offsetTop, offsetHeight } = el;
          if (index === 0 && y < offsetTop) {
            this.#currentTestId = null;
          } else if (y >= offsetTop && y < offsetTop + offsetHeight) {
            if (this.#currentTestId !== el.id) {
              this.#currentTestId = el.id;
            }
          }
        });
      });
    });

    const cleanupObserver = createFailedTestObserver((elements) => {
      this.#failedTestElements = elements;
      this.#failedTests = elements.map(parseTestFromElement);
      this.#totalFailedTestCount = getTotalFailedTestCount();
    });

    return () => {
      cleanupObserver();
      cleanupEffect();
    };
  };

  get failedTests(): RobotTest[] {
    return this.#failedTests;
  }
  get currentTest(): RobotTest | null {
    return this.#currentTest;
  }
  get currentTestIndex(): number {
    return this.#currentTestIndex;
  }
  get totalFailedTestCount(): number {
    return this.#totalFailedTestCount;
  }
  get isLoading(): boolean {
    return this.#isLoading;
  }

  // Public methods to navigate between failed tests.
  goToPreviousTest = (): void => {
    if (this.currentTestIndex > 0) {
      const previousElement = this.#failedTestElements[this.currentTestIndex - 1];
      scrollToTest(previousElement);
    }
  };

  goToNextTest = (): void => {
    if (this.currentTestIndex < this.failedTests.length - 1) {
      const nextElement = this.#failedTestElements[this.currentTestIndex + 1];
      scrollToTest(nextElement);
    }
  };
}

/**
 * The singleton instance of the RobotStore.
 * Import this instance to access the robot state from any component.
 */
export const robotStore = new RobotStore();
