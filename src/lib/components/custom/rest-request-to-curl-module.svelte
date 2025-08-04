<!-- The injection is happening thanks to the populate children robot scripts js override -->
<svelte:options customElement="rest-request-to-curl-module" />

<script lang="ts">
  import { injectFixedStyleForShadowDOM } from "$lib/styles/tw-style-injection";
  import Button from "../ui/button/button.svelte";

  let { restRequestRequestDataText }: { restRequestRequestDataText: string } =
    $props();

  injectFixedStyleForShadowDOM($host());
</script>

{restRequestRequestDataText}
<Button>this is a button</Button>
