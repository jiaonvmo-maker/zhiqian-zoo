import { Suspense, lazy, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useGameStore } from '@/store/gameStore';
import EntryGame from '@/components/EntryGame';
import QuickSurvey from '@/components/QuickSurvey';
import DepartmentChat from '@/components/DepartmentChat';
import MetaBoard from '@/components/MetaBoard';
import SalaryBoard from '@/components/SalaryBoard';
import NotificationSystem from '@/components/NotificationSystem';
import AnalyticsPanel from '@/components/AnalyticsPanel';
import { LoadingScreen, ErrorFallback, SceneShell } from '@/components/LoadingScreen';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy load 3D components for better performance
const OfficeBuilding = lazy(() => import('@/components/OfficeBuilding'));
const WorkstationScene = lazy(() => import('@/components/WorkstationScene'));

export default function App() {
  const phase = useGameStore((s) => s.phase);
  const [showAnalytics, setShowAnalytics] = useState(
    () => typeof window !== 'undefined' && window.location.hash === '#pa-data',
  );

  useEffect(() => {
    const sync = () => setShowAnalytics(window.location.hash === '#pa-data');
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  if (showAnalytics) {
    return <AnalyticsPanel />;
  }

  return (
    <div className="w-full h-screen overflow-hidden pa-bg-lobby">
      <AnimatePresence>
        {phase === 'entry' && (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <EntryGame />
          </motion.div>
        )}

        {phase === 'survey' && (
          <motion.div
            key="survey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <QuickSurvey />
          </motion.div>
        )}

        {phase === 'sandbox' && (
          <motion.div
            key="sandbox"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-screen"
          >
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
              <Suspense fallback={<LoadingScreen />}>
                <OfficeBuilding />
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        )}

        {phase === 'workstation' && (
          <motion.div
            key="workstation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-screen"
          >
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
              <Suspense fallback={<SceneShell />}>
                <WorkstationScene />
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        )}

        {phase === 'department' && (
          <motion.div
            key="department"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <DepartmentChat />
          </motion.div>
        )}

        {phase === 'salary' && (
          <motion.div
            key="salary"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <SalaryBoard />
          </motion.div>
        )}

        {phase === 'meta' && (
          <motion.div
            key="meta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <MetaBoard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Notification Layer */}
      <NotificationSystem />
    </div>
  );
}
