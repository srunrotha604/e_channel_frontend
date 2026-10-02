import { useCallback, useEffect, useRef, useState } from 'react';
import type { NotificationItem } from './entities';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  openNotificationStream,
} from './interface-adapters';
import {
  isNotificationSoundEnabled,
  playNotificationSound,
} from './use-cases/notification-sound';
const PAGE_SIZE = 20;
export function useNotifications(enabled: boolean, scopeKey: string) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const scopeRef = useRef(scopeKey);
  scopeRef.current = scopeKey;

  const reload = useCallback(async () => {
    const requestedScope = scopeRef.current;
    setLoading(true);
    const data = await fetchNotifications(PAGE_SIZE);
    if (requestedScope !== scopeRef.current) return;
    setLoading(false);
    if (!data) return;
    setItems(data.list ?? []);
    setUnreadCount(data.unreadCount ?? 0);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setUnreadCount(0);
      return;
    }

    return openNotificationStream({
      onConnected: () => void reload(),
      onNotification: (item) => {
        setItems((current) =>
          current.some((n) => n.id === item.id)
            ? current
            : [item, ...current].slice(0, PAGE_SIZE)
        );
        setUnreadCount((count) => (item.isRead ? count : count + 1));
        if (!item.isRead && isNotificationSoundEnabled()) {
          playNotificationSound();
        }
      },
    });
  }, [enabled, scopeKey, reload]);

  const markRead = useCallback(async (id: number) => {
    setItems((current) =>
      current.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    const res = await markNotificationRead(id);
    if (res) setUnreadCount(res.unreadCount);
  }, []);

  const markAllRead = useCallback(async () => {
    const res = await markAllNotificationsRead();
    if (!res) return;
    setItems((current) => current.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(res.unreadCount);
  }, []);

  return { items, unreadCount, loading, reload, markRead, markAllRead };
}
