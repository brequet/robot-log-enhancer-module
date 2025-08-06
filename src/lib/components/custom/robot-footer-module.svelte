<!-- Robot Footer module, to be injected once in the robot log.html page to provide the footer and associated content -->
<svelte:options customElement="robot-footer-module" />

<script lang="ts">
  import { robotStore } from "$lib/features/robot-log/robot.store.svelte.js";
  import { injectTailwindStyleForShadowDOM } from "$lib/styles/tailwind-style-injection";
  import Footer from "../robot-footer/footer.svelte";
  import { onMount, setContext } from "svelte";
  import { CONTEXT_KEY_DIALOG_CONTAINER } from "$lib/core/constants";

  injectTailwindStyleForShadowDOM($host());

  let dialogContainer: HTMLElement | null = $state(null);

  onMount(() => {
    return robotStore.init();
  });

  setContext(CONTEXT_KEY_DIALOG_CONTAINER, () => dialogContainer);
</script>

<div bind:this={dialogContainer}></div>

<Footer />
