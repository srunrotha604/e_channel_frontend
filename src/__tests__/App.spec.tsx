import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';

jest.unstable_mockModule('../domains/default/interface-adapters', () => ({
  changePassword: jest.fn(),
  submitContactUs: jest.fn(),
  logClientError: jest.fn(),
  requestForgotPassword: jest.fn(),
  confirmForgotPasswordCode: jest.fn(),
  requestForgotPasswordViaSms: jest.fn(),
  confirmForgotPasswordChange: jest.fn(),
  processCustomerTransactions: jest.fn(),
  login: jest.fn(),
  createStreamTicket: jest.fn(),
  logout: jest.fn(),
  fetchCurrentUserProfile: jest.fn(),
  uploadProfileAvatar: jest.fn(),
  saveProfileInfo: jest.fn(),
  openSessionStream: jest.fn(() => jest.fn()),
}));

test('renders the main page', async () => {
  const { default: App } = await import('../App');

  await act(async () => {
    render(<App />);
  });

  expect(document.body).toBeInTheDocument();
});
