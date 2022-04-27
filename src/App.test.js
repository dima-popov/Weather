import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Weather/i);
  expect(linkElement).toBeInTheDocument();
});
