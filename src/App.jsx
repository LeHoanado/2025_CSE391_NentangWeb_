import React, { useState, useEffect } from 'react';
import * as Babel from '@babel/standalone';

export default function App() {
  const [code, setCode] = useState('<h2>Demo JSX</h2>');
  // const [compiled, setCompiled] = useState('');
  const [element, setElement] = useState(null);

  useEffect(() => {
    try {
      const output = Babel.transform(code, { presets: ['react'] }).code;
      // setCompiled(output);
      const elementFunc = new Function('React', `return ${output}`);
      const renderedElement = elementFunc(React);
      setElement(renderedElement);
    } catch (err) {
      // setCompiled('Error: ' + err.message);
      setElement(null);
    }
  }, [code]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>JSX Playground</h2>
      <textarea
        style={{ width: '100%', height: '150px' }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <h2>Live Review</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {element}
      </div>
      {/* <h4>Compiled JavaScript</h4>
      <pre style={{ background: '#f4f4f4', padding: '10px' }}>{compiled}</pre> */}
    </div>
  );
}