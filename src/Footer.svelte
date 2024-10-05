<svelte:options customElement="robot-footer" />

<script lang="ts">
  import CopyFailingTestsModalButton from "$lib/components/custom/CopyFailingTestsModalButton.svelte";
  import TestNavigation from "$lib/components/custom/TestNavigation.svelte";
  import type { RobotTest } from "$lib/robot/types";
  import {
    collapseRetryKeywords,
    getFailedTestsElementFromPage,
    getNumberOfFailedTestsFromPage,
  } from "$lib/robot/utils";
  import { onMount } from "svelte";
  import Tailwind from "./tailwind.svelte";

  // TODO: create a store for failed tests and other stuff?

  let failedTests = $state([] as RobotTest[]);

  let currentTestId = $state("");
  let totalFailedTestCount: number | undefined = $state(undefined);

  let currentTestIndex = $derived(
    failedTests.map((e: RobotTest) => e.id).indexOf(currentTestId),
  );

  let isPageLoaded = $derived(failedTests.length === totalFailedTestCount);

  $effect(() => {
    if (isPageLoaded) collapseRetryKeywords();
  });

  onMount(() => {
    const updateFailedTestsAndCurrentTestId = () => {
      const scrollPosition = window.scrollY;
      const divs = getFailedTestsElementFromPage() as HTMLDivElement[];

      failedTests = divs.map((testElement: HTMLElement) => {
        const id = testElement.id;
        const divTitle =
          (testElement.querySelector(".element-header-left") as HTMLElement)
            ?.title ?? "";
        const testName = divTitle.replace(/TEST\s+(.*?)\s+\[FAIL\]/, "$1");
        return {
          name: testName,
          id,
        };
      });

      for (let i = 0; i < divs.length; i++) {
        const div = divs[i];
        const divTop = div.offsetTop;
        const divHeight = div.offsetHeight;

        if (i === 0 && scrollPosition < divTop) {
          currentTestId = "";
        } else if (
          scrollPosition >= divTop &&
          scrollPosition < divTop + divHeight &&
          currentTestId !== div.id
        ) {
          currentTestId = div.id;
        }
      }
    };

    window.addEventListener("scroll", updateFailedTestsAndCurrentTestId);

    const handleDomChanges = () => {
      updateFailedTestsAndCurrentTestId();
      totalFailedTestCount = getNumberOfFailedTestsFromPage();
    };

    const observer = new MutationObserver(() => {
      handleDomChanges();
    });

    // Start observing the entire document for changes
    observer.observe(document, {
      childList: true, // Observe direct children of the target node
      subtree: true, // Observe all descendants of the target node
      attributes: true, // Observe changes to attributes of the target node
    });

    return () => {
      window.removeEventListener("scroll", updateFailedTestsAndCurrentTestId);
      observer.disconnect();
    };
  });
</script>

<Tailwind />

<footer
  class="fixed left-0 right-0 bottom-0 w-full bg-slate-100 p-2 border-t border-gray-300 flex flex-row z-10"
>
  <!-- TODO: on left a menu that reveals buttons for copy, or other things.. -->
  <CopyFailingTestsModalButton {failedTests} />

  <div class="flex items-center w-full mx-6">
    <TestNavigation
      {failedTests}
      {currentTestId}
      {currentTestIndex}
      {totalFailedTestCount}
      {isPageLoaded}
    />
  </div>
</footer>
