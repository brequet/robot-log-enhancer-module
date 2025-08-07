<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import type { CodeSnippet } from "$lib/features/curl-generator/curl-generator.types";
  import { CopyToClipboardButton } from "../copy-to-clipboard-button";

  type Props = {
    snippets: CodeSnippet[];
  };

  let { snippets }: Props = $props();

  let selectedIndex = $state(0);
  const selectedSnippet = $derived(snippets[selectedIndex]);

  let preElement: HTMLPreElement | null = $state(null);

  function selectSnippet(index: number) {
    selectedIndex = index;
  }

  /**
   * When the user clicks inside the code area, programmatically
   * select all the text within the <pre> element.
   * This makes it easy to copy and also fixes the Ctrl+A behavior.
   */
function handleCodeClick() {
  if (!preElement) {
    return;
  }

  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.selectNodeContents(preElement);
  selection.removeAllRanges();
  selection.addRange(range);
}
</script>

<div
  class="bg-muted text-muted-foreground flex h-full flex-col rounded-lg border"
>
  <div
    class="border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-2"
  >
    <!-- Header -->
    <div class="flex items-center gap-2">
      {#each snippets as snippet, index}
        <Button
          variant={selectedIndex === index ? "outline" : "ghost-border"}
          size="sm"
          onclick={() => selectSnippet(index)}
        >
          {snippet.fileType}
        </Button>
      {/each}
    </div>

    <div class="flex-grow"></div>

    <CopyToClipboardButton text={selectedSnippet.text} class="h-8 w-8" />
  </div>

  <!-- Code Area -->
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="relative flex-1" onclick={handleCodeClick}>
    <pre
      bind:this={preElement}
      class="bg-primary text-primary-foreground absolute inset-0 w-full cursor-text select-text overflow-auto whitespace-pre-wrap break-all rounded-b-lg p-4 font-mono"
    >{selectedSnippet.text}</pre>
  </div>
</div>
