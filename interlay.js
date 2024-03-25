let spaceDiv;
let line;
let isDragging = false;
let currentHighlighted;
let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

Object.assign(svg.style, {
  position: 'fixed',
  top: '0px',
  left: '0px',
  width: '100%',
  height: '100%',
  zIndex: '1001',
  pointerEvents: 'none'
});
document.body.appendChild(svg);

function findClosestAncestorWithClass(element, classNames) {
  for (let i = 0; i < classNames.length; i++) {
    if (element.tagName === classNames[i]) {
      return element
    }
    let closest = element.closest(`.${classNames[i]}`);
    if (closest) {
      console.log(closest);
      return closest;
    }
  }
  return null;
}

function drawLine(ax, ay, bx, by) {
  if (!line) {
    line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  }
  if (!document.getElementById('line')) {
    line.setAttribute('id', 'line');
    line.setAttribute('x1', ax);
    line.setAttribute('y1', ay);
    line.setAttribute('x2', bx);
    line.setAttribute('y2', by);
    line.setAttribute("stroke", "white")
    line.setAttribute("stroke-width", "3px");
    svg.appendChild(line);
  } else {
    let existingLine = document.getElementById('line');
    existingLine.setAttribute('x1', ax);
    existingLine.setAttribute('y1', ay);
    existingLine.setAttribute('x2', bx);
    existingLine.setAttribute('y2', by);
  }
}

function addSpace() {
  spaceDiv = document.createElement("div");
  Object.assign(spaceDiv.style, {
    width: "200px",
    height: "100px",
    borderRadius: "5px",
    background: "white",
    color: "black",
    position: "fixed",
    right: "5px",
    bottom: "5px",
    zIndex: "1000"
  });
  document.body.appendChild(spaceDiv);
}

function handleMouseDown(e) {
  if (e.target === spaceDiv) {
    isDragging = true;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing'; // Set cursor to grabbing
  }
}

function handleMouseMove(e) {
  if (!isDragging) return

  let targetElement = e.target

  drawLine(spaceDiv.offsetLeft, spaceDiv.offsetTop, e.clientX, e.clientY);
  if (currentHighlighted) {
    currentHighlighted.classList.remove('highlight', 'highlightInput');
  }

  // Add highlight to current element
  if (targetElement.classList) {
    // console.log(e.target.tagName)
    const input = findClosestAncestorWithClass(targetElement, ['INPUT', 'TEXTAREA'])
    console.log(input);
    if (input) {
      currentHighlighted = input
      currentHighlighted.classList.add('highlightInput');
    }
    else {
      currentHighlighted = targetElement;
      currentHighlighted.classList.add('highlight');
    }
  }
}

function handleMouseUp() {
  isDragging = false;
  if (line) {
    svg.removeChild(line);
  }

  document.body.style.userSelect = '';
  document.body.style.cursor = 'auto'; // Reset cursor to auto
}

function handleMessage(request, sender) {
  if (request.greeting === "hello") {
    addSpace();
  }
}

browser.runtime.onMessage.addListener(handleMessage);
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
