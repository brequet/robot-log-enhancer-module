// src/lib/hooks/use-robot-data.svelte.ts

import {
  getFailedTestElements,
  getNumberOfFailedTestsFromPage,
  parseTestFromElement,
  scrollToTest,
} from "$lib/core/robot/dom";
import type { RobotTest } from "$lib/core/robot/types";
import { onMount } from "svelte";
import { scrollY } from "svelte/reactivity/window";

export function useRobotData() {
  let failedTests = $state<RobotTest[]>([]);
  let totalFailedTestCount = $state(0);
  let currentTestId: string | null = $state("");

  let _failedTestElements: HTMLElement[] = [];

  const currentTestIndex = $derived(
    failedTests.findIndex((test) => test.id === currentTestId),
  );

  const isPageLoaded = $derived(
    failedTests.length > 0 && failedTests.length === totalFailedTestCount,
  );

  $effect(() => {
    const y = scrollY.current;
    if (!y) return;

    _failedTestElements.forEach((el, index) => {
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
      _failedTestElements = getFailedTestElements();
      failedTests = _failedTestElements.map(parseTestFromElement);
      totalFailedTestCount = getNumberOfFailedTestsFromPage();
    };

    handleDomChanges();

    const observer = new MutationObserver(handleDomChanges);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  });

  function goToPreviousTest() {
    if (currentTestIndex > 0) {
      const previousElement = _failedTestElements[currentTestIndex - 1];
      scrollToTest(previousElement);
    }
  }

  function goToNextTest() {
    if (currentTestIndex < failedTests.length - 1) {
      const nextElement = _failedTestElements[currentTestIndex + 1];
      scrollToTest(nextElement);
    }
  }

  return {
    get failedTests() {
      return failedTests;
    },
    get currentTest() {
      return failedTests[currentTestIndex];
    },
    get currentTestIndex() {
      return currentTestIndex;
    },
    get totalFailedTestCount() {
      return totalFailedTestCount;
    },
    get isPageLoaded() {
      return isPageLoaded;
    },
    goToPreviousTest,
    goToNextTest,
  };
}
