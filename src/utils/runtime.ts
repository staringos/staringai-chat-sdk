/* https://gist.github.com/borestad/eac42120613bc67a3714f115e8b485a7
 * Custom jsx parser
 * See: tsconfig.json
 *
 *   {
 *     "jsx": "react",
 *     "jsxFactory": "h",
 *     "lib": [
 *       "es2017",
 *       "dom",
 *       "dom.iterable"
 *     ]
 *   }
 *
 */

export const entityMap: Record<string, string> = {
  '&': 'amp',
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  "'": '#39',
  // '/': '#x2F',
};

export const escapeHtml = (str: string) => {
  if (typeof str === 'string') {
    // String(str).replace(/[&<>"'\/\\]/g, s => `&${entityMap[s]};`);
    return String(str).replace(/[&<>"']/g, s => `&${entityMap[s]};`);
  }

  return str;
};

// To keep some consistency with React DOM, lets use a mapper
// https://reactjs.org/docs/dom-elements.html
export const AttributeMapper = (val: any) => {
  const map = {
    tabIndex: 'tabindex',
    className: 'class',
    readOnly: 'readonly',
  } as any;
  return map[val] || val;
};

export default function h(
  tag: Function | string,
  attrs?: { [key: string]: any },
  ...children: (HTMLElement | string)[]
): HTMLElement {
  attrs = attrs || {};
  const stack: any[] = [...children];

  // Support for components(ish)
  if (typeof tag === 'function') {
    attrs.children = stack;
    return tag(attrs);
  }

  const elm = document.createElement(tag);

  // Add attributes
  for (let [name, val] of Object.entries(attrs)) {
    name = escapeHtml(AttributeMapper(name));
    if (name === 'style') {
      Object.assign(elm.style, val);
    } else if (val === true) {
      elm.setAttribute(name, name);
    } else if (val !== false && val != null) {
      if (typeof val === 'string') {
        elm.setAttribute(
          name,
          name !== 'allow' && name !== 'src' ? escapeHtml(val) : val
        );
      } else {
        (elm as any)[name] = val;
      }
    } else if (val === false) {
      elm.removeAttribute(name);
    }
  }

  // Append children
  while (stack.length) {
    const child = stack.shift();

    // Is child a leaf?
    if (!Array.isArray(child)) {
      elm.appendChild(
        (child as HTMLElement).nodeType == null
          ? document.createTextNode(child.toString())
          : child
      );
    } else {
      stack.push(...child);
    }
  }

  return elm;
}
