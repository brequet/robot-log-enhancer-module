/*
 * This file will be injected at the bottom of the page,
 * so it will override any defined functions in the original robot script.
 */

/**
 * Override of the robot's expandRecursively function.
 * With this override, we forcefully keep close any failed "Wait Until Keyword Succeeds"
 * children keywords, except the last one.
 * This is to prevent the expansion of all keywords which can lead to a very long list of keywords.
 */
function expandRecursively() {
  if (!window.elementsToExpand.length) return;
  var element = window.elementsToExpand.pop();
  if (!element || elementHiddenByUser(element.id)) {
    window.elementsToExpand = [];
    return;
  }
  expandElement(element);
  element.callWhenChildrenReady(function () {
    var children = element.children();
    // Added part: only unwrap the last two keywords in this retry case to prevent spam
    if (element.name === "Wait Until Keyword Succeeds" && children.length > 1) {
      children = children.slice(-2);
    }
    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];
      if (child.type != "message" && window.expandDecider(child))
        window.elementsToExpand.push(child);
    }
    if (window.elementsToExpand.length) setTimeout(expandRecursively, 0);
  });
}
