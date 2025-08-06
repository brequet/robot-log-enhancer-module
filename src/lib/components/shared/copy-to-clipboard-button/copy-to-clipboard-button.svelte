<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Clipboard, ClipboardCheck } from "lucide-svelte";

  type Props = {
    text: string;
    class?: string;
  };

  let { text, class: className }: Props = $props();

  let copied = $state(false);

  function copyToClipboard() {
    if (!navigator.clipboard) {
      console.warn("Clipboard API is not available in this environment.");
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        copied = true;
        setTimeout(() => {
          copied = false;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }
</script>

<!-- Handle environments without clipboard API (e.g., SSR, non-secure origins) -->
{#if typeof navigator !== "undefined" && navigator.clipboard}
  <Button
    onclick={copyToClipboard}
    variant="outline"
    size="icon"
    class={className}
    aria-label="Copy to clipboard"
  >
    {#if copied}
      <ClipboardCheck class="h-4 w-4" />
    {:else}
      <Clipboard class="h-4 w-4" />
    {/if}
  </Button>
{/if}
