export const checkIfDomExists = (selector: string) => {
  return !!document.querySelector(selector);
};
