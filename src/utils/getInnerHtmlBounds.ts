function getInnerHtmlBoundingBox(element) {
  // Clone the target element to preserve all styles and structure
  const clone = element.cloneNode(true);

  // Apply styles to make the clone invisible but still renderable
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '-9999px';

  // Insert the clone into the body to get its rendered size
  document.body.appendChild(clone);

  // Measure the clone
  const boundingBox = clone.getBoundingClientRect();

  // Clean up by removing the clone from the document
  document.body.removeChild(clone);

  // Return the bounding box dimensions
  return boundingBox;
}