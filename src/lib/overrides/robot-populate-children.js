/*
 * This file will be injected at the bottom of the page,
 * so it will override any defined functions in the original robot script.
 */

const requestLibraryRestActionRegex = /RequestsLibrary\.(POST|GET|PUT|DELETE)/;

/**
 * Edited to inject a custom element in the REST request td element
 * to provide copying to cURL ability through a dialog.
 */
function populateChildren(elementId, childElement, childrenNames) {
  if (!childElement.hasClass("populated")) {
    var element = window.testdata.findLoaded(elementId);
    var callback = drawCallback(element, childElement, childrenNames);
    // Added part: add a custom element in the REST request td element
    var overridenCallback = async () => {
      await callback();
      if (element?.fullName.match(requestLibraryRestActionRegex)) {
        const restRequestRequestDataElement = childElement["0"].querySelector(
          ".children > .info-message .message",
        );
        const restRequestRequestDataText =
          restRequestRequestDataElement?.innerText;
        if (
          restRequestRequestDataText != null &&
          restRequestRequestDataText !== ""
        ) {
          const restRequestToCurlElement = document.createElement(
            "rest-request-to-curl-module",
          );
          restRequestToCurlElement.setAttribute(
            "restRequestRequestDataText",
            restRequestRequestDataText,
          );
          restRequestRequestDataElement?.appendChild(restRequestToCurlElement);
        }
      }
      return;
    };
    // End of added part
    element.callWhenChildrenReady(overridenCallback);
    childElement.addClass("populated");
  }
}
