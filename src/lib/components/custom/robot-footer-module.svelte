<!-- Robot Footer module, to be injected once in the robot log.html page to provide the footer and associated content -->
<svelte:options customElement="robot-footer-module" />

<script lang="ts">
  import { createRobotState } from "$lib/state/robot.svelte";
  import { injectFixedStyleForShadowDOM } from "$lib/styles/tw-style-injection";
  import Footer from "../robot-footer/footer.svelte";

  const componentHost = $host();
  injectFixedStyleForShadowDOM(componentHost);

  const robotData = createRobotState();

  let robotFooterModuleContainer: HTMLElement | null = $state(null);
</script>

<div bind:this={robotFooterModuleContainer}></div>

{#if robotFooterModuleContainer != null}
  <Footer state={robotData} moduleContainer={robotFooterModuleContainer} />
{/if}
