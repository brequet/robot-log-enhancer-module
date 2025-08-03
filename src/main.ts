import "$lib/components/custom/robot-footer.svelte";
import overrideScript from "$lib/overrides/robot-expand-recursively-override.js?raw";

function initializeRobotFooter(): void {
  if (document.querySelector("robot-footer")) {
    return;
  }

  const footer = document.createElement("robot-footer");

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
  injectScript(overrideScript);
}

initializeApp();
