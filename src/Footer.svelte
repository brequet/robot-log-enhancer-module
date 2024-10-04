<svelte:options customElement="robot-footer" />

<script lang="ts">
  import CopyToClipboardButton from "$lib/components/custom/CopyToClipboardButton.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog";
  import { goToNextTest, goToPreviousTest } from "$lib/robot/navigation";
  import type { RobotTest } from "$lib/robot/types";
  import {
    collapseRetryKeywords,
    getFailedTestsElementFromPage,
    getNumberOfFailedTestsFromPage,
  } from "$lib/robot/utils";
  import { onMount } from "svelte";
  import Tailwind from "./tailwind.svelte";

  let failedTests = $state([] as RobotTest[]);

  let currentTestId = $state("");
  let totalFailedTestCount: number | undefined = $state(undefined);

  let currentTestIndex = $derived(
    failedTests.map((e: RobotTest) => e.id).indexOf(currentTestId),
  );

  let isPageLoaded = $derived(
    totalFailedTestCount && failedTests.length === totalFailedTestCount,
  );

  let isPreviousTestAvailable = $derived(currentTestIndex > 0);
  let isNextTestAvailable = $derived(
    totalFailedTestCount && currentTestIndex < totalFailedTestCount - 1,
  );

  let failingTestsAsRobotParams = $derived.by(() => {
    return failedTests
      .map((e: RobotTest) => `--test "${e.name}"`)
      .join(" ")
      .trim();
  });

  $effect(() => {
    if (isPageLoaded) collapseRetryKeywords();
  });

  onMount(() => {
    const updateFailedTestsAndCurrentTestId = () => {
      const scrollPosition = window.scrollY;
      const divs = getFailedTestsElementFromPage() as HTMLDivElement[];

      failedTests = divs.map((testElement: HTMLElement) => {
        const id = testElement.id;
        const title =
          (testElement.querySelector(".element-header-left") as HTMLElement)
            ?.title ?? "";
        return {
          name: title,
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
  <Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
      Print all failing tests as robot test params in console
    </Dialog.Trigger>
    <Dialog.Content class="max-w-3xl">
      <Dialog.Header>
        <Dialog.Title>Failing tests as Robot params</Dialog.Title>
        <Dialog.Description>
          You can copy and use these params to relaunch only failing tests.
        </Dialog.Description>
      </Dialog.Header>
      <div
        class="bg-muted text-muted-foreground p-4 pt-1 rounded-lg flex flex-col items-end"
      >
        <CopyToClipboardButton text={failingTestsAsRobotParams} />
        <pre
          class="whitespace-pre-wrap break-all font-mono">{failingTestsAsRobotParams}</pre>
      </div>
    </Dialog.Content>
  </Dialog.Root>

  <div class="flex items-center justify-between w-full mr-6">
    <span
      class="whitespace-nowrap overflow-hidden text-ellipsis flex-grow text-left pl-4"
    >
      {failedTests[currentTestIndex]?.name}
      <span class="font-bold">
        ({currentTestIndex + 1} / {failedTests.length})
      </span>
      <span>
        {#if !isPageLoaded}
          (Loading..)
        {/if}
      </span>
    </span>
    <div class="flex gap-2">
      <Button
        on:click={() => goToPreviousTest(currentTestId)}
        disabled={!isPreviousTestAvailable}
      >
        Previous
      </Button>
      <Button
        on:click={() => goToNextTest(currentTestId)}
        disabled={!isNextTestAvailable}
      >
        Next
      </Button>
    </div>
  </div>
</footer>
