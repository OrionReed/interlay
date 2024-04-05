export function getComputedStyles(element: HTMLElement): Record<string, string> {
  const style: Record<string, string> = {};
  const computedStyle = window.getComputedStyle(element);
  const toCamelCase = (s: string) => s.replace(/-./g, x => x[1].toUpperCase());
  const relevantStyles = [
    'font-size',
    'text-align',
    'font-variation-settings',
    'font-weight',
  ];
  for (let i = 0; i < computedStyle.length; i++) {
    const propName = computedStyle[i];

    if (relevantStyles.includes(propName)) {
      const value = computedStyle.getPropertyValue(propName);
      console.log(element.tagName, propName, value);
      style[toCamelCase(propName)] = value
      style[toCamelCase(propName)] = value
    }
  }
  return style;
}