export function isKeywordClosed(keywordElement: Element) {
  return keywordElement
    .querySelector(":scope > .element-header")
    ?.classList.contains("closed");
}

export function toggleChildrenToShowOnlyLastChild(elementId: string) {
  const keywordChildren = Array.from(
    document
      .getElementById(elementId)
      ?.querySelector(".children")
      ?.querySelectorAll(":scope > .keyword") ?? []
  );

  const lastElement = keywordChildren.pop();
  if (lastElement === null || lastElement === undefined) return;

  // close all
  keywordChildren.forEach((keywordChild) => {
    if (!isKeywordClosed(keywordChild)) {
      toggleKeyword(keywordChild.id); // globally defined in robot log.html files
    }
  });

  // expand last
  if (isKeywordClosed(lastElement)) {
    toggleKeyword(lastElement.id); // globally defined in robot log.html files
  }
}

export function addToggleAllChildrenButton(elementId: string) {
  if (!elementId) return;

  const parentDiv = document.getElementById(elementId);
  if (!parentDiv) return;

  const button = document.createElement("button");
  button.textContent = "Collapse all but last";
  button.id = "btn-show-last-child-" + elementId;

  button.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleChildrenToShowOnlyLastChild(parentDiv.id);
  });

  parentDiv
    .querySelector(".element-header")
    ?.querySelector(".element-header-left")
    ?.appendChild(button);
}

export function waitElementHasAlreadyCollapseButton(element: Element): boolean {
  return element.querySelector("#btn-show-last-child-" + element.id) !== null;
}

export function getAllDivWithWithChildrenConnectorShouldReceiveXmlMessage() {
  const divs = document.querySelectorAll(".keyword");

  const filteredDivs = Array.from(divs).filter((div) => {
    const elementHeader = div.querySelector(":scope > .element-header");
    if (!elementHeader) return false;

    const elementHeaderLeft = elementHeader.querySelector(
      ":scope > .element-header-left"
    );
    if (!elementHeaderLeft) return false;

    const nameSpan = elementHeaderLeft.querySelector(":scope > span.name");
    if (!nameSpan) return false;

    return nameSpan.textContent?.includes("Wait Until Keyword Succeeds");
  });

  console.log(
    "Found " + filteredDivs.length + " retry keywords to auto-collapse"
  );

  return filteredDivs;
}

export function collapseRetryKeywords() {
  getAllDivWithWithChildrenConnectorShouldReceiveXmlMessage().forEach((el) => {
    if (!waitElementHasAlreadyCollapseButton(el)) {
      addToggleAllChildrenButton(el.id);
    }

    toggleChildrenToShowOnlyLastChild(el.id);
  });
}

export function getTestNameFromTestId(testId: string): string {
  return (
    document
      .getElementById(testId)
      ?.querySelector(".element-header-left > .name")?.textContent ?? ""
  );
}

export function getFailedTestsElement(): HTMLElement[] {
  return [...document.getElementsByClassName("test")].filter((htmlElement) => {
    const headerLeft = htmlElement.querySelector(
      ".element-header-left"
    ) as HTMLElement;
    return headerLeft?.title.includes("FAIL") ?? false;
  }) as HTMLElement[];
}

export function getTestIndexFromTestId(testId: string): number {
  const visibleFailedTests = getFailedTestsElement();
  return visibleFailedTests.findIndex((e) => e.id === testId);
}

export function getNumberOfFailedTests(): number {
  const totalStatsRow = document.querySelector("#total-stats > tbody > tr");
  if (!totalStatsRow) return 0;

  return Number(totalStatsRow.childNodes[5].textContent);
}
