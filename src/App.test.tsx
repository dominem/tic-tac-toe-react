import React from 'react';
import { createRoot } from 'react-dom/client';
import { test } from '@rstest/core';
import App from './App';

test('renders without crashing', () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<App />);
  root.unmount();
});

