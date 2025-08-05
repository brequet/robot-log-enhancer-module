<!-- The injection is happening in the populate children robot scripts js override -->
<svelte:options customElement="rest-request-to-curl-module" />

<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { convertToPowerShellCurl } from "$lib/core/services/curl-generator.service";
  import { injectFixedStyleForShadowDOM } from "$lib/styles/tw-style-injection";
  import { cn } from "$lib/utils";
  import { Terminal } from "lucide-svelte";
  import CopyToClipboardButton from "../shared/copy-to-clipboard-button.svelte";
  import { buttonVariants } from "../ui/button";

  let { requestDataText }: { requestDataText: string } = $props();

  injectFixedStyleForShadowDOM($host());

  let restRequestToCurlDialogContainer: HTMLElement | null = $state(null);

  const curlRequest = $derived(convertToPowerShellCurl(requestDataText));
</script>

<div bind:this={restRequestToCurlDialogContainer} class="h-0"></div>

<Dialog.Root>
  <Dialog.Trigger
    class={cn(buttonVariants({ variant: "outline" }), "mb-4 w-full")}
  >
    <Terminal class="mr-2 h-4 w-4" />
    Copy as CURL request
  </Dialog.Trigger>
  <Dialog.Content
    class="sm:max-w-4xl"
    portalProps={{ to: restRequestToCurlDialogContainer }}
  >
    <Dialog.Header>
      <Dialog.Title>Copy as CURL request</Dialog.Title>
      <Dialog.Description>
        Translation of the REST request to be used in a terminal
      </Dialog.Description>
    </Dialog.Header>
    <div class="flex flex-col items-end">
      <CopyToClipboardButton text={curlRequest} />
      <div class="bg-muted text-muted-foreground mt-1 w-full rounded-lg p-4">
        <pre
          class="w-full whitespace-pre-wrap break-all font-mono">{curlRequest}</pre>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>
