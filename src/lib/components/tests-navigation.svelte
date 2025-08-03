<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { goToNextTest, goToPreviousTest } from "$lib/robot/navigation";
  import type { RobotTest } from "$lib/robot/types";
  import { ArrowLeft, ArrowRight } from "lucide-svelte";
  import KeyboardNavigation from "./keyboard-navigation.svelte";

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
    totalFailedTestCount && currentTestIndex < totalFailedTestCount - 1,
  );
</script>

<KeyboardNavigation
  handleLeft={() => goToPreviousTest(currentTestId)}
  handleRight={() => goToNextTest(currentTestId)}
/>

<span
  class="flex-grow overflow-hidden pl-4 text-left text-ellipsis whitespace-nowrap"
>
  <span class="mr-1 font-bold">
    [{currentTestIndex + 1} / {failedTests.length}]
  </span>
  {failedTests[currentTestIndex]?.name}
  <span>
    {#if !isPageLoaded}
      (Loading..)
    {/if}
  </span>
</span>

<div class="flex gap-2">
  <Button
    onclick={() => goToPreviousTest(currentTestId)}
    disabled={!isPreviousTestAvailable}
    variant="outline"
    size="icon"
  >
    <ArrowLeft class="h-4 w-4" />
  </Button>
  <Button
    onclick={() => goToNextTest(currentTestId)}
    disabled={!isNextTestAvailable}
    variant="outline"
    size="icon"
  >
    <ArrowRight class="h-4 w-4" />
  </Button>
</div>
