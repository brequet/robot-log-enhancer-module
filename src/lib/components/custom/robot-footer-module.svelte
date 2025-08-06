<!-- Robot Footer module, to be injected once in the robot log.html page to provide the footer and associated content -->
<svelte:options customElement="robot-footer-module" />

<script lang="ts">
  import { CONTEXT_KEY_DIALOG_CONTAINER } from "$lib/core/constants";
  import { robotStore } from "$lib/features/robot-log/robot.store.svelte.js";
  import { themeStore } from "$lib/features/theme/theme.store.svelte";
  import { injectTailwindStyleForShadowDOM } from "$lib/styles/tailwind-style-injection";
  import { onMount, setContext } from "svelte";
  import Footer from "../robot-footer/footer.svelte";

  injectTailwindStyleForShadowDOM($host());

  let dialogContainer: HTMLElement | null = $state(null);

  onMount(() => {
    const cleanupRobotStore = robotStore.init();
    const cleanupThemeStore = themeStore.init();

    return () => {
      cleanupRobotStore();
      cleanupThemeStore();
    };
  });

  setContext(CONTEXT_KEY_DIALOG_CONTAINER, () => dialogContainer);
</script>

<div class={themeStore.theme}>
  <div bind:this={dialogContainer}></div>

  <Footer />
</div>
