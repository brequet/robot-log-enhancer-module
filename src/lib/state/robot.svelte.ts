import {
  getFailedTestElements,
  getTotalFailedTestCount,
  parseTestFromElement,
  scrollToTest,
} from "$lib/core/robot-dom.service";
import type { RobotState, RobotTest } from "$lib/core/types";
import { onMount } from "svelte";
import { scrollY } from "svelte/reactivity/window";

export function createRobotState(): RobotState {
  let failedTests = $state<RobotTest[]>([]);
  let totalFailedTestCount = $state(0);
  let currentTestId: string | null = $state(null);

  let failedTestElements: HTMLElement[] = [];

  const currentTestIndex = $derived(
    failedTests.findIndex((test) => test.id === currentTestId),
  );
  const currentTest = $derived(failedTests[currentTestIndex]);

  const isLoading = $derived(
    failedTests.length === 0 || failedTests.length !== totalFailedTestCount,
  );

  $effect(() => {
    const y = scrollY.current;
    if (!y) return;

    failedTestElements.forEach((el, index) => {
      const { offsetTop, offsetHeight } = el;
      if (index === 0 && y < offsetTop) {
        currentTestId = null;
      } else if (y >= offsetTop && y < offsetTop + offsetHeight) {
        if (currentTestId !== el.id) {
          currentTestId = el.id;
        }
      }
    });
  });

  onMount(() => {
    const handleDomChanges = () => {
      failedTestElements = getFailedTestElements();
      failedTests = failedTestElements.map(parseTestFromElement);
      totalFailedTestCount = getTotalFailedTestCount();
    };

    handleDomChanges(); // Initial run

    const observer = new MutationObserver(handleDomChanges);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
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
