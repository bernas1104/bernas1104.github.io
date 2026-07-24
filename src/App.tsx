import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-desktop min-h-screen flex items-center justify-center p-8">
      <div className="window w-full max-w-2xl">
        <div className="title-bar">
          <div className="title-bar-text">bernasos — Welcome</div>
          <div className="title-bar-controls">
            <span aria-label="Minimize" />
            <span aria-label="Maximize" />
            <span aria-label="Close" />
          </div>
        </div>
        <div className="window-body">
          <p className="mb-4" style={{ color: 'var(--win98-window-text)' }}>
            Welcome to <strong>bernasos</strong> — a Windows 98-inspired personal
            site built with React + Tailwind CSS.
          </p>

          <div
            className="p-4 mb-4 flex flex-col gap-4"
            style={{
              boxShadow:
                'var(--win98-button-shadow) 1px 1px inset, var(--win98-button-highlight) -1px -1px inset',
            }}
          >
            <p style={{ color: 'var(--win98-window-text)' }}>
              This window uses <code>98.css</code> widget classes for authentic
              chrome and Tailwind utilities for layout.
            </p>
            <p style={{ color: 'var(--win98-window-text)' }}>
              Theme tokens are defined in{' '}
              <code className="bg-button-highlight px-1">src/styles/tokens.css</code> and
              mapped to Tailwind via <code className="bg-button-highlight px-1">@theme</code>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button type="button" onClick={() => setCount((c) => c + 1)}>
              Count is {count}
            </button>
            <button
              type="button"
              className="default"
              onClick={() => setCount(0)}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
