<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { goToNextTest, goToPreviousTest } from "$lib/robot/navigation";
  import type { RobotTest } from "$lib/robot/types";
  import { ArrowLeft, ArrowRight } from "lucide-svelte";
  import KeyboardNavigation from "./KeyboardNavigation.svelte";

  let {
    failedTests,
    currentTestId,
    currentTestIndex,
    totalFailedTestCount,
    isPageLoaded,
  }: {
    failedTests: RobotTest[];
    currentTestId: string;
    currentTestIndex: number;
    totalFailedTestCount: number | undefined;
    isPageLoaded: boolean;
  } = $props();

  let isPreviousTestAvailable = $derived(currentTestIndex > 0);
  let isNextTestAvailable = $derived(
    totalFailedTestCount && currentTestIndex < totalFailedTestCount - 1
  );
</script>

<KeyboardNavigation
  handleLeft={() => goToPreviousTest(currentTestId)}
  handleRight={() => goToNextTest(currentTestId)}
/>

<div class="flex gap-2">
  <Button
    on:click={() => goToPreviousTest(currentTestId)}
    disabled={!isPreviousTestAvailable}
    variant="outline"
    size="icon"
  >
    <ArrowLeft class="h-4 w-4" />
  </Button>
  <Button
    on:click={() => goToNextTest(currentTestId)}
    disabled={!isNextTestAvailable}
    variant="outline"
    size="icon"
  >
    <ArrowRight class="h-4 w-4" />
  </Button>
</div>
<span
  class="whitespace-nowrap overflow-hidden text-ellipsis flex-grow text-left pl-4"
>
  <span class="font-bold mr-1">
    [{currentTestIndex + 1} / {failedTests.length}]
  </span>
  {failedTests[currentTestIndex]?.name}
  <span>
    {#if !isPageLoaded}
      (Loading..)
    {/if}
  </span>
</span>
