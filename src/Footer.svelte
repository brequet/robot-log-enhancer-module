<svelte:options customElement="robot-footer" />

<script lang="ts">
  import Tailwind from "./tailwind.svelte";
  import { onMount } from "svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog";
  import { goToPreviousTest, goToNextTest } from "$lib/robot/navigation";
  import {
    getTestNameFromTestId,
    getFailedTestsElement,
    getTestIndexFromTestId,
    collapseRetryKeywords,
  } from "$lib/robot/utils";
  import CopyToClipboardButton from "$lib/components/custom/CopyToClipboardButton.svelte";

  let currentTestId = $state("");
  let totalFailedTestCount: number | undefined = $state(undefined);

  const currentTestName = $derived(getTestNameFromTestId(currentTestId));
  const currentTestHumanIndex = $derived(
    getTestIndexFromTestId(currentTestId) + 1
  );

  let failingTestsAsRobotParams = $derived.by(() => {
    if (!totalFailedTestCount) return "";
    return getFailedTestsElement()
      .map(
        (e) =>
          e.querySelector(".element-header-left > .name")?.textContent ?? ""
      )
      .map((e) => `--test "${e}"`)
      .join(" ")
      .trim();
  });

  onMount(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const divs = getFailedTestsElement() as HTMLDivElement[];

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

    window.addEventListener("scroll", handleScroll);

    const handleDomChanges = () => {
      handleScroll();
      totalFailedTestCount = getFailedTestsElement().length;
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
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  });
</script>

<Tailwind />

<footer
  class="fixed left-0 right-0 bottom-0 w-full bg-slate-100 p-2 border-t border-gray-300 flex flex-row z-10"
>
  <div class="flex flex-nowrap gap-2">
    <Button on:click={collapseRetryKeywords}>
      Collapse all but last children
    </Button>

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
  </div>

  <div class="flex items-center justify-between w-full mr-6">
    <span
      class="whitespace-nowrap overflow-hidden text-ellipsis flex-grow text-left pl-4"
    >
      {currentTestName}
      <span class="font-bold">
        ({currentTestHumanIndex} / {totalFailedTestCount})
      </span>
    </span>
    <div class="flex gap-2">
      <Button on:click={() => goToPreviousTest(currentTestId)}>Previous</Button>
      <Button on:click={() => goToNextTest(currentTestId)}>Next</Button>
    </div>
  </div>
</footer>
