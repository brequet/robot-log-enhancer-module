import { getFailedTestsElement } from "./utils";

export function goToPreviousTest(currentTestId: string) {
  const visibleFailedTests = getFailedTestsElement();
  const currentTestIndex = visibleFailedTests.findIndex(
    (e) => e.id === currentTestId
  );

  if (currentTestIndex <= 0) return;

  const previousElement = visibleFailedTests[currentTestIndex - 1];
  window.scrollTo({
    top: previousElement.offsetTop,
    behavior: "smooth",
  });
}

export function goToNextTest(currentTestId: string) {
  const visibleFailedTests = getFailedTestsElement();
  const currentTestIndex = visibleFailedTests.findIndex(
    (e) => e.id === currentTestId
  );

  if (currentTestIndex === visibleFailedTests.length - 1) return;

  const element = visibleFailedTests[currentTestIndex + 1];
  window.scrollTo({
    top: element.offsetTop + 1,
    behavior: "smooth",
  });
}