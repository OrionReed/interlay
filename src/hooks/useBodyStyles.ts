import { useState, useEffect } from 'react';

export const useBodyStyles = () => {
  const [bodyStyles, setBodyStyles] = useState('');

  useEffect(() => {
    const fetchStyles = async () => {
      let styles = '';

      const styleSheetsArray = Array.from(document.styleSheets);

      await Promise.all(styleSheetsArray.map(async (sheet) => {
        try {
          if (sheet.href) { // For external stylesheets, you might need CORS headers set properly
            const response = await fetch(sheet.href);
            const text = await response.text();
            styles += text;
          } else { // For internal stylesheets
            const rules = sheet.cssRules || sheet.rules;
            for (const rule of rules) {
              if (rule instanceof CSSStyleRule && rule.selectorText === 'body') {
                styles += rule.cssText;
              }
            }
          }
        } catch (e) {
          console.error("Error accessing stylesheet: ", e);
        }
      }));
      setBodyStyles(styles);
    };

    fetchStyles();
  }, []);


  return bodyStyles;
};