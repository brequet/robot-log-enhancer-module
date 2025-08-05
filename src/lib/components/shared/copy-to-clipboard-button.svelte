<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Clipboard, ClipboardCheck } from "lucide-svelte";
  import { onMount } from "svelte";

  let { text }: { text: string } = $props();

  let copied = $state(false);

  function copyToClipboard() {
    // on http non secured connection, navigator.clipboard API is not available
    if (!navigator.clipboard || !navigator.clipboard.writeText) return;
    navigator.clipboard
      .writeText(text)
      .then(() => setCopiedState())
      .catch((err) => console.error("Failed to copy: ", err));
  }

  function setCopiedState() {
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }

  onMount(() => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      console.warn("Clipboard API is not available in this environment.");
    }
  });
</script>

<!--On HTTP, cannot copy directly into user clipboard -->
{#if navigator.clipboard}
  <Button onclick={copyToClipboard} variant="outline" size="icon">
    {#if copied}
      <ClipboardCheck class="h-4 w-4" />
    {:else}
      <Clipboard class="h-4 w-4" />
    {/if}
  </Button>
{/if}
