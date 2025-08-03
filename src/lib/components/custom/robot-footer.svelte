<svelte:options
  customElement={{
    tag: "robot-footer",
  }}
/>

<script lang="ts">
  import { createRobotState } from "$lib/state/robot.svelte";
  import { injectFixedStyleForShadowDOM } from "$lib/styling/tw-style-injection";
  import TestsNavigation from "../tests-navigation.svelte";

  injectFixedStyleForShadowDOM($host());

  const robotData = createRobotState();
</script>

<footer
  class="fixed right-0 bottom-0 left-0 z-50 flex h-16 w-full items-center border-t bg-background px-4 text-primary"
>
  <div class="mx-6 flex w-full items-center">
    <TestsNavigation state={robotData} />
  </div>
</footer>
