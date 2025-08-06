<script lang="ts">
  import { CodeBlock } from "$lib/components/shared/code-block";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog";
  import { CONTEXT_KEY_DIALOG_CONTAINER } from "$lib/core/constants";
  import type { CodeSnippet } from "$lib/features/curl-generator/curl-generator.types";
  import { formatTestsAsRobotParams } from "$lib/features/failed-test-reporter/failed-tests-reporter.service";
  import type { RobotTest } from "$lib/features/robot-log/robot.types";
  import { getContext } from "svelte";

  type Props = {
    failedTests: RobotTest[];
  };

  let { failedTests }: Props = $props();

  const dialogContainer: () => HTMLElement = getContext(
    CONTEXT_KEY_DIALOG_CONTAINER,
  );

  const failedTestsSnippets: CodeSnippet[] = $derived.by(() => {
    const params = formatTestsAsRobotParams(failedTests);
    return [{ fileType: "Shell", text: params }];
  });
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
    Print all failed tests as robot test params in console
  </Dialog.Trigger>
  <Dialog.Content
    class="flex h-full max-h-[80vh] flex-col sm:max-w-4xl"
    portalProps={{ to: dialogContainer() }}
  >
    <Dialog.Header>
      <Dialog.Title>Failed tests as Robot params</Dialog.Title>
      <Dialog.Description>
        You can copy and use these params to relaunch only failed tests.
      </Dialog.Description>
    </Dialog.Header>

    <CodeBlock snippets={failedTestsSnippets} />
  </Dialog.Content>
</Dialog.Root>
