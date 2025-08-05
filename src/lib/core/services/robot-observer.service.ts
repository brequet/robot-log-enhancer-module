import { getFailedTestElements } from "$lib/core/services/robot-dom.service";

/**
 * Observes the DOM for changes and calls the provided callback with the current list of failed test elements.
 * Returns a cleanup function to disconnect the observer.
 */
export function createFailedTestObserver(
  callback: (elements: HTMLElement[]) => void,
): () => void {
  const handleDomChanges = () => {
    const failedTestElements = getFailedTestElements();
    callback(failedTestElements);
  };

  // Initial run to capture the state on load
  handleDomChanges();

  const observer = new MutationObserver(handleDomChanges);
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
  };
}
