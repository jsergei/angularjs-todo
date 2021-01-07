'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {
  function showDiff(container) {
    const expectedHeight = parseInt(container.dataset.height, 10);
    const actualHeight = parseFloat(getComputedStyle(container).height);
    console.log(`${container.getAttribute('id')} height diff: ${expectedHeight - actualHeight}`);
  }

  // should return whether or not this element is a height friendly child -
  // ((text OR inline OR other (script, comment)) AND has no non-compliant children)
  function setFixedHeights(root) {
    if ([Node.TEXT_NODE,
      Node.COMMENT_NODE,
      Node.PROCESSING_INSTRUCTION_NODE,
      Node.CDATA_SECTION_NODE].includes(root.nodeType)) { 
      return true;
    }
    if (root.nodeType === Node.ELEMENT_NODE) {
      const style = getComputedStyle(root, null);
      if (style.display === 'none') {
        return true;
      } else if (style.display === 'inline') {
        // only allow if every child is a compliant child
        return Array.from(root.childNodes).every(node => setFixedHeights(node));
      } else { // can have its own height
        if (root.hasChildNodes()) {
          let allCompliant = true;
          for (let child of root.childNodes) {
            if (!setFixedHeights(child)) {
              allCompliant = false;
            }
          }
          if (allCompliant) { // if all children are OK, set a fixed height on root
            const lineHeight = parseFloat(style.lineHeight);
            if (!Number.isFinite(lineHeight)) {
              throw new Error('Line height must be a decimal number. "normal" is not allowed.');
            }
            if (lineHeight === 0) { // shouldn't happen in real life unless there is some css style hack
              throw new Error('Line height cannot be 0.');
            }
            const currentHeight = parseFloat(style.height);
            const numOfLines = Math.round(currentHeight / lineHeight);
            const forcedHeight = lineHeight * numOfLines;
            root.style.height = forcedHeight.toFixed(1) + 'px';
          }
        }
        return false;
      }
    }
    // Some other unexpected node type - error. Shouldn't happen outside of testing
    throw new TypeError('This node type is not supported.');
  }

  setFixedHeights(
    document.getElementById('simple')
  );

}]);