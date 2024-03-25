<svelte:options tag="robot-footer" />

<script lang="ts">
  import { onMount } from "svelte";
  import { collapseRetryKeywords } from "./robot";
  import Button from "./components/Button.svelte";

  const buttons: { name: String; func: () => void }[] = [
    { name: "Collapse all but last children", func: collapseRetryKeywords },
  ];

  let currentTestId = "";
  $: currentTestName = getTestNameFromTestId(currentTestId);
  $: currentTestHumanIndex = getTestIndexFromTestId(currentTestId) + 1;

  let totalFailedTestCount: number | undefined = undefined;

  onMount(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const divs = getFailedTestsElement();

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

    const observer = new MutationObserver((mutations, observer) => {
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

  function getFailedTestsElement(): Element[] {
    return [...document.getElementsByClassName("test")].filter(
      (e) =>
        e.querySelector(".element-header-left")?.title.includes("FAIL") ?? false
    );
  }

  function getTestIndexFromTestId(testId: string): number {
    const visibleFailedTests = getFailedTestsElement();
    const currentTestIndex = visibleFailedTests.findIndex(
      (e) => e.id === testId
    );
    return currentTestIndex;
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

<footer class="footer">
  <div class="button-group">
    {#each buttons as button}
      <Button on:click={button.func}>{button.name}</Button>
    {/each}
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
    background-color: #f8f9fa;
    padding: 0.5rem;
    border-top: 1px solid #dee2e6;
    display: flex;
    flex-direction: row;
    z-index: 1;
  }

  .button-group {
    display: flex;
    flex-wrap: wrap;
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
