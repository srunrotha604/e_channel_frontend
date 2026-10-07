import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import {
  IoCallOutline,
  IoKeyOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoTimeOutline,
  IoVolumeHighOutline,
  IoWarningOutline,
} from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import companyLogo from '../../../../assets/DaraInsurancePlc.png';
import userIcon from '../../../../assets/default-user.png';
import companyLogoFull from '../../../../assets/logo-full.jpg';
import Modal, { useModal } from '../../../../components/common/modal';
import ToggleSwitch from '../../../../components/common/ToggleSwitch';
import { useAuth } from '../../../../context/AuthContext';
import { ROUTE_PATH } from '../../../../utils/route-util';
import { STORAGE_KEY } from '../../../../utils/storage-key';
import {
  isNotificationSoundEnabled,
  setNotificationSoundEnabled,
} from '../../../notification';
import NotificationBell from '../../../notification/ui/components/NotificationBell';
import { logout } from '../../interface-adapters';
import { performLogout } from '../../use-cases';
import ChangeTheme from './ChangeTheme';
const HeaderPage = () => {
  const { user, clearUser, mode, application, passwordStatus } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(isNotificationSoundEnabled);
  const {
    modalRef: logoutModalRef,
    openModal: openLogoutModal,
    closeModal: closeLogoutModal,
  } = useModal();
  const toggleNotificationSound = () => {
    setSoundEnabled((current) => {
      const next = !current;
      setNotificationSoundEnabled(next);
      return next;
    });
  };
  const location = useLocation();
  const isAuthenticatePage = !location.pathname.includes(ROUTE_PATH.dashboard);
  const route = useNavigate();
  const e_chanel_storage = localStorage.getItem(STORAGE_KEY);
  const refreshToken = e_chanel_storage
    ? JSON.parse(e_chanel_storage).refreshToken
    : '';
  const signOut = () => {
    closeLogoutModal();
    performLogout(clearUser);
  };
  const { run: runLogout, loading: loginLoading } = useRequest(logout, {
    manual: true,
    onSuccess: async (res) => {
      console.log(res);
      signOut();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <header className="navbar-expand-lg  d-print-none">
      {passwordStatus?.expiringSoon && (
        <div className="bg-warning">
          <div className="container-xl d-flex p-2 justify-content-center align-items-center gap-3">
            <div className="w-4 h-4 bg-danger p-2 text-light d-flex justify-content-center align-items-center rounded-5">
              <IoWarningOutline />
            </div>
            <div className="text-light fw-bold text-center d-flex justify-content-center align-items-center flex-grow-1">
              {passwordStatus?.message || 'Consider changing your password.'}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => route(ROUTE_PATH.changePassword)}
            >
              Change Password
            </button>
          </div>
        </div>
      )}
      <div className="navbar navbar-light">
        <div className="container-xl">
          <button
            className="navbar-toggler d-sm-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-menu"
            aria-controls="navbarToggleExternalContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 p-0 pe-md-3">
            <Link to={ROUTE_PATH.dashboard}>
              {isAuthenticatePage ? (
                <img
                  src={companyLogoFull}
                  style={{
                    width: '180px',
                    height: '44px',
                    objectFit: 'contain',
                  }}
                  alt={'logo'}
                  className="navbar-brand-image"
                />
              ) : (
                <img
                  src={companyLogo}
                  width={110}
                  height={32}
                  alt={'logo'}
                  className="navbar-brand-image"
                />
              )}
              {!isAuthenticatePage && (
                <>
                  <div
                    style={{ marginLeft: '0.5rem', display: 'inline-block' }}
                    className={'text-primary-blue'}
                  >
                    {application?.applicationName || 'E-CHANNEL PORTAL'}
                  </div>
                  {mode != 'Production' ? (
                    <span className="badge bg-indigo-lt mb-2 ml-5">
                      {mode} mode
                    </span>
                  ) : (
                    ''
                  )}
                </>
              )}
            </Link>
          </div>
          <div className="navbar-nav flex-row order-md-last">
            <ChangeTheme />
            {user && <NotificationBell />}
            {user && (
              <div className="nav-item dropdown" role="button">
                <div
                  className="nav-link d-flex lh-1 text-reset p-0 "
                  data-bs-toggle="dropdown"
                  aria-label="Open user menu"
                >
                  <img
                    src={user?.avatarUrl ?? userIcon}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = userIcon;
                    }}
                    alt="Profile User"
                    className="profile-image w-4 h-4 rounded-5"
                  />
                  <div className="d-none d-xl-block ps-2">
                    <div>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="mt-1 small text-muted">
                      {application?.roleName}
                    </div>
                  </div>
                </div>
                <div
                  style={{ zIndex: 9999, width: 'max-content' }}
                  className="dropdown-menu dropdown-menu-end dropdown-menu-arrow"
                >
                  {user ? (
                    <>
                      <Link
                        to={ROUTE_PATH.profile}
                        className="dropdown-item d-flex align-items-center"
                      >
                        <IoPersonOutline className="me-2" />
                        Profile
                      </Link>
                      <div className="dropdown-divider" />
                      <Link
                        to={ROUTE_PATH.loginList}
                        className="dropdown-item d-flex align-items-center"
                      >
                        <IoTimeOutline className="me-2" />
                        Session
                      </Link>
                      <Link
                        to={ROUTE_PATH.contactUs}
                        className="dropdown-item d-flex align-items-center"
                      >
                        <IoCallOutline className="me-2" />
                        Contact Us
                      </Link>
                      <Link
                        to={ROUTE_PATH.changePassword}
                        className="dropdown-item d-flex align-items-center"
                      >
                        <IoKeyOutline className="me-2" />
                        Change password
                      </Link>
                      <div className="dropdown-item d-flex align-items-center justify-content-start">
                        <IoVolumeHighOutline className="me-2" />
                        <ToggleSwitch
                          label="Notification sound"
                          checked={soundEnabled}
                          onChange={toggleNotificationSound}
                        />
                      </div>
                      <div
                        className="dropdown-item d-flex align-items-center cursor-pointer"
                        onClick={openLogoutModal}
                      >
                        <IoLogOutOutline className="me-2" />
                        Logout
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        to={ROUTE_PATH.login}
                        className="dropdown-item d-flex align-items-center"
                      >
                        <IoLogInOutline className="me-2" />
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        ref={logoutModalRef}
        size="sm"
        title="Confirm Logout"
        content={<p className="mb-0">Are you sure you want to logout?</p>}
        actions={
          <>
            <button className="btn btn-secondary" onClick={closeLogoutModal}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => runLogout({ refreshToken: refreshToken })}
            >
              {loginLoading ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
              ) : (
                'Logout'
              )}
            </button>
          </>
        }
      />
    </header>
  );
};

export default HeaderPage;
