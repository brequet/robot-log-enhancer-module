<script lang="ts">
    import CopyToClipboardButton from "$lib/components/custom/CopyToClipboardButton.svelte";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog";
    import type { RobotTest } from "$lib/robot/types";

    let {
        failedTests,
    }: {
        failedTests: RobotTest[];
    } = $props();

    let failingTestsAsRobotParams = $derived(
        failedTests
            .map((e: RobotTest) => `--test "${e.name}"`)
            .join(" ")
            .trim(),
    );
</script>

<Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
        Print all failing tests as robot test params in console
    </Dialog.Trigger>
    <Dialog.Content class="max-w-3xl">
        <Dialog.Header>
            <Dialog.Title>Failing tests as Robot params</Dialog.Title>
            <Dialog.Description>
                You can copy and use these params to relaunch only failing
                tests.
            </Dialog.Description>
        </Dialog.Header>
        <div class="flex flex-col items-end">
            <CopyToClipboardButton text={failingTestsAsRobotParams} />
            <div class="bg-muted text-muted-foreground rounded-lg p-4 mt-1">
                <pre
                    class="whitespace-pre-wrap w-full break-all font-mono">{failingTestsAsRobotParams}</pre>
            </div>
        </div>
    </Dialog.Content>
</Dialog.Root>
