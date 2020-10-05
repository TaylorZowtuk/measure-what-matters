import React from 'react';
import { render } from '@testing-library/react';
import Recording from './components/Recording.page';
import { BrowserRouter } from 'react-router-dom';


test('renders recording', () => {
  const { getByText } = render(<Recording />, {wrapper:BrowserRouter});
  const linkElement = getByText(/Here you will record/i);
  expect(linkElement).toBeInTheDocument();
});
