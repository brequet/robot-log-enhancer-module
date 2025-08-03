<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import type { RobotState } from "$lib/core/types";
  import { ArrowLeft, ArrowRight } from "lucide-svelte";

  let { state }: { state: RobotState } = $props();

  let isPreviousTestAvailable = $derived(state.currentTestIndex > 0);
  let isNextTestAvailable = $derived(
    state.currentTestIndex < state.failedTests.length - 1,
  );

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      state.goToPreviousTest();
    } else if (event.key === "ArrowRight") {
      state.goToNextTest();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<span
  class="flex-grow overflow-hidden text-ellipsis whitespace-nowrap pl-4 text-left"
>
  {#if state.failedTests.length > 0}
    <span class="mr-1 font-bold">
      [{state.currentTestIndex + 1} / {state.failedTests.length}]
    </span>
  {/if}

  {#if state.currentTest}
    {state.currentTest.name}
  {/if}

  {#if state.isLoading}
    <span class="ml-2 animate-pulse">(Loading...)</span>
  {/if}
</span>

<div class="flex gap-2">
  <Button
    onclick={state.goToPreviousTest}
    disabled={!isPreviousTestAvailable}
    variant="outline"
    size="icon"
    aria-label="Previous failed test"
  >
    <ArrowLeft class="h-4 w-4" />
  </Button>
  <Button
    onclick={state.goToNextTest}
    disabled={!isNextTestAvailable}
    variant="outline"
    size="icon"
    aria-label="Next failed test"
  >
    <ArrowRight class="h-4 w-4" />
  </Button>
</div>
