<script lang="ts">
  import { CopyToClipboardButton } from "../copy-to-clipboard-button";
  import { Button } from "$lib/components/ui/button";
  import type { CodeSnippet } from "$lib/features/curl-generator/curl-generator.types";

  type Props = {
    snippets: CodeSnippet[];
  };

  let { snippets }: Props = $props();

  let selectedIndex = $state(0);
  const selectedSnippet = $derived(snippets[selectedIndex]);

  function selectSnippet(index: number) {
    selectedIndex = index;
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
  <div class="relative flex-1">
    <pre
      class="bg-primary text-primary-foreground absolute inset-0 w-full overflow-y-auto whitespace-pre-wrap break-all rounded-b-lg p-4 font-mono">{selectedSnippet.text}</pre>
  </div>
</div>
