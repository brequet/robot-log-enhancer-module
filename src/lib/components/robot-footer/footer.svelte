<script lang="ts">
  import type { RobotState } from "$lib/core/types";
  import FailingTestsDialogTrigger from "$lib/components/robot-footer/failing-tests-dialog-trigger.svelte";
  import TestsNavigation from "$lib/components/robot-footer/tests-navigation.svelte";

  let {
    state,
    moduleContainer,
  }: {
    state: RobotState;
    moduleContainer: HTMLElement;
  } = $props();
</script>

<footer
  class="bg-background text-primary fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center border-t px-4"
>
  <FailingTestsDialogTrigger
    failedTests={state.failedTests}
    portalProps={{ to: moduleContainer }}
  />

  <div class="mx-6 flex w-full items-center">
    <TestsNavigation {state} />
  </div>
</footer>
