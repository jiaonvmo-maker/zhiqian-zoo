# 职前动物�?· 埋点说明（已配置好，不用再弄�?
**普通用户完全看不到埋点**，没有弹窗、没有按钮、没有性能影响�?
---

## 你怎么看数据（两个入口�?
### 1. 所有访问者的实时事件（推荐）

打开这个链接，点几下网站后刷新即可看到事件：

**https://webhook.site/#!/16afb4a2-3919-4805-bb4f-5928d9dc2585**

每条记录是一次用户行为（入口点击、测评完成、选部门等）�?
> 该通道免费可用�?7 天。到期后运行 `npm run analytics:setup` 会自动续一个新链接（或改用 PostHog，见下文）�?
### 2. 本机调试�?
本地或线上地址后面�?**`#pa-data`**，例如：

`http://localhost:5173/#pa-data`

只看当前浏览器里的事件，适合自测�?
---

## 已自动完成的内容

- �?代码�?16 个核心事件全部接�?- �?`.env.local` / `.env.production` 已写入上报地址
- �?GitHub Pages 部署会自动带上埋�?- �?用户界面零改�?
---

## 可选：升级 PostHog（漏斗图表更专业�?
1. 注册 https://posthog.com �?复制 `phc_` 密钥  
2. �?`.env.local` 加一行：`VITE_POSTHOG_KEY=phc_xxx`  
3. GitHub 仓库 Settings �?Secrets �?`VITE_POSTHOG_KEY`  
4. 重新部署  

PostHog 和现有通道�?*同时**上报，不冲突�?
---

## 事件清单

| 事件 | 含义 |
|------|------|
| `session_start` | 打开网站 |
| `entry_button_click` | 入口三选一 |
| `survey_complete` | 测评完成 |
| `floor_select` | 选部�?|
| `work_moment_complete` | 走完「干一天�?|
| `chat_message_send` | 群聊发言 |
| `chat_history_skip` | 群聊点跳�?|
| �?| �?`src/analytics/events.ts` |

不上传聊天原文和真实姓名�?
---

## 给研�?
- 代码：`src/analytics/`
- 自检：`npm run analytics:check`
- 重新配置：`npm run analytics:setup`
