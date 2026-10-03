import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { PatternFormat } from 'react-number-format';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getErrorMessage,
  getErrorStatus,
  handleRequestStatusError,
} from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { SecurityPolicy } from '../../entities';
import {
  confirmForgotPasswordChange,
  confirmForgotPasswordCode,
  requestForgotPassword,
  requestForgotPasswordViaSms,
} from '../../interface-adapters';
import {
  buildConfirmChangePasswordDto,
  buildConfirmCodeDto,
  buildForgotPasswordRequestDto,
  buildPasswordPolicyMessage,
  buildViaSmsDto,
  validatePasswordStrength,
  validateRequiredFields,
} from '../../use-cases';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
const ForgotPasswordPage = () => {
  document.title = 'E-CHANNEL PORTAL | Forgot Password';
  const navigate = useNavigate();
  const [showSendEmail, setShowSendEmail] = useState(true);
  const [showSMSResend, setShowSMSResend] = useState(false);
  const [email, setEmail] = useState('');
  const [addressMessage, setAddressMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [confirmKey, setConfirmKey] = useState('');
  const [invalidFeedBack, setInvalidFeedBack] = useState('');
  const [confirmChangeKey, setConfirmChangeKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [confirmCodeMessage, setConfirmCodeMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [viaSMSCode, setViaSMSCode] = useState('');
  const [securityPolicy, setSecurityPolicy] = useState<
    SecurityPolicy | undefined
  >();
  const { run: runRequestForgotPassword, loading: requestLoading } = useRequest(
    requestForgotPassword,
    {
      manual: true,
      onSuccess: (res) => {
        setShowSendEmail(false);
        setSuccess(false);
        setConfirmCode('');
        setConfirmKey(res?.data?.token ?? '');
        setConfirmCodeMessage(
          'Enter the code we sent to your email address at'
        );
        setAddressMessage(email);
        setViaSMSCode(res?.data?.smsToken ?? '');
        setShowSMSResend(res.data.forgotPasswordViaSMS || false);
        setSecurityPolicy(res?.data?.securityPolicy);
        setInvalidFeedBack('');
      },
      onError: (error) => {
        const status = getErrorStatus(error);
        if (status === 400) {
          setShowSendEmail(true);
          setSuccess(false);
          const message = getErrorMessage(error);
          setInvalidFeedBack(message);
          toast.error(message);
        } else if (status === 403) {
          handleRequestStatusError(error, navigate);
        } else {
          navigate(ROUTE_PATH.error404);
        }
      },
    }
  );

  const { run: runConfirmCode, loading: confirmCodeLoading } = useRequest(
    confirmForgotPasswordCode,
    {
      manual: true,
      onSuccess: (res) => {
        setSuccess(true);
        setConfirmChangeKey(res?.data?.token ?? '');
      },
      onError: (error) => {
        const status = getErrorStatus(error);
        if (status === 400) {
          setSuccess(false);
          setInvalidFeedBack(getErrorMessage(error));
        } else if (status === 403) {
          handleRequestStatusError(error, navigate);
        } else {
          navigate(ROUTE_PATH.error404);
        }
      },
    }
  );
  const { run: runRequestViaSms, loading: viaSmsLoading } = useRequest(
    requestForgotPasswordViaSms,
    {
      manual: true,
      onSuccess: (res) => {
        setConfirmCodeMessage('Enter the code we sent to your phone number');
        setAddressMessage(phoneNumber);
        setShowSMSResend(true);
        if (res?.data?.attempt == 3) setPhoneNumber('');
      },
      onError: (error) => {
        const status = getErrorStatus(error);
        if (status === 400) {
          setSuccess(false);
          setInvalidFeedBack(getErrorMessage(error));
        } else if (status === 403) {
          handleRequestStatusError(error, navigate);
        } else {
          navigate(ROUTE_PATH.error404);
        }
      },
    }
  );
  const { run: runChangePassword, loading: changePasswordLoading } = useRequest(
    confirmForgotPasswordChange,
    {
      manual: true,
      onSuccess: () => {
        setResetSuccess(true);
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );
  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (validateRequiredFields([email])) {
      runRequestForgotPassword(buildForgotPasswordRequestDto(email));
    }
    e.preventDefault();
  };

  const funcConfirmCodeHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (validateRequiredFields([confirmCode])) {
      runConfirmCode(
        buildConfirmCodeDto(email, confirmKey, confirmCode.replace(/\s/g, ''))
      );
    }
    e.preventDefault();
  };
  const resqustViaSMSSubmit = () => {
    runRequestViaSms(buildViaSmsDto(email, confirmKey, viaSMSCode));
  };
  const funcChangePasswordHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password not match');
      return;
    }

    if (!validatePasswordStrength(newPassword, securityPolicy)) {
      toast.error(buildPasswordPolicyMessage(securityPolicy));
      return;
    }

    runChangePassword(
      buildConfirmChangePasswordDto(
        email,
        confirmChangeKey,
        newPassword,
        confirmPassword
      )
    );

    e.preventDefault();
  };
  const emailHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setInvalidFeedBack('');
  };
  const confirmCodeHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmCode(event.target.value);
    setInvalidFeedBack('');
  };
  const newPasswordHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPassword(event.target.value);
    setInvalidFeedBack('');
  };
  const ConfirmPasswordHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
    setInvalidFeedBack('');
  };
  const toggleNewPassword = () => {
    setNewPasswordShown(!newPasswordShown);
  };
  const toggleConfirmPassword = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };
  return (
    <React.Fragment>
      <div className="container-tight py-4 full-height-container d-flex justify-content-center align-items-center">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="card card-md w-100"
          autoComplete="off"
        >
          <div className="card-body">
            <h1 className={'text-center text-primary-blue'}>
              E-CHANNEL PORTAL
            </h1>
            <h2 className="card-title text-center mb-2">
              {resetSuccess ? 'Reset password successfully' : 'Forgot password'}
            </h2>
            {resetSuccess ? (
              <>
                <div className="text-center text-green mt-2">
                  <div className="mt-3">
                    <AiOutlineCheckCircle style={{ fontSize: '48px' }} />
                  </div>
                  <p className="text-dark">
                    Your password has been reset successfully
                  </p>
                  <div className="mt-3">
                    <Link to={ROUTE_PATH.login} className="btn btn-primary">
                      Back to login
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                {invalidFeedBack && (
                  <div className="alert alert-danger">{invalidFeedBack}</div>
                )}
                {success ? (
                  <>
                    <div className="alert alert-info">
                      {buildPasswordPolicyMessage(securityPolicy)}
                    </div>
                    <div className="mb-2">
                      <label className="form-label required">
                        New password
                      </label>
                      <div className="input-group input-group-flat">
                        <input
                          type={newPasswordShown ? 'text' : 'password'}
                          className={
                            newPassword !== ''
                              ? 'form-control'
                              : 'form-control is-invalid is-invalid-lite'
                          }
                          placeholder="New password"
                          autoComplete="off"
                          onChange={newPasswordHandleChange}
                          value={newPassword}
                          required
                        />
                        <span className="input-group-text">
                          {newPasswordShown === true ? (
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
                              onClick={toggleNewPassword}
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
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
                              onClick={toggleNewPassword}
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <line x1={3} y1={3} x2={21} y2={21} />
                              <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83" />
                              <path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341" />
                            </svg>
                          )}
                        </span>
                      </div>
                      <PasswordStrengthMeter
                        password={newPassword}
                        policy={securityPolicy}
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label required">
                        Confirm password
                      </label>
                      <div className="input-group input-group-flat">
                        <input
                          type={confirmPasswordShown ? 'text' : 'password'}
                          className={
                            confirmPassword !== '' &&
                            confirmPassword === newPassword
                              ? 'form-control'
                              : 'form-control is-invalid is-invalid-lite'
                          }
                          placeholder="Confirm password"
                          autoComplete="off"
                          onChange={ConfirmPasswordHandleChange}
                          value={confirmPassword}
                          required
                        />
                        <span className="input-group-text">
                          {confirmPasswordShown === true ? (
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
                              onClick={toggleConfirmPassword}
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
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
                              onClick={toggleConfirmPassword}
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <line x1={3} y1={3} x2={21} y2={21} />
                              <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83" />
                              <path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341" />
                            </svg>
                          )}
                        </span>
                      </div>
                      {confirmPassword !== '' &&
                        confirmPassword !== newPassword && (
                          <div className="text-danger small mt-1">
                            Passwords do not match
                          </div>
                        )}
                    </div>
                    <div className="mt-3">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        onClick={funcChangePasswordHandleClickExecute}
                        disabled={changePasswordLoading}
                      >
                        {changePasswordLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          />
                        ) : (
                          'Confirm'
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {showSendEmail ? (
                      <>
                        <p className="text-muted mb-1">
                          Enter your email address and we'll send you a code to
                          reset your password
                        </p>
                        <div className="mb-1">
                          <label className="form-label">Email address</label>
                          <input
                            type="text"
                            className="form-control text-center"
                            placeholder="Email address"
                            onChange={emailHandleChange}
                            value={email}
                            required
                          />
                        </div>
                        <div className="mt-3">
                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                            onClick={funcButtonHandleClickExecute}
                            disabled={requestLoading}
                          >
                            {requestLoading ? (
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <rect
                                  x={3}
                                  y={5}
                                  width={18}
                                  height={14}
                                  rx={2}
                                />
                                <polyline points="3 7 12 13 21 7" />
                              </svg>
                            )}
                            Reset password
                          </button>
                          <Link
                            className="btn w-100 mt-2"
                            to={ROUTE_PATH.login}
                          >
                            Back to login
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-muted mb-0">{confirmCodeMessage}</p>
                        <b>{addressMessage}</b>
                        <div className="mb-2 mt-2">
                          <label className="form-label">Confirm code</label>
                          <PatternFormat
                            type="text"
                            className="form-control text-center"
                            placeholder="## ## ##"
                            onChange={confirmCodeHandleChange}
                            value={confirmCode}
                            required
                            max={6}
                            format="## ## ##"
                          />
                        </div>
                        <div className="mt-3">
                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                            onClick={funcConfirmCodeHandleClickExecute}
                            disabled={confirmCodeLoading}
                          >
                            {confirmCodeLoading ? (
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-circle-check"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <circle cx={12} cy={12} r={9} />
                                <path d="M9 12l2 2l4 -4" />
                              </svg>
                            )}
                            Confirm
                          </button>
                          <button
                            type="button"
                            className="btn w-100 mt-2"
                            onClick={() => {
                              setShowSendEmail(true);
                              setConfirmCode('');
                              setShowSMSResend(false);
                            }}
                          >
                            Cancel
                          </button>

                          {showSMSResend ? (
                            <div className="d-flex justify-content-start mt-3">
                              <p className="mr-5">Don't get Code?</p>
                              <div
                                className="ms-1"
                                onClick={
                                  viaSmsLoading
                                    ? undefined
                                    : () => resqustViaSMSSubmit()
                                }
                              >
                                <p className="cursor-pointer text-decoration-underline text-primary">
                                  {viaSmsLoading
                                    ? 'Sending...'
                                    : !showSMSResend
                                    ? 'Let click here to get code via SMS instead'
                                    : 'Resend OTP Code via SMS again'}
                                </p>
                              </div>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};
export default ForgotPasswordPage;
