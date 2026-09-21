import { parse } from 'parse5';
export function elements(html) {
  const result = [];
  function walk(node) {
    if (node.tagName) result.push(node);
    for (const child of node.childNodes || []) walk(child);
  }
  walk(parse(html));
  return result;
}
export function attribute(node, name) {
  return node.attrs?.find(attr => attr.name === name)?.value;
}
export function textContent(node) {
  if (['script', 'style'].includes(node.tagName)) return '';
  if (node.nodeName === '#text') return node.value;
  const text = (node.childNodes || []).map(textContent).join('');
  return ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'article', 'main', 'nav', 'footer', 'header', 'li', 'ul', 'ol', 'br', 'tr', 'td', 'th', 'button', 'figure', 'a', 'span'].includes(node.tagName) ? ` ${text} ` : text;
}
export function snapshot(html) {
  const nodes = elements(html);
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  return {
    text: normalize(textContent(nodes.find(node => node.tagName === 'body'))),
    ids: nodes.map(node => attribute(node, 'id')).filter(Boolean).sort(),
    links: nodes.filter(node => node.tagName === 'a').map(node => attribute(node, 'href')).filter(Boolean).sort(),
    metadata: Object.fromEntries(nodes.filter(node => node.tagName === 'meta').map(node => [attribute(node, 'name') || attribute(node, 'property') || attribute(node, 'charset'), attribute(node, 'content') || ''])),
    title: textContent(nodes.find(node => node.tagName === 'title')),
    canonical: nodes.filter(node => node.tagName === 'link' && attribute(node, 'rel') === 'canonical').map(node => attribute(node, 'href')),
    dates: nodes.filter(node => node.tagName === 'time').map(node => attribute(node, 'datetime')),
  };
}
