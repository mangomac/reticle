import { describe, it, expect, afterEach } from 'vitest';
import { runQuery } from './query.js';

/**
 * #1781: a node appended straight to `document.documentElement` renders on the page, but
 * rooting the search at `document.body` reported it absent with no hint. The default search
 * root now covers the whole document minus <head>: the appended node is found, while <title>
 * text and other head content still cannot match.
 */
describe('query covers content outside <body>', () => {
  const appended: Element[] = [];

  afterEach(() => {
    for (const el of appended.splice(0)) el.remove();
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  it('finds text in a node appended to documentElement outside <body>', () => {
    document.body.innerHTML = '<main><p>ordinary page text</p></main>';
    const floater = document.createElement('div');
    floater.textContent = 'Overlay notice for the reader';
    document.documentElement.appendChild(floater);
    appended.push(floater);

    const r = runQuery({ text: 'Overlay notice for the reader' });
    expect(r.elements).toHaveLength(1);
  });

  it('still matches ordinary body content unchanged', () => {
    document.body.innerHTML = '<main><p>ordinary page text</p></main>';
    const r = runQuery({ text: 'ordinary page text' });
    expect(r.elements).toHaveLength(1);
  });

  it('never matches <title> or other <head> content', () => {
    document.head.innerHTML = '<title>Secret head words</title>';
    document.body.innerHTML = '<main><p>ordinary page text</p></main>';
    const r = runQuery({ text: 'Secret head words' });
    expect(r.elements).toHaveLength(0);
  });
});
