import Footer from "./Footer.svelte";
export default Footer;

function initializeRobotFooter() {
  console.log("Initializing Robot-Footer");

  let footer = document.createElement("robot-footer");

  const body = document.querySelector("body");
  if (body) {
    body.appendChild(footer);
    body.style.marginBottom = "100%";
  }
}

initializeRobotFooter();
