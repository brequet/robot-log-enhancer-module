import type { RobotTest } from "../types";

/**
 * Finds all failed test elements on the page.
 */
export function getFailedTestElements(): HTMLElement[] {
  return [...document.getElementsByClassName("test")].filter((el) => {
    const header = el.querySelector(".element-header-left") as HTMLElement;
    return header?.title.includes("[FAIL]") ?? false;
  }) as HTMLElement[];
}

/**
 * Extracts test information from a DOM element.
 */
export function parseTestFromElement(element: HTMLElement): RobotTest {
  const divTitle =
    (element.querySelector(".element-header-left") as HTMLElement)?.title ?? "";
  const testName = divTitle.replace(/TEST\s+(.*?)\s+\[FAIL\]/, "$1");
  return { id: element.id, name: testName };
}

/**
 * Gets the total number of failed tests from the stats table.
 */
export function getTotalFailedTestCount(): number {
  const totalStatsRow = document.querySelector("#total-stats > tbody > tr");
  if (!totalStatsRow) return 0;
  // The 6th cell (index 5) contains the failed test count.
  return Number(totalStatsRow.childNodes[5].textContent ?? 0);
}

/**
 * Scrolls the page to a specific element.
 */
export function scrollToTest(element: HTMLElement): void {
  if (!element) return;
  // Adding 1px ensures the next test is correctly detected on scroll.
  window.scrollTo({
    top: element.offsetTop + 1,
    behavior: "instant",
  });
}
