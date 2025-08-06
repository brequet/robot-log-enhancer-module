<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { ArrowLeft, ArrowRight } from "lucide-svelte";
  import { robotStore } from "$lib/store/robot.store.svelte";

  let isPreviousTestAvailable = $derived(robotStore.currentTestIndex > 0);
  let isNextTestAvailable = $derived(
    robotStore.currentTestIndex < robotStore.failedTests.length - 1,
  );

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      robotStore.goToPreviousTest();
    } else if (event.key === "ArrowRight") {
      robotStore.goToNextTest();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<span
  class="flex-grow overflow-hidden text-ellipsis whitespace-nowrap pl-4 text-left"
>
  {#if robotStore.failedTests.length > 0}
    <span class="mr-1 font-bold">
      [{robotStore.currentTestIndex + 1} / {robotStore.failedTests.length}]
    </span>
  {/if}

  {#if robotStore.currentTest}
    {robotStore.currentTest.name}
  {/if}

  {#if robotStore.isLoading}
    <span class="ml-2 animate-pulse">(Loading...)</span>
  {/if}
</span>

<div class="flex gap-2">
  <Button
    onclick={robotStore.goToPreviousTest}
    disabled={!isPreviousTestAvailable}
    variant="outline"
    size="icon"
    aria-label="Previous failed test"
  >
    <ArrowLeft class="h-4 w-4" />
  </Button>
  <Button
    onclick={robotStore.goToNextTest}
    disabled={!isNextTestAvailable}
    variant="outline"
    size="icon"
    aria-label="Next failed test"
  >
    <ArrowRight class="h-4 w-4" />
  </Button>
</div>
