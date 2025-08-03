<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import type { RobotTest } from "$lib/core/robot/types";
  import { ArrowLeft, ArrowRight } from "lucide-svelte";

  let {
    testCount,
    currentTest,
    currentTestIndex,
    isPageLoaded,
    goToNextTest,
    goToPreviousTest,
  }: {
    testCount: number;
    currentTest: RobotTest | undefined;
    currentTestIndex: number;
    isPageLoaded: boolean;
    goToNextTest: () => void;
    goToPreviousTest: () => void;
  } = $props();

  let isPreviousTestAvailable = $derived(currentTestIndex > 0);
  let isNextTestAvailable = $derived(currentTestIndex < testCount - 1);

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      goToPreviousTest();
    } else if (event.key === "ArrowRight") {
      goToNextTest();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<span
  class="flex-grow overflow-hidden pl-4 text-left text-ellipsis whitespace-nowrap"
>
  <span class="mr-1 font-bold">
    [{(currentTestIndex ?? 0) + 1} / {testCount}]
  </span>
  {#if currentTest}
    {currentTest.name}
  {/if}
  {#if !isPageLoaded}
    <span class="ml-2 animate-pulse"> (Loading...) </span>
  {/if}
</span>

<div class="flex gap-2">
  <Button
    onclick={goToPreviousTest}
    disabled={!isPreviousTestAvailable}
    variant="outline"
    size="icon"
    aria-label="Previous failed test"
  >
    <ArrowLeft class="h-4 w-4" />
  </Button>
  <Button
    onclick={goToNextTest}
    disabled={!isNextTestAvailable}
    variant="outline"
    size="icon"
    aria-label="Next failed test"
  >
    <ArrowRight class="h-4 w-4" />
  </Button>
</div>
