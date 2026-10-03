import { useRequest } from 'ahooks';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import {
  getErrorMessage,
  getErrorStatus,
} from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import { STORAGE_KEY } from '../../../../utils/storage-key';
import { login } from '../../interface-adapters';
import { buildLoginDto, validateRequiredFields } from '../../use-cases';
const LoginPage = () => {
  document.title = 'E-CHANNEL PORTAL | Login';
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [invalidFeedBack, setInvalidFeedBack] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const { fetchUser } = useAuth();
  const { run: runLogin, loading: loginLoading } = useRequest(login, {
    manual: true,
    onSuccess: async (res) => {
      const alt_fa_token = {
        token: res?.data?.accessToken,
        refreshToken: res?.data?.refreshToken,
        company: res?.data?.company,
        branch: res?.data?.branch,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alt_fa_token));
      await fetchUser();
      if (location?.state?.from?.pathname) {
        navigate(location?.state?.from?.pathname);
      } else {
        navigate(ROUTE_PATH.dashboard);
      }
    },
    onError: (error) => {
      const status = getErrorStatus(error);
      if (status === 400) {
        setInvalidFeedBack(getErrorMessage(error));
      } else if (status === 403) {
        setInvalidFeedBack(
          axios.isAxiosError(error) ? String(error.response?.data) : ''
        );
      } else {
        navigate(ROUTE_PATH.error404);
      }
    },
  });
  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (validateRequiredFields([userName, password])) {
      runLogin(buildLoginDto(userName, password));
    }
    e.preventDefault();
  };
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const userNameHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
    setInvalidFeedBack('');
  };
  const PasswordHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setInvalidFeedBack('');
  };
  return (
    <>
      <div className="container-tight py-4 full-height-container d-flex justify-content-center align-items-center">
        <form
          className="card card-md w-100"
          action="."
          method="get"
          autoComplete="off"
        >
          <div className="card-body">
            <h1 className={'text-center text-primary-blue'}>
              E-CHANNEL PORTAL
            </h1>
            <h2 className="card-title text-center mb-4">
              Login to your account
            </h2>
            <h5 className="text-center text-danger">{invalidFeedBack}</h5>
            <div className="mb-3">
              <label className="form-label required">User name</label>
              <input
                type="text"
                className={
                  userName !== ''
                    ? 'form-control'
                    : 'form-control is-invalid is-invalid-lite'
                }
                placeholder="User name"
                onChange={userNameHandleChange}
                value={userName}
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label required">
                Password
                <span className="form-label-description">
                  <Link to={ROUTE_PATH.forgotPassword} tabIndex={-1}>
                    I forgot password
                  </Link>
                </span>
              </label>
              <div className="input-group input-group-flat">
                <input
                  type={passwordShown ? 'text' : 'password'}
                  className={
                    password !== ''
                      ? 'form-control'
                      : 'form-control is-invalid is-invalid-lite'
                  }
                  placeholder="Password"
                  autoComplete="off"
                  onChange={PasswordHandleChange}
                  value={password}
                  required
                />
                <span className="input-group-text">
                  {passwordShown === true ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon cursor-pointer"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      onClick={togglePassword}
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx={12} cy={12} r={2} />
                      <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon cursor-pointer"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      onClick={togglePassword}
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1={3} y1={3} x2={21} y2={21} />
                      <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83" />
                      <path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341" />
                    </svg>
                  )}
                </span>
              </div>
            </div>
            <div className="form-footer">
              <button
                type="submit"
                className="btn btn-primary w-100"
                onClick={funcButtonHandleClickExecute}
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                ) : (
                  'Log in'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
