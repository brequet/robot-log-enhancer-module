// Imports for custom elements so they are registered and available globally
import "$lib/components/custom/rest-request-to-curl-module.svelte";
import "$lib/components/custom/robot-footer-module.svelte";

import robotExpandRecursivelyScript from "$lib/overrides/robot-expand-recursively.js?raw";
import robotPopulateChildrenScript from "$lib/overrides/robot-populate-children?raw";

function initializeRobotFooter(): void {
  if (document.querySelector("robot-footer")) {
    return;
  }

  const footer = document.createElement("robot-footer-module");

  document.body.appendChild(footer);
  document.body.style.paddingBottom = "90vh";
}

function injectScript(scriptContent: string): void {
  const scriptElement = document.createElement("script");
  scriptElement.type = "text/javascript";
  scriptElement.textContent = scriptContent;

  document.body.appendChild(scriptElement);
}

function initializeApp(): void {
  initializeRobotFooter();
  injectScript(robotExpandRecursivelyScript);
  injectScript(robotPopulateChildrenScript);
}

initializeApp();
