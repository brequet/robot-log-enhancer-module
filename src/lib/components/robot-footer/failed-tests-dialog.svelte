<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog";
  import { formatTestsAsRobotParams } from "$lib/features/failed-test-reporter/failed-tests-reporter.service";
  import { getContext } from "svelte";
  import { CodeBlock } from "$lib/components/shared/code-block";
  import { CONTEXT_KEY_DIALOG_CONTAINER } from "$lib/core/constants";
  import type { RobotTest } from "$lib/features/robot-log/robot.types";
  import type { CodeSnippet } from "$lib/features/curl-generator/curl-generator.types";

  type Props = {
    failedTests: RobotTest[];
  }

  let { failedTests }: Props = $props();

  const dialogContainer: () => HTMLElement = getContext(CONTEXT_KEY_DIALOG_CONTAINER);

  const failingTestsSnippets: CodeSnippet[] = $derived.by(() => {
    const params = formatTestsAsRobotParams(failedTests);
    return [{ fileType: "Shell", text: params }];
  });
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
    Print all failing tests as robot test params in console
  </Dialog.Trigger>
  <Dialog.Content class="flex h-full max-h-[80vh] flex-col sm:max-w-4xl" portalProps={{ to: dialogContainer() }}>
    <Dialog.Header>
      <Dialog.Title>Failing tests as Robot params</Dialog.Title>
      <Dialog.Description>
        You can copy and use these params to relaunch only failing tests.
      </Dialog.Description>
    </Dialog.Header>

    <CodeBlock snippets={failingTestsSnippets} />
  </Dialog.Content>
</Dialog.Root>
