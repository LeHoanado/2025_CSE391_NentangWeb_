import React, { useState, useEffect, useRef } from 'react';
import * as Babel from '@babel/standalone';

const initialItems = ['Book', 'Pen', 'Notebook'];
const updatedItems = ['Book', 'Dictionary', 'Notebook', 'Invoice'];

function diffDOMNodes(oldNodes, newNodes) {
  const diffs = [];
  const maxLen = Math.max(oldNodes.length, newNodes.length);
  for (let i = 0; i < maxLen; i++) {
    const oldText = oldNodes[i]?.textContent || '[empty]';
    const newText = newNodes[i]?.textContent || '[empty]';
    if (oldText !== newText) {
      diffs.push({ index: i, from: oldText, to: newText });
    }
  }
  return diffs;
}

export default function App() {
  const [code, setCode] = useState('<h2>Demo JSX</h2>');
  const [element, setElement] = useState(null);
  const [items, setItems] = useState(initialItems);
  const listRef = useRef(null);
  const prevDOMSnapshot = useRef([]);

  useEffect(() => {
    try {
      const output = Babel.transform(code, { presets: ['react'] }).code;
      const elementFunc = new Function('React', `return ${output}`);
      const renderedElement = elementFunc(React);
      setElement(renderedElement);
    } catch (err) {
      setElement(<pre style={{ color: 'red' }}>Error: {err.message}</pre>);
    }
  }, [code]);

  const handleChangeList = () => {
    const oldListItems = listRef.current.querySelectorAll('li');
    const oldSnapshot = Array.from(oldListItems);

    setItems(prev => {
      const newList = updatedItems;
      setTimeout(() => {
        const newListItems = listRef.current.querySelectorAll('li');
        const diffs = diffDOMNodes(oldSnapshot, Array.from(newListItems));
        console.clear();
        console.log('Virtual DOM diff simulation:');
        diffs.forEach(d => {
          console.log(`- At index ${d.index}: "${d.from}" → "${d.to}"`);
        });
      }, 0);
      return newList;
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>JSX Playground</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <div style={{ flex: 1 }}>
          <h3>JSX Input</h3>
          <textarea
            style={{ width: '100%', height: '300px' }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3>Live Preview</h3>
          <div style={{ border: '1px solid ', padding: '10px', minHeight: '285px' }}>
            {element}
          </div>
        </div>
      </div>

      <h2>Virtual DOM Diff</h2>
      <div>
        <ul ref={listRef} style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <button
          style={{ marginTop: '10px', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          onClick={handleChangeList}
        >
          Update List
        </button>
      </div>
    </div>
  );
}