import '$lib/components/custom/robot-footer.svelte';

function initializeRobotFooter(): void {
  if (document.querySelector('robot-footer')) {
    return;
  }

  const footer = document.createElement('robot-footer');
  const body = document.querySelector('body');

  if (body) {
    body.appendChild(footer);
    body.style.paddingBottom = '90vh';
  }
}

initializeRobotFooter();
