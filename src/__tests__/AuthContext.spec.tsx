import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.unstable_mockModule('../utils/http-util', () => ({
  HttpUtil: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

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

const mockUserProfile = {
  username: 'jdoe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  userType: 'admin',
  avatar: '',
  avatarUrl: '',
  uuid: null,
};

const mockProfileResponse = {
  data: {
    userProfile: mockUserProfile,
    menuItems: [],
    company: [],
    application: null,
    version: null,
    module: [],
    mode: 'live',
    passwordStatus: null,
  },
};

const mockPermissionResponse = {
  data: {
    process: {},
    access: {},
    driAdmin: false,
  },
};

describe('AuthContext', () => {
  beforeEach(async () => {
    const { HttpUtil } = await import('../utils/http-util');
    (HttpUtil.get as ReturnType<typeof jest.fn>).mockClear();
    (HttpUtil.post as ReturnType<typeof jest.fn>).mockClear();
  });

  describe('fetchUser', () => {
    it('calls GET /auth/profile and populates user in context', async () => {
      const { HttpUtil } = await import('../utils/http-util');
      const { default: AuthContextProvider, useAuth } = await import(
        '../context/AuthContext'
      );

      (HttpUtil.get as ReturnType<typeof jest.fn>)
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockPermissionResponse);

      const AuthConsumer = () => {
        const { user, loading } = useAuth();
        if (loading) return <div data-testid="loading">loading</div>;
        return (
          <div>
            <span data-testid="username">{user?.username ?? 'no user'}</span>
            <span data-testid="email">{user?.email ?? ''}</span>
            <span data-testid="firstName">{user?.firstName ?? ''}</span>
          </div>
        );
      };

      await act(async () => {
        render(
          <MemoryRouter>
            <AuthContextProvider>
              <AuthConsumer />
            </AuthContextProvider>
          </MemoryRouter>
        );
      });

      expect(HttpUtil.get).toHaveBeenCalledWith('/auth/profile');
      expect(HttpUtil.get).toHaveBeenCalledWith('/operation-customer/access');
      expect(await screen.findByTestId('username')).toHaveTextContent('jdoe');
      expect(screen.getByTestId('email')).toHaveTextContent(
        'john.doe@example.com'
      );
      expect(screen.getByTestId('firstName')).toHaveTextContent('John');
    });

    it('sets loading to false and leaves user null when API fails', async () => {
      const { HttpUtil } = await import('../utils/http-util');
      const { default: AuthContextProvider, useAuth } = await import(
        '../context/AuthContext'
      );

      (HttpUtil.get as ReturnType<typeof jest.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const AuthConsumer = () => {
        const { user, loading } = useAuth();
        return (
          <>
            <span data-testid="status">{loading ? 'loading' : 'done'}</span>
            <span data-testid="user">{user ? 'has user' : 'no user'}</span>
          </>
        );
      };

      await act(async () => {
        render(
          <MemoryRouter>
            <AuthContextProvider>
              <AuthConsumer />
            </AuthContextProvider>
          </MemoryRouter>
        );
      });

      expect(await screen.findByText('done')).toBeInTheDocument();
      expect(screen.getByTestId('user')).toHaveTextContent('no user');
    });

    it('sets driAdmin flag from permission response', async () => {
      const { HttpUtil } = await import('../utils/http-util');
      const { default: AuthContextProvider, useAuth } = await import(
        '../context/AuthContext'
      );

      (HttpUtil.get as ReturnType<typeof jest.fn>)
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce({
          data: { ...mockPermissionResponse.data, driAdmin: true },
        });

      const AuthConsumer = () => {
        const { isUserDRIAdmin, loading } = useAuth();
        if (loading) return null;
        return (
          <span data-testid="admin">
            {isUserDRIAdmin ? 'admin' : 'not admin'}
          </span>
        );
      };

      await act(async () => {
        render(
          <MemoryRouter>
            <AuthContextProvider>
              <AuthConsumer />
            </AuthContextProvider>
          </MemoryRouter>
        );
      });

      expect(await screen.findByTestId('admin')).toHaveTextContent('admin');
    });
  });
});
