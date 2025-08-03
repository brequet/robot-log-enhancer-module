<svelte:options
  customElement={{
    tag: "robot-footer",
  }}
/>

<script lang="ts">
  import { useRobotData } from "$lib/hooks/use-robot-data.svelte";
  import { injectFixedStyleForShadowDOM } from "$lib/styling/tw-style-injection";
  import TestsNavigation from "../tests-navigation.svelte";

  injectFixedStyleForShadowDOM($host());

  const robotData = useRobotData();
</script>

<footer
  class="fixed right-0 bottom-0 left-0 z-50 flex h-16 w-full items-center border-t bg-background px-4 text-primary"
>
  <div class="mx-6 flex w-full items-center">
    <TestsNavigation
      testCount={robotData.failedTests.length}
      currentTest={robotData.currentTest}
      currentTestIndex={robotData.currentTestIndex}
      isPageLoaded={robotData.isPageLoaded}
      goToNextTest={robotData.goToNextTest}
      goToPreviousTest={robotData.goToPreviousTest}
    />
  </div>
</footer>
