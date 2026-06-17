# 项目改进建议文档

> 生成时间：2026-06-17  
> 项目：职业探索大厦 (Kimi Agent App)

## 📊 项目概览

**项目类型**：3D 交互式职业探索应用  
**技术栈**：React 19 + TypeScript + Three.js + Vite  
**特色**：Party Animals 风格的 11 层办公楼，包含 5 层职级系统

---

## ✅ 项目优势

1. **创意设计**：3D 可视化 + 毛绒动物角色，用户体验友好
2. **技术先进**：使用最新的 React 19 和 Three.js
3. **内容丰富**：详细的职业路径和真实场景描述
4. **架构清晰**：良好的组件化和状态管理

---

## 🔴 高优先级问题（立即处理）

### 1. Git 工作流规范化

**当前问题**：
- 直接在 master 分支修改
- 有未提交的更改

**解决方案**：
```bash
# 1. 提交当前更改
git add src/components/Workstation3D.tsx src/data/officeLayout.ts
git commit -m "feat: add 3D workstation scene with office layout"

git add src/components/WorkstationScene.tsx vite.config.ts
git commit -m "chore: update workstation scene and vite config"

# 2. 未来使用功能分支
git checkout -b feature/new-feature
```

### 2. 构建配置问题

**位置**：`vite.config.ts:8`

**当前代码**：
```typescript
base: process.env.NODE_ENV === 'production' ? '/zhiqian-zoo/' : '/',
```

**问题**：硬编码的路径名称与项目不一致

**建议修复**：
```typescript
base: process.env.VITE_BASE_PATH || '/',
```

然后在 `.env.production` 中配置：
```
VITE_BASE_PATH=/your-project-path/
```

### 3. 添加错误边界

**问题**：3D 场景渲染失败时没有降级方案

**解决方案**：
```bash
npm install react-error-boundary
```

在 `App.tsx` 中包裹 3D 组件：
```typescript
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<div>3D 场景加载失败，请刷新页面</div>}>
  <OfficeBuilding />
</ErrorBoundary>
```

---

## 🟡 中优先级问题（本周处理）

### 4. 添加单元测试和 E2E 测试

**当前状态**：已安装 Playwright 但无测试文件

**建议结构**：
```
tests/
  ├── e2e/
  │   ├── navigation.spec.ts       # 导航测试
  │   ├── department.spec.ts       # 部门交互测试
  │   └── workstation.spec.ts      # 工作站测试
  └── unit/
      ├── components/
      │   └── FluffyAvatar.test.tsx
      └── store/
          └── gameStore.test.ts
```

**示例测试**：
```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test('should navigate from entry to office building', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=职业探索大厦')).toBeVisible();
});
```

### 5. 性能优化

#### 5.1 Three.js 资源管理

**位置**：`src/components/Workstation3D.tsx`

**添加资源清理**：
```typescript
// 在 FloorPlan 组件中
useEffect(() => {
  return () => {
    floorTex.dispose();
  };
}, [floorTex]);
```

#### 5.2 使用 React.lazy 代码分割

```typescript
// src/App.tsx
const OfficeBuilding = lazy(() => import('@/components/OfficeBuilding'));
const WorkstationScene = lazy(() => import('@/components/WorkstationScene'));

<Suspense fallback={<LoadingSpinner />}>
  <OfficeBuilding />
</Suspense>
```

### 6. 类型安全改进

**位置**：`src/store/gameStore.ts:18`

**当前**：
```typescript
departmentMessages: Record<string, ChatMessage[]>
```

**改进**：
```typescript
import type { Department } from '@/types';
departmentMessages: Record<Department['id'], ChatMessage[]>
```

---

## 🟢 低优先级问题（持续优化）

### 7. 创建主题配置文件

**避免硬编码颜色值**

创建 `src/constants/theme.ts`：
```typescript
export const DEPARTMENT_COLORS = {
  tech: '#007aff',
  product: '#34c759',
  operation: '#ff9500',
  commercial: '#af52de',
  design: '#ff2d55',
  finance: '#00c7be',
  legal: '#8e8e93',
  management: '#c9a227',
  data: '#ff6b35',
  hr: '#5856d6',
  support: '#64d2ff',
} as const;

export const UI_COLORS = {
  bg: {
    lobby: '#f7ebdd',
    scene: '#e8e4df',
  },
  text: {
    primary: '#333',
    secondary: '#888',
    tertiary: '#666',
  },
} as const;
```

### 8. 添加无障碍功能

```typescript
// 为 3D 场景添加键盘导航
<Canvas
  role="img"
  aria-label="3D 办公楼场景，展示 11 个部门"
  tabIndex={0}
>
  ...
</Canvas>

// 为 NPC 添加 aria-label
<group aria-label={`${npc.name} - ${npc.role}`}>
  ...
</group>
```

### 9. 添加 loading 状态

```typescript
// src/components/LoadingScreen.tsx
export function LoadingScreen() {
  return (
    <div className="w-full h-screen flex items-center justify-center pa-bg-lobby">
      <div className="pa-panel p-8 text-center">
        <div className="animate-spin w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="pa-title">加载中...</p>
      </div>
    </div>
  );
}
```

### 10. 环境变量管理

创建 `.env.example`：
```
VITE_BASE_PATH=/
VITE_API_URL=
VITE_ENABLE_DEBUG=false
```

### 11. 添加 Commit 规范

创建 `.commitlintrc.json`：
```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore"]
    ]
  }
}
```

### 12. 性能监控

```typescript
// src/utils/performance.ts
export function logPerformance(metricName: string) {
  if (import.meta.env.DEV) {
    performance.mark(metricName);
    console.log(`[Performance] ${metricName}:`, performance.now());
  }
}
```

---

## 📦 推荐添加的依赖

```bash
# 错误边界
npm install react-error-boundary

# 测试工具
npm install -D @testing-library/react @testing-library/jest-dom vitest

# 代码质量
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional

# 性能监控
npm install web-vitals
```

---

## 🚀 实施计划

### 第一周
- [ ] 提交当前更改
- [ ] 修复 vite.config.ts 配置
- [ ] 添加错误边界
- [ ] 创建主题配置文件

### 第二周
- [ ] 编写基础 E2E 测试
- [ ] 优化 Three.js 资源管理
- [ ] 添加代码分割

### 第三周
- [ ] 完善类型定义
- [ ] 添加 loading 状态
- [ ] 实施性能监控

### 持续优化
- [ ] 添加无障碍功能
- [ ] 国际化支持
- [ ] 用户行为分析

---

## 📝 注意事项

1. **向后兼容**：所有改进不应破坏现有功能
2. **渐进增强**：优先保证核心功能，然后添加增强特性
3. **性能优先**：3D 场景优化是重中之重
4. **用户体验**：降级方案和错误提示要友好

---

## 🔗 相关资源

- [React Three Fiber 文档](https://docs.pmnd.rs/react-three-fiber)
- [Three.js 性能优化](https://threejs.org/manual/#en/optimize-lots-of-objects)
- [Vite 配置指南](https://vitejs.dev/config/)
- [React 19 新特性](https://react.dev/blog/2024/12/05/react-19)
