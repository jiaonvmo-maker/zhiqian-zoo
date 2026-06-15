import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Bell, X, Projector, MessageCircle, AlertCircle } from 'lucide-react';
import FluffyAvatar from '@/components/FluffyAvatar';

const ICONS = {
  project: Projector,
  social: MessageCircle,
  system: AlertCircle,
};

export default function NotificationSystem() {
  const { notifications, showNotifications, toggleNotifications, markRead, unreadCount, toggleBadge } = useGameStore();

  return (
    <AnimatePresence>
      {showNotifications && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pa-overlay"
          onClick={toggleNotifications}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            className="absolute bottom-0 left-0 right-0 max-h-[65vh] overflow-y-auto pa-scroll pa-panel pa-panel-accent"
            style={{ borderRadius: 'var(--pa-radius-xl) var(--pa-radius-xl) 0 0' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b-2 sticky top-0 flex items-center justify-between pa-hud" style={{ borderColor: 'var(--pa-brown-light)', borderRadius: 'var(--pa-radius-lg) var(--pa-radius-lg) 0 0' }}>
              <div className="flex items-center gap-2">
                <span className="text-xl">📢</span>
                <p className="pa-title text-sm">夺命连环 Call</p>
                {unreadCount > 0 && <span className="pa-tag-pink text-[10px] px-2 py-0.5">{unreadCount}</span>}
              </div>
              <button type="button" onClick={toggleNotifications} className="pa-icon-btn w-9 h-9">
                <X size={16} style={{ color: 'var(--pa-orange)' }} />
              </button>
            </div>

            <div className="px-4 py-2 space-y-1">
              {notifications.length === 0 && (
                <p className="text-center pa-subtitle text-sm py-10">暂无通知，去大楼里探索职业吧 🐾</p>
              )}
              {notifications.map((notif, i) => {
                const Icon = ICONS[notif.type] || Bell;
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => {
                      markRead(notif.id);
                      if (notif.actorAvatar) toggleBadge();
                    }}
                    className={`flex items-start gap-3 px-3 py-3 rounded-xl cursor-pointer ${!notif.read ? 'pa-panel-accent' : ''}`}
                    style={{ borderWidth: notif.read ? 0 : 2, borderColor: 'var(--pa-gold)' }}
                  >
                    <div className="flex-shrink-0">
                      {notif.actorAvatar ? (
                        <FluffyAvatar src={notif.actorAvatar} size={40} mood="energetic" showExpression borderColor="var(--pa-gold)" />
                      ) : (
                        <div className="pa-icon-btn w-9 h-9">
                          <Icon size={16} style={{ color: 'var(--pa-orange)' }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="pa-title text-xs truncate">{notif.title}</p>
                        {!notif.read && <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: 'var(--pa-pink)' }} />}
                      </div>
                      <p className="pa-subtitle text-xs mt-0.5 truncate">{notif.message}</p>
                      <p className="text-[10px] mt-1" style={{ color: 'var(--pa-brown-light)' }}>
                        {new Date(notif.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
