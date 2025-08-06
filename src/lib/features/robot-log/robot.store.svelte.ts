import { domObserverService } from "$lib/features/dom-observer/dom-observer.service";
import { scrollY } from "svelte/reactivity/window";
import {
  getFailedTestElements,
  getTotalFailedTestCount,
  parseTestFromElement,
  scrollToTest,
} from "./robot-dom.service";
import type { RobotState, RobotTest } from "./robot.types";

export class RobotStore implements RobotState {
  #failedTestElements: HTMLElement[] = [];
  #failedTests = $state<RobotTest[]>([]);
  #totalFailedTestCount = $state(0);
  #currentTestId = $state<string | null>(null);

  readonly #currentTestIndex = $derived(
    this.#failedTests.findIndex((test) => test.id === this.#currentTestId),
  );
  readonly #currentTest = $derived(
    this.#failedTests[this.#currentTestIndex] ?? null,
  );
  readonly #isLoading = $derived(
    this.#failedTests.length === 0 ||
      this.#failedTests.length !== this.#totalFailedTestCount,
  );

  init = (): (() => void) => {
    const cleanupScrollEffect = $effect.root(() => {
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

    const cleanupDomObserver = domObserverService.subscribe(() => {
      this.#failedTestElements = getFailedTestElements();
      this.#failedTests = this.#failedTestElements.map(parseTestFromElement);
      this.#totalFailedTestCount = getTotalFailedTestCount();
    });

    return () => {
      cleanupDomObserver();
      cleanupScrollEffect();
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

  goToPreviousTest = (): void => {
    if (this.currentTestIndex > 0) {
      const previousElement =
        this.#failedTestElements[this.currentTestIndex - 1];
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

export const robotStore = new RobotStore();
