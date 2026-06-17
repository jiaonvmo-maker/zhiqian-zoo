# 职业探索大厦 🏢

一个基于 React + Three.js 的 3D 交互式职业探索应用，以 Party Animals 风格呈现 11 个部门的职业发展路径。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF.svg)

## ✨ 特性

- 🏢 **3D 办公楼可视化**：11 层楼代表 11 个部门
- 🎮 **交互式工作站**：1:1 还原的办公室场景
- 👥 **NPC 系统**：每个部门包含 5 个职级的带路人
- 💬 **实时聊天**：与各职级 NPC 深度对话
- 🎨 **Party Animals 风格**：可爱的毛绒动物角色
- 📊 **职业数据**：详细的工作内容、真实场景和社区声音

## 🚀 快速开始

### 前置要求

- Node.js 20+
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3001](http://localhost:3001) 查看应用。

### 构建

```bash
# 生产构建
npm run build

# 预览生产构建
npm run preview
```

### 测试

```bash
# 运行 E2E 测试
npm run test

# 运行测试（带 UI）
npm run test:ui

# 调试测试
npm run test:debug
```

## 🏗️ 技术栈

### 核心框架
- **React 19** - UI 框架
- **TypeScript 5.9** - 类型安全
- **Vite 7.2** - 构建工具

### 3D 渲染
- **Three.js 0.184** - WebGL 3D 引擎
- **React Three Fiber 9.6** - React 渲染器
- **Drei 10.7** - Three.js 辅助工具

### UI & 动画
- **Tailwind CSS 3.4** - 样式框架
- **Radix UI** - 无障碍组件库
- **Framer Motion 12.38** - 动画库
- **GSAP 3.15** - 高性能动画

### 状态管理 & 工具
- **Zustand 5.0** - 状态管理
- **React Router 7.6** - 路由
- **Playwright 1.60** - E2E 测试

## 📁 项目结构

```
app/
├── src/
│   ├── components/          # React 组件
│   │   ├── ui/             # 基础 UI 组件
│   │   ├── pa/             # Party Animals 组件
│   │   ├── pa3d/           # 3D 角色组件
│   │   ├── OfficeBuilding.tsx
│   │   ├── WorkstationScene.tsx
│   │   └── ...
│   ├── data/               # 数据配置
│   │   ├── departments.ts  # 部门数据
│   │   ├── npcs.ts        # NPC 数据
│   │   └── ...
│   ├── store/              # 状态管理
│   │   └── gameStore.ts
│   ├── types/              # TypeScript 类型
│   ├── constants/          # 常量配置
│   ├── utils/              # 工具函数
│   └── App.tsx             # 应用入口
├── tests/                  # 测试文件
│   ├── e2e/               # E2E 测试
│   └── unit/              # 单元测试
├── public/                 # 静态资源
│   └── images/
├── .env.example           # 环境变量示例
└── IMPROVEMENTS.md        # 改进建议文档
```

## 🎮 游戏流程

1. **Entry Game** - 创建角色
2. **Quick Survey** - 性格测试
3. **Office Building** - 浏览 11 个部门
4. **Workstation Scene** - 进入具体部门工作站
5. **Department Chat** - 与 NPC 对话
6. **Meta Board** - 查看社区想法

## 🏢 部门列表

| 部门 | 颜色 | 描述 |
|------|------|------|
| 👑 管理层 | 金色 | 战略决策与资源分配 |
| ⚖️ 法务部 | 灰色 | 法律风险与合规保障 |
| 💵 财务部 | 青色 | 财务规划与成本控制 |
| 🎨 设计部 | 红色 | 用户体验与视觉设计 |
| 💡 产品部 | 绿色 | 需求管理与产品规划 |
| 💰 商业化 | 紫色 | 变现策略与商务拓展 |
| 💻 技术部 | 蓝色 | 系统开发与架构设计 |
| 📊 数据部 | 橙色 | 数据分析与指标优化 |
| 📢 运营部 | 橙黄 | 用户增长与活动策划 |
| 👥 人事部 | 紫蓝 | 招聘培养与组织发展 |
| 🎧 支持部 | 浅蓝 | 客户服务与问题解决 |

## 🔧 配置

### 环境变量

复制 `.env.example` 到 `.env` 并根据需要修改：

```bash
# 部署基础路径
VITE_BASE_PATH=/

# 调试模式
VITE_ENABLE_DEBUG=false
```

### 主题定制

修改 `src/constants/theme.ts` 来自定义颜色和样式：

```typescript
export const DEPARTMENT_COLORS = {
  tech: '#007aff',
  product: '#34c759',
  // ...
};
```

## 🤝 贡献

欢迎贡献！请查看 [IMPROVEMENTS.md](./IMPROVEMENTS.md) 了解改进计划。

### 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 配置
- 编写有意义的提交信息

## 📝 性能优化

- ✅ 懒加载 3D 组件
- ✅ 代码分割
- ✅ 纹理资源自动清理
- ✅ 错误边界保护
- ✅ 生产构建优化

## 🐛 故障排除

### 3D 场景无法加载

- 确保浏览器支持 WebGL
- 检查显卡驱动是否更新
- 尝试降低场景质量设置

### 构建失败

```bash
# 清理缓存
rm -rf node_modules dist
npm install
npm run build
```

### 端口冲突

修改 `vite.config.ts` 中的端口配置：

```typescript
server: {
  port: 3001, // 改为其他端口
}
```

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 🙏 致谢

- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D 渲染框架
- [Radix UI](https://www.radix-ui.com/) - 组件库
- [shadcn/ui](https://ui.shadcn.com/) - UI 设计灵感
- [Party Animals](https://www.partyanimals.com/) - 美术风格参考

## 📧 联系方式

有问题或建议？欢迎通过以下方式联系：

- 提交 Issue
- 发起 Discussion

---

⭐️ 如果这个项目对你有帮助，请给个 Star！
