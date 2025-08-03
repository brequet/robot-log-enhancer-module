<svelte:options
  customElement={{
    tag: "robot-footer-module",
  }}
/>

<script lang="ts">
  import { createRobotState } from "$lib/state/robot.svelte";
  import { injectFixedStyleForShadowDOM } from "$lib/styles/tw-style-injection";
  import Footer from "../footer.svelte";

  injectFixedStyleForShadowDOM($host());

  const robotData = createRobotState();
</script>

<Footer state={robotData} />
