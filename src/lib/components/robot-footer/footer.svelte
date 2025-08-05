<script lang="ts">
  import FailedTestDialog from "$lib/components/robot-footer/failed-tests-dialog.svelte";
  import TestNavigator from "$lib/components/robot-footer/tests-navigator.svelte";
  import type { RobotState } from "$lib/core/types";

  let {
    robotStore,
    dialogContainer,
  }: {
    robotStore: RobotState;
    dialogContainer: HTMLElement;
  } = $props();
</script>

<footer
  class="bg-background text-primary fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center border-t px-4"
>
  <FailedTestDialog failedTests={robotStore.failedTests} {dialogContainer} />

  <div class="mx-6 flex w-full items-center">
    <TestNavigator {robotStore} />
  </div>
</footer>
