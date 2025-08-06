<!-- Robot Footer module, to be injected once in the robot log.html page to provide the footer and associated content -->
<svelte:options customElement="robot-footer-module" />

<script lang="ts">
  import { robotStore } from "$lib/store/robot.store.svelte";
  import { injectFixedStyleForShadowDOM } from "$lib/styles/tw-style-injection";
  import Footer from "../robot-footer/footer.svelte";
  import { onMount, setContext } from "svelte";
  import { CONTEXT_KEY_DIALOG_CONTAINER } from "$lib/core/contants";

  injectFixedStyleForShadowDOM($host());

  let dialogContainer: HTMLElement | null = $state(null);

  onMount(() => {
    return robotStore.init();
  })

  setContext(CONTEXT_KEY_DIALOG_CONTAINER, () => dialogContainer);
</script>

<div bind:this={dialogContainer}></div>

<Footer />
