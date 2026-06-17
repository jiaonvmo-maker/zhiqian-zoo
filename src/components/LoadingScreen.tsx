import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="w-full h-screen flex items-center justify-center pa-bg-lobby">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pa-panel p-8 text-center"
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <motion.div
            className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 border-4 border-pink-300 border-b-transparent rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <p className="pa-title text-xl mb-2">加载中...</p>
        <p className="pa-subtitle text-sm">正在准备 3D 场景</p>
      </motion.div>
    </div>
  );
}

export function ErrorFallback({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
  const errorMessage = error instanceof Error ? error.message : '3D 场景加载失败';
  const errorStack = error instanceof Error ? error.stack : String(error);
  return (
    <div className="w-full h-screen flex items-center justify-center pa-bg-lobby">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="pa-panel p-8 text-center max-w-md"
      >
        <div className="text-6xl mb-4">😵</div>
        <h2 className="pa-title text-2xl mb-3">哎呀，出错了</h2>
        <p className="pa-subtitle text-sm mb-4 text-left">
          {errorMessage}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="pa-btn pa-btn-pink px-6 py-3"
          >
            重试
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="pa-btn pa-btn-cream px-6 py-3"
          >
            返回首页
          </button>
        </div>
        {import.meta.env.DEV && (
          <details className="mt-4 text-left">
            <summary className="text-xs font-bold cursor-pointer text-red-600 mb-2">
              开发者信息
            </summary>
            <pre className="text-[10px] bg-gray-100 p-3 rounded overflow-auto max-h-40">
              {errorStack}
            </pre>
          </details>
        )}
      </motion.div>
    </div>
  );
}
