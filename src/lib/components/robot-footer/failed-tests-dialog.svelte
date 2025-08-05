<script lang="ts">
  import CopyToClipboardButton from "$lib/components/shared/copy-to-clipboard-button.svelte";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog";
  import type { RobotTest } from "$lib/core/types";

  let {
    failedTests,
    dialogContainer,
  }: {
    failedTests: RobotTest[];
    dialogContainer: HTMLElement;
  } = $props();

  // TODO: probably move this to a utility function
  let failingTestsAsRobotParams = $derived(
    failedTests
      .map((robotTest: RobotTest) => `--test "${robotTest.name}"`)
      .join(" ")
      .trim(),
  );
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
    Print all failing tests as robot test params in console
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-4xl" portalProps={{ to: dialogContainer }}>
    <Dialog.Header>
      <Dialog.Title>Failing tests as Robot params</Dialog.Title>
      <Dialog.Description>
        You can copy and use these params to relaunch only failing tests.
      </Dialog.Description>
    </Dialog.Header>

    <div class="flex flex-col items-end">
      <CopyToClipboardButton text={failingTestsAsRobotParams} />

      <div
        class="bg-muted text-muted-foreground mt-1 max-h-[60vh] w-full overflow-y-auto rounded-lg p-4"
      >
        <pre
          class="w-full whitespace-pre-wrap break-all font-mono">{failingTestsAsRobotParams}</pre>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>
