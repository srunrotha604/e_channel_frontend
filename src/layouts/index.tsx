import { Box } from '@mui/system';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MdSignalWifiStatusbarConnectedNoInternet } from 'react-icons/md';
import { Outlet } from 'react-router-dom';
import Modal, { useModal } from '../components/common/modal';
import ErrorPage from '../domains/default/ui/components/ErrorPage';
import FooterPage from '../domains/default/ui/components/FooterPage';
import HeaderPage from '../domains/default/ui/components/HeaderPage';
import SideBarPage from '../domains/default/ui/components/SideBarPage';
import { useOnlineStatus } from '../hooks/useOffline';
export default function Layout() {
  const isOnline = useOnlineStatus();
  const handleRefresh = () => {
    window.location.reload();
  };
  const {
    modalRef: offlineModalRef,
    openModal: openOfflineModal,
    closeModal: closeOfflineModal,
  } = useModal();
  useEffect(() => {
    if (!isOnline) {
      openOfflineModal();
    } else {
      closeOfflineModal();
    }
  }, [isOnline]);
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
          <HeaderPage />
          <SideBarPage />
          <ErrorBoundary FallbackComponent={ErrorPage} key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </Box>
      </Box>
      <FooterPage />
      <Modal ref={offlineModalRef} showHeader={false} autoClose={true}>
        <div className="d-flex  flex-column align-items-center justify-content-center">
          <div>
            <MdSignalWifiStatusbarConnectedNoInternet size={80} />
          </div>
          <div>
            <h4 className="text-info">No internet connection!</h4>
          </div>
          <div>
            <p className="text-secondary">
              Please check your network connection.
            </p>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => {
                handleRefresh();
                closeOfflineModal();
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
