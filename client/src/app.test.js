import React from 'react';
import ReactDOM from 'react-dom';
import appShell from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppShell/>, div);
});
