import {
  getTotalFailedTestCount,
  parseTestFromElement,
  scrollToTest,
} from "$lib/core/services/robot-dom.service";
import { createFailedTestObserver } from "$lib/core/services/robot-observer.service";
import type { RobotState, RobotTest } from "$lib/core/types";
import { onMount } from "svelte";
import { scrollY } from "svelte/reactivity/window";

/**
 * A composable function that creates and manages the reactive state for the Robot Log Enhancer.
 * This must be called during a component's initialization.
 */
export function createRobotStore(): RobotState {
  let failedTestElements: HTMLElement[] = [];
  let failedTests = $state<RobotTest[]>([]);
  let totalFailedTestCount = $state(0);
  let currentTestId = $state<string | null>(null);

  const currentTestIndex = $derived(
    failedTests.findIndex((test) => test.id === currentTestId),
  );

  const currentTest = $derived(failedTests[currentTestIndex] ?? null);

  const isLoading = $derived(
    failedTests.length === 0 || failedTests.length !== totalFailedTestCount,
  );

  // This $effect is correctly scoped because createRobotStore() is called
  // during component initialization. It tracks the current test on scroll.
  $effect(() => {
    const y = scrollY.current;
    if (isLoading || !y) return;

    for (const el of failedTestElements) {
      const { offsetTop, offsetHeight } = el;
      if (y >= offsetTop && y < offsetTop + offsetHeight) {
        if (currentTestId !== el.id) {
          currentTestId = el.id;
        }
        // Exit early once the current test is found
        return;
      }
    }
  });

  // onMount sets up the DOM observer and its cleanup.
  onMount(() => {
    const cleanupObserver = createFailedTestObserver((elements) => {
      failedTestElements = elements;
      failedTests = elements.map(parseTestFromElement);
      totalFailedTestCount = getTotalFailedTestCount();
    });

    // The observer is disconnected when the component is destroyed.
    return () => cleanupObserver();
  });

  function goToPreviousTest() {
    if (currentTestIndex > 0) {
      const previousElement = failedTestElements[currentTestIndex - 1];
      scrollToTest(previousElement);
    }
  }

  function goToNextTest() {
    if (currentTestIndex < failedTests.length - 1) {
      const nextElement = failedTestElements[currentTestIndex + 1];
      scrollToTest(nextElement);
    }
  }

  // Return the reactive API for the component to use.
  return {
    get failedTests() {
      return failedTests;
    },
    get currentTest() {
      return currentTest;
    },
    get currentTestIndex() {
      return currentTestIndex;
    },
    get totalFailedTestCount() {
      return totalFailedTestCount;
    },
    get isLoading() {
      return isLoading;
    },
    goToPreviousTest,
    goToNextTest,
  };
}
