import { IoIosNotificationsOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { formatDay } from '../../../../utils/format-day';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { NotificationItem } from '../../entities';
import { useNotifications } from '../../use-notifications';

const getTarget = (item: NotificationItem): string | null => {
  if (item.transationCode) {
    return ROUTE_PATH.customerTransaction(item.transationCode);
  }
  if (item.batchNumber) {
    return ROUTE_PATH.customerBatch(item.batchNumber);
  }
  return null;
};

const NotificationBell = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const scopeKey = `${token?.company ?? ''}|${token?.branch ?? ''}`;
  const { items, unreadCount, loading, markRead, markAllRead } =
    useNotifications(!!user, scopeKey);

  const openItem = (item: NotificationItem) => {
    if (!item.isRead) void markRead(item.id);
    const target = getTarget(item);
    if (target) navigate(target);
  };

  return (
    <div className="nav-item dropdown d-none d-md-flex me-3">
      <a
        href="#"
        className="nav-link px-0"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        tabIndex={-1}
        aria-label="Show notifications"
        onClick={(e) => e.preventDefault()}
      >
        <IoIosNotificationsOutline size={24} />
        {unreadCount > 0 && (
          <span className="badge bg-red text-white position-absolute top-0 start-100 translate-middle rounded-pill">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </a>
      <div
        style={{ zIndex: 9999 }}
        className="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card"
      >
        <div className="card" style={{ width: 380, maxWidth: '90vw' }}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="card-title">Notifications</h3>
            <button
              type="button"
              className="btn btn-sm btn-link"
              disabled={unreadCount === 0}
              onClick={() => void markAllRead()}
            >
              Mark all as read
            </button>
          </div>
          <div
            className="list-group list-group-flush overflow-auto"
            style={{ maxHeight: 420 }}
          >
            {items.length === 0 && (
              <div className="list-group-item text-muted text-center py-4">
                {loading ? 'Loading...' : 'No notifications'}
              </div>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                role="button"
                className={`list-group-item list-group-item-action ${
                  item.isRead ? '' : 'bg-blue-lt'
                }`}
                onClick={() => openItem(item)}
              >
                <div className="d-flex align-items-start">
                  <span
                    className={`badge me-2 mt-1 ${
                      item.isRead ? 'bg-secondary' : 'bg-blue'
                    }`}
                    style={{ width: 8, height: 8, padding: 0 }}
                  />
                  <div className="flex-fill">
                    <div className="text-body">{item.message}</div>
                    {item.remark && (
                      <div className="small text-danger">
                        Reason: {item.remark}
                      </div>
                    )}
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <span className="small text-muted">
                        {formatDay(item.createdAt)}
                      </span>
                      {item.actionRequired && (
                        <span className="badge bg-orange-lt">
                          Action required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
