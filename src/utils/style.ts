
export function getContainerStyle(element: HTMLElement): Record<string, string> {
  const style: Record<string, string> = {};
  const computedStyle = window.getComputedStyle(element);
  for (let i = 0; i < computedStyle.length; i++) {
    const propName = computedStyle[i];
    if (propName === 'font-size') {
      style[propName] = computedStyle.getPropertyValue(propName);
    }
  }
  style.padding = '0px';
  style.margin = '0px';
  return style;
}
