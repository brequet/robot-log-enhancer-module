<svelte:options
  customElement={{
    tag: "robot-footer",
  }}
/>

<script lang="ts">
  import type { RobotTest } from "$lib/robot/types";
  import {
    getFailedTestsElementFromPage,
    getNumberOfFailedTestsFromPage,
  } from "$lib/robot/utils";
  import { injectFixedStyleForShadowDOM } from "$lib/styling/tw-style-injection";
  import { onMount } from "svelte";
  import TestsNavigation from "../tests-navigation.svelte";

  injectFixedStyleForShadowDOM($host());

  let failedTests = $state([] as RobotTest[]);

  let currentTestId = $state("");
  let totalFailedTestCount: number | undefined = $state(undefined);

  let currentTestIndex = $derived(
    failedTests.map((e: RobotTest) => e.id).indexOf(currentTestId),
  );

  let isPageLoaded = $derived(failedTests.length === totalFailedTestCount);

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

    const restRequestKeywordRegex = /RequestsLibrary\.(POST|GET|PUT|DELETE)/;

    const addCopyToCurlButtonToRestRequest = () => {
      [...document.getElementsByClassName("keyword")]
        .filter(
          (kw) =>
            (
              kw.querySelector(".element-header-left") as HTMLElement
            )?.title.match(restRequestKeywordRegex) &&
            kw.querySelector("rest-to-curl") == null,
        )
        .forEach((restKeywordElement) => {
          const requestSpan = restKeywordElement.querySelector(
            ".children > .info-message .message",
          ) as HTMLElement;
          if (requestSpan == null || requestSpan.innerText == null) return;

          const curlModalButton = document.createElement("rest-to-curl") as any;
          curlModalButton.restRequestStr = requestSpan.innerText;
          requestSpan.appendChild(curlModalButton);
        });
    };

    const handleDomChanges = () => {
      updateFailedTestsAndCurrentTestId();
      addCopyToCurlButtonToRestRequest();
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

<footer
  class="fixed right-0 bottom-0 left-0 z-50 flex h-16 w-full items-center border-t bg-background px-4 text-primary"
>
  <div class="mx-6 flex w-full items-center">
    <TestsNavigation
      {failedTests}
      {currentTestId}
      {currentTestIndex}
      {totalFailedTestCount}
      {isPageLoaded}
    />
  </div>
</footer>
