<svelte:options customElement="robot-footer" />

<script lang="ts">
  import Tailwind from "./tailwind.svelte";
  import { onMount } from "svelte";
  import { collapseRetryKeywords } from "./robot";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Clipboard } from "lucide-svelte";

  let currentTestId = $state("");

  const currentTestName = $derived(getTestNameFromTestId(currentTestId));
  const currentTestHumanIndex = $derived(
    getTestIndexFromTestId(currentTestId) + 1
  );

  let totalFailedTestCount: number | undefined = $state(undefined);

  let failingTestsAsRobotParams = $derived.by(() => {
    if (!totalFailedTestCount) return "";
    return getFailedTestsElement()
      .map(
        (e) =>
          e.querySelector(".element-header-left > .name")?.textContent ?? ""
      )
      .map((e) => `--test "${e}"`)
      .join(" ")
      .trim();
  });

  onMount(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const divs = getFailedTestsElement() as HTMLDivElement[];

      for (let i = 0; i < divs.length; i++) {
        const div = divs[i];
        const divTop = div.offsetTop;
        const divHeight = div.offsetHeight;

        if (i === 0 && scrollPosition < divTop) {
          currentTestId = "";
        } else if (
          scrollPosition >= divTop &&
          scrollPosition < divTop + divHeight
        ) {
          if (currentTestId !== div.id) {
            currentTestId = div.id;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    totalFailedTestCount = getFailedTestsElement().length;
    const handleDomChanges = () => {
      handleScroll();
      totalFailedTestCount = getFailedTestsElement().length;
    };

    const observer = new MutationObserver(() => {
      handleDomChanges();
    });

    // Start observing the entire document for changes
    observer.observe(document, {
      childList: true, // Observe direct children of the target node
      subtree: true, // Observe all descendants of the target node
      attributes: true, // Observe changes to attributes of the target node
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  function getTestNameFromTestId(testId: string): string {
    return (
      document
        .getElementById(testId)
        ?.querySelector(".element-header-left > .name")?.textContent ?? ""
    );
  }

  function getFailedTestsElement(): HTMLElement[] {
    return [...document.getElementsByClassName("test")].filter((e) => {
      const htmlElement: HTMLElement = e as HTMLElement;
      const headerLeft = htmlElement.querySelector(
        ".element-header-left"
      ) as HTMLElement;
      return headerLeft?.title.includes("FAIL") ?? false;
    }) as HTMLElement[];
  }

  function getTestIndexFromTestId(testId: string): number {
    const visibleFailedTests = getFailedTestsElement();
    return visibleFailedTests.findIndex((e) => e.id === testId);
  }

  function goToPreviousTest() {
    const visibleFailedTests = getFailedTestsElement();
    const currentTestIndex = visibleFailedTests.findIndex(
      (e) => e.id === currentTestId
    );

    let previousIndex: number;
    if (currentTestIndex < 0) {
      return;
    } else if (currentTestIndex === 0) {
      previousIndex = 0;
    } else {
      previousIndex = currentTestIndex - 1;
    }

    const previousElement = visibleFailedTests[previousIndex];
    window.scrollTo({
      top: previousElement.offsetTop,
      behavior: "smooth",
    });
  }

  function goToNextTest() {
    const visibleFailedTests = getFailedTestsElement();
    const currentTestIndex = visibleFailedTests.findIndex(
      (e) => e.id === currentTestId
    );

    if (currentTestIndex === visibleFailedTests.length - 1) return;

    const element = visibleFailedTests[currentTestIndex + 1];
    window.scrollTo({
      top: element.offsetTop + 1, // hack so the current test is effectively changed
      behavior: "smooth",
    });
  }
</script>

<Tailwind />

<footer class="footer bg-slate-100">
  <div class="button-group">
    <Button on:click={collapseRetryKeywords}>
      Collapse all but last children
    </Button>

    <Dialog.Root>
      <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
        Print all failing tests as robot test params in console
      </Dialog.Trigger>
      <Dialog.Content class="max-w-3xl">
        <Dialog.Header>
          <Dialog.Title>Failing tests as Robot params</Dialog.Title>
          <Dialog.Description>
            You can copy and use these params to relaunch only failing tests.
          </Dialog.Description>
        </Dialog.Header>
        <div
          class="bg-muted text-muted-foreground p-4 pt-1 rounded-lg flex flex-col items-end"
        >
          <!--  TODO implement button + move into compoennet all this -->
          <Button disabled variant="outline" size="icon">
            <Clipboard />
          </Button>
          <pre
            class="whitespace-pre-wrap break-all font-mono">{failingTestsAsRobotParams}</pre>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  </div>

  <div class="footer-content">
    <span class="test-name">
      {currentTestName}
      <span class="test-count">
        ({currentTestHumanIndex} / {totalFailedTestCount})
      </span>
    </span>
    <div class="footer-actions">
      <Button on:click={goToPreviousTest}>Previous</Button>
      <Button on:click={goToNextTest}>Next</Button>
    </div>
  </div>
</footer>

<style>
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    /* background-color: #f8f9fa; */
    padding: 0.5rem;
    border-top: 1px solid #dee2e6;
    display: flex;
    flex-direction: row;
    z-index: 1;
  }

  .button-group {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.5rem;
  }

  .footer-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-right: 1.5rem;
  }

  .test-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
    text-align: left;
    padding-left: 1rem;
  }

  .test-count {
    font-weight: bold;
  }

  .footer-actions {
    display: flex;
    gap: 0.5rem;
  }
</style>
