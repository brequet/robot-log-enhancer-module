<!-- Robot Footer module, to be injected once in the robot log.html page to provide the footer and associated content -->
<svelte:options customElement="robot-footer-module" />

<script lang="ts">
  import { createRobotStore } from "$lib/state/robot.store.svelte";
  import { injectFixedStyleForShadowDOM } from "$lib/styles/tw-style-injection";
  import Footer from "../robot-footer/footer.svelte";

  injectFixedStyleForShadowDOM($host());

  const robotStore = createRobotStore();

  let dialogContainer: HTMLElement | null = $state(null);
</script>

<div bind:this={dialogContainer}></div>

{#if dialogContainer != null}
  <Footer {robotStore} {dialogContainer} />
{/if}
