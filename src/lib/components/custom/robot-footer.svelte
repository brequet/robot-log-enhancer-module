<svelte:options
  customElement={{
    tag: "robot-footer",
  }}
/>

<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { injectFixedStyleForShadowDOM } from "$lib/styling/tw-style-injection";
  import { Terminal } from "lucide-svelte";

  injectFixedStyleForShadowDOM($host());
</script>

<footer
  class="fixed right-0 bottom-0 left-0 z-50 flex h-16 w-full items-center border-t bg-background px-4 text-primary"
>
  <div class="flex w-full items-center justify-between">
    <p class="text-sm text-muted-foreground">Robot Log Enhancer</p>
    <Button variant="outline">
      <Terminal class="mr-2 size-4" />
      <span>Click Me</span>
    </Button>
  </div>
</footer>
