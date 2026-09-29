import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EyeIcon from '../../../../components/Icons/EyeIcon';
import EyeOffIcon from '../../../../components/Icons/EyeOffIcon';
import { useAuth } from '../../../../context/AuthContext';
import { ROUTE_PATH } from '../../../../utils/route-util';
import {
  changePassword,
  fetchCurrentUserProfile,
} from '../../interface-adapters';
import {
  buildChangePasswordDto,
  buildPasswordPolicyMessage,
  validatePasswordStrength,
} from '../../use-cases';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
interface ChangePasswordFormValues {
  password: string;
  newPassword: string;
  confirmPassword: string;
}
const ChangePasswordPage = () => {
  const navigate = useNavigate();
  document.title = 'E-CHANNEL PORTAL | Change Password';
  const [userUrl, setUserUrl] = useState('');
  const [userName, setUserName] = useState('');
  const [show, setShow] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });
  const { setPasswordStaus } = useAuth();
  const toggleEye = (key: keyof typeof show) =>
    setShow((s) => ({ ...s, [key]: !s[key] }));
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ mode: 'onChange' });
  const newPasswordValue = watch('newPassword') ?? '';
  const { refresh: refreshProfile } = useRequest(fetchCurrentUserProfile, {
    onSuccess: (res) => {
      switch (res?.status) {
        case 200:
          {
            const profile = res?.data?.userProfile;
            setUserUrl(profile?.avatarUrl ?? '');
            setUserName(`${profile.firstName} ${profile.lastName}` || '');
            setPasswordStaus(res.data.passwordStatus);
          }
          break;
        case 400:
          toast.error(res?.statusText ?? '');
          break;
        case 403:
          toast.error(String(res?.data));
          break;
        default:
          navigate(ROUTE_PATH.error404);
      }
    },
  });
  const { run: runChangePassword } = useRequest(changePassword, {
    manual: true,
    onSuccess: (res) => {
      switch (res?.status) {
        case 200: {
          refreshProfile();
          toast.success(res?.data?.message ?? 'Password changed successfully', {
            autoClose: 50,
            pauseOnHover: false,
            onClose: () => navigate(ROUTE_PATH.dashboard),
          });
          break;
        }
        case 400:
          toast.error(res?.data?.message ?? '');
          break;
        case 403:
          toast.error(String(res?.data));
          break;
        default:
          navigate(ROUTE_PATH.error404);
      }
    },
  });
  const onSubmit = (data: ChangePasswordFormValues) => {
    runChangePassword(
      buildChangePasswordDto(
        data.password,
        data.newPassword,
        data.confirmPassword
      )
    );
  };
  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.dashboard);
  };
  return (
    <React.Fragment>
      <div className="container-tight py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card card-md"
          action="."
          method="get"
          autoComplete="off"
        >
          <div className="card-body">
            <h2 className="card-title text-center mb-2">Change Password</h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                borderRadius: 50,
              }}
            >
              <img
                src={userUrl}
                alt={userName}
                className="profile-image-details"
              />
            </div>
            <div className="mb-3 mt-2">
              <label className="form-label">User</label>
              <input
                type="text"
                className={
                  userName !== ''
                    ? 'form-control'
                    : 'form-control is-invalid is-invalid-lite'
                }
                placeholder="User"
                value={userName}
                required
                readOnly
              />
            </div>
            <div className="mb-2">
              <label className="form-label required">Password</label>
              <div className="input-group input-group-flat">
                <input
                  id="password"
                  type={show.password ? 'text' : 'password'}
                  className={'form-control'}
                  placeholder="Password"
                  autoComplete="off"
                  required
                  {...register('password', { required: true })}
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={() => toggleEye('password')}
                  aria-label={show.password ? 'Hide password' : 'Show password'}
                  aria-controls="password"
                >
                  {show.password ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label required">New password</label>
              <div className="input-group input-group-flat">
                <input
                  id="newPassword"
                  type={show.newPassword ? 'text' : 'password'}
                  className={`form-control ${
                    errors.newPassword ? 'is-invalid' : ''
                  }`}
                  placeholder="New password"
                  autoComplete="off"
                  required
                  {...register('newPassword', {
                    required: true,
                    validate: (value) =>
                      validatePasswordStrength(value) ||
                      buildPasswordPolicyMessage(),
                  })}
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={() => toggleEye('newPassword')}
                  aria-label={
                    show.newPassword ? 'Hide new password' : 'Show new password'
                  }
                  aria-controls="newPassword"
                >
                  {show.newPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              <PasswordStrengthMeter password={newPasswordValue} />
            </div>
            <div className="mb-2">
              <label className="form-label required">Confirm password</label>
              <div className="input-group input-group-flat">
                <input
                  id="confirmPassword"
                  type={show.confirmPassword ? 'text' : 'password'}
                  className={`form-control ${
                    errors.confirmPassword ? 'is-invalid' : ''
                  }`}
                  placeholder="Confirm password"
                  autoComplete="off"
                  required
                  {...register('confirmPassword', {
                    required: true,
                    validate: (value) =>
                      value === newPasswordValue || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={() => toggleEye('confirmPassword')}
                  aria-label={
                    show.confirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                  aria-controls="confirmPassword"
                >
                  {show.confirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="text-danger small mt-1">
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
            <div className="form-footer d-flex justify-content-between gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary mt-2"
                onClick={goBackHandleClick}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary mt-2">
                Change password
              </button>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};
export default ChangePasswordPage;
