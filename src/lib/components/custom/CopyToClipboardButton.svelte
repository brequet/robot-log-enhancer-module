<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Clipboard, ClipboardCheck } from "lucide-svelte";

  let { text }: { text: string } = $props();

  let copied = $state(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>

<Button on:click={copyToClipboard} variant="outline" size="icon">
  {#if copied}
    <ClipboardCheck class="h-4 w-4" />
  {:else}
    <Clipboard class="h-4 w-4" />
  {/if}
</Button>
