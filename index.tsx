import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.js';
import { I18nProvider } from './lib/i18n.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
// Fix: Use React.createElement to avoid a TypeScript type inference error with the I18nProvider component imported from a JavaScript file. This makes the syntax consistent with other parts of the application.
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(I18nProvider, null,
      React.createElement(App, null)
    )
  )
);
