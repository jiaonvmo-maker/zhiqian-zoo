import type { NPC } from '@/types';
import { getPartyAvatar } from './partyAnimalsAssets';

const rawNpcs: NPC[] = [
  // ===== 产品部 =====
  { id: 'pm-1', name: '柯基·需求又改了', role: '高级产品经理', tier: 'senior', tierLabel: '高级 / 主管', dailyBrief: '上午评审排期，下午对齐研发，晚上改 PRD——推送前三天点击高、后面掉，要拆是文案还是人群包的问题。', avatar: '/images/avatars/pm.png', departmentId: 'product', personality: 'energetic', lines: ['这个需求逻辑上很简单，但实现路径咱们再对齐一下。', '数据不好看，这个版本先 hold，别硬上。', '你怎么证明这个改动有效？指标和实验设计先说清楚。'] },
  { id: 'pm-2', name: '柴柴·复盘先写', role: '产品运营专员', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '盯日活漏斗、写活动 brief、催设计出 banner，一天三场对齐会。', avatar: '/images/avatars/operator.png', departmentId: 'product', personality: 'energetic', lines: ['留存掉了两个点，得赶紧上个促活。', '老板问为什么 DAU 没涨，我在写复盘。', '这版文案转化不行，再改一版。'] },
  { id: 'pm-3', name: '熊猫·已读不回', role: '产品实习生', tier: 'intern', tierLabel: '实习生', dailyBrief: '整理竞品截图、录用户访谈、把会议纪要发进群里等大家已读。', avatar: '/images/avatars/pm-sleepy.png', departmentId: 'product', personality: 'chill', lines: ['访谈笔记整理好了，发你飞书。', '竞品功能表更新了，共 23 个。', '导师说 PRD 明天再写也行……吧。'] },
  { id: 'pm-4', name: '鹦·再拉个会对吧', role: '产品专员', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '在老板、研发、测试之间传需求变更，擅长把「不行」翻译成「再评估」。', avatar: '/images/avatars/parrot-hr.png', departmentId: 'product', personality: 'sneaky', lines: ['研发说排期满了，测试说用例还没写完。', '老板刚又提了个想法，我记录在 backlog 了。', '这个需求优先级，咱们再拉个会？'] },

  // ===== 技术部 =====
  { id: 'dev-1', name: '浣熊·在写了真的', role: '后端开发工程师', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '写接口、对字段、修告警；被问超卖怎么解决、热 Key 怎么办——答完继续在群里回「在写了」。', avatar: '/images/avatars/programmer.png', departmentId: 'tech', personality: 'chill', lines: ['接口文档更新了，别传错字段。', '这不是 Bug，是历史兼容逻辑……大概吧。', '排期紧的话，优化下个迭代，先保上线。'] },
  { id: 'dev-2', name: '树懒·第四版需求', role: '全栈高级工程师', tier: 'senior', tierLabel: '高级 / 主管', dailyBrief: '前后端联调、Code Review、帮新人看方案，凌晨两点还在看日志。', avatar: '/images/avatars/programmer.png', departmentId: 'tech', personality: 'tired', lines: ['需求又改了，这是本周第四版。', '上线窗口就今晚，自测覆盖率够吗？', '技术债清单我整理了，没人愿意看。'] },
  { id: 'qa-1', name: '啄木·我录屏了', role: '测试工程师', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '写用例、提 Bug 单、做回归，开发说「我这边没问题」时默默打开录屏。', avatar: '/images/avatars/tester.png', departmentId: 'tech', personality: 'strict', lines: ['复现路径写清楚了，优先级 P0。', '边界条件没覆盖，验收过不了。', '自测报告呢？上线前我要签字。'] },
  { id: 'dev-4', name: '哈士·Safari 又崩', role: '前端开发工程师', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '还原设计稿、处理浏览器兼容、跟后端对字段，CSS 又莫名错位了。', avatar: '/images/avatars/dev-frontend.png', departmentId: 'tech', personality: 'energetic', lines: ['设计稿和组件库不一致，我对齐一下。', '这个动效可以做，但工期要加两天。', 'Safari 又抽风了，我查一下。'] },
  { id: 'dev-5', name: '海狸·凌晨告警', role: '运维 / SRE 主管', tier: 'director', tierLabel: '总监', dailyBrief: '盯监控大盘、做容量规划、写故障复盘，PagerDuty 响时全员清醒。', avatar: '/images/avatars/beaver-dev.png', departmentId: 'tech', personality: 'strict', lines: ['昨晚 CPU 飙到 95%，扩容方案今晚出。', '变更窗口就两小时，回滚预案准备好了吗？', 'SLA 这个月已经破过一次了。'] },

  // ===== 运营部 =====
  { id: 'op-1', name: '兔兔·夹在中间', role: '增长运营专员', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '一人扛内容+投放+数据复盘；转化在天猫抖音发生，老板却问你小红书 ROI——预算还差 30%。', avatar: '/images/avatars/operator.png', departmentId: 'operation', personality: 'energetic', lines: ['品牌部要调性，电商部要 GMV，我夹在中间改方案。', '这条笔记没爆，但真不是我没投流。', 'JD 写运营，实际是公司试错和救火队——你懂的。'] },
  { id: 'op-2', name: '松鼠·完读12%', role: '内容运营高级专员', tier: 'senior', tierLabel: '高级 / 主管', dailyBrief: '定内容日历、审稿改稿、看阅读完成率，热点过了稿还没过审。', avatar: '/images/avatars/operator.png', departmentId: 'operation', personality: 'chill', lines: ['这篇阅读量不行，标题再改五个版本。', '品牌调性不对，这篇不能发。', '完读率只有 12%，开头要重写。'] },
  { id: 'op-3', name: '鸭鸭·搬物料咯', role: '活动运营实习生', tier: 'intern', tierLabel: '实习生', dailyBrief: '统计报名数据、盯社群消息、活动当天搬物料跑腿。', avatar: '/images/avatars/dev-backend.png', departmentId: 'operation', personality: 'energetic', lines: ['报名表导出好了，共 847 人。', '社群有人问奖品什么时候发。', '现场物料清单我核对了两遍。'] },
  { id: 'op-4', name: '猩·漏斗对不齐', role: '运营数据分析师', tier: 'senior', tierLabel: '高级 / 主管', dailyBrief: '拆活动转化漏斗、算渠道归因、用数据证明活动没白做。', avatar: '/images/avatars/monkey-design.png', departmentId: 'operation', personality: 'sneaky', lines: ['ROI 算出来了，投放线建议暂停。', '归因模型和上次口径不一致，先对齐。', '自然流量涨了，付费掉了，整体持平。'] },

  // ===== 商业化部 =====
  { id: 'sales-1', name: '狮子·再飞一趟', role: '大客户经理', tier: 'senior', tierLabel: '高级 / 主管', dailyBrief: '拜访客户、改方案、谈价格条款，合同在法务和客户之间来回第五版。', avatar: '/images/avatars/sales.png', departmentId: 'commercial', personality: 'sneaky', lines: ['客户要定制，报价单今晚发。', '竞品降价了，我们得加服务包。', '回款周期谈不下来，我再飞一趟。'] },
  { id: 'sales-2', name: '猪猪·月底缺40W', role: '商务拓展专员', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '陌拜线索、录 CRM、跟演示 PPT，月底冲业绩电话打到嗓子哑。', avatar: '/images/avatars/pig-commercial.png', departmentId: 'commercial', personality: 'energetic', lines: ['这条线索意向不错，约了下周 demo。', '客户要返点，我得请示总监。', '季度指标还差 40 万，得加渠道。'] },
  { id: 'sales-3', name: '狐狸·像刷量了', role: '渠道运营总监', tier: 'director', tierLabel: '总监', dailyBrief: '谈渠道合作、定分成模型、看 Pipeline 预测，月底盯回款率。', avatar: '/images/avatars/data.png', departmentId: 'commercial', personality: 'sneaky', lines: ['渠道数据异常，得排查是不是刷量。', '新代理合同条款法务还在审。', '这块业务利润率太低，考虑收缩。'] },

  // ===== 设计部 =====
  { id: 'design-1', name: '喵喵·间距不对', role: 'UI 设计师', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '出高保真稿、标注切图、走查还原度，第 8 版修改意见刚进来。', avatar: '/images/avatars/designer.png', departmentId: 'design', personality: 'strict', lines: ['间距没按规范来，研发再对一下。', '这版主色和品牌色冲突了。', '动效规格我写进交付文档了。'] },
  { id: 'design-2', name: '兔兔·按钮放这？', role: 'UX 设计师', tier: 'senior', tierLabel: '高级 / 主管', dailyBrief: '画用户旅程、做可用性测试、写交互说明，推动「这个按钮不该在这」。', avatar: '/images/avatars/designer.png', departmentId: 'design', personality: 'chill', lines: ['用户测试发现 3 个阻断性问题。', '这个流程步骤可以砍掉两步。', '调研报告周五前出，先别开发。'] },
  { id: 'design-3', name: '猩·五彩斑斓黑', role: '视觉设计实习生', tier: 'intern', tierLabel: '实习生', dailyBrief: '找参考图、修素材、导出多倍图，图层命名被导师打回重来。', avatar: '/images/avatars/monkey-design.png', departmentId: 'design', personality: 'energetic', lines: ['Banner 五套尺寸都导出了。', '参考库我按风格分类好了。', '导师说创意方向得再发散一下——老板要那种亮但不刺眼的黑。'] },
  { id: 'design-4', name: '树懒·别第9版', role: '设计总监', tier: 'director', tierLabel: '总监', dailyBrief: '定视觉规范、排设计资源、参加产品早期评审，保护团队不改第 9 版。', avatar: '/images/avatars/pm-sleepy.png', departmentId: 'design', personality: 'tired', lines: ['设计规范 v2 发布了，全员对齐。', '这个需求设计周期只有三天，排不了。', '品牌升级方案下季度启动。'] },

  // ===== HR =====
  { id: 'hr-1', name: '猫头·绩效季到了', role: 'HRBP', tier: 'senior', tierLabel: '高级 / 主管', dailyBrief: '对接业务部门做人才盘点、绩效面谈、处理员工关系个案。', avatar: '/images/avatars/hr.png', departmentId: 'hr', personality: 'strict', lines: ['绩效季开始了，面谈时间表发你了。', '这个 HC 冻结了，招聘先 pause。', '劳动仲裁材料我今晚整理。'] },
  { id: 'hr-2', name: '鹦·200份简历', role: '招聘专员', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '筛简历、约面试、发 offer、催入职，岗位开了三个月还没关。', avatar: '/images/avatars/parrot-hr.png', departmentId: 'hr', personality: 'energetic', lines: ['这个岗位收到 200 份简历了。', '候选人要谈薪，上限我得确认。', '背调有问题，offer 先 hold。'] },
  { id: 'hr-3', name: '鳄·名单已签', role: '人力资源总监', tier: 'director', tierLabel: '总监', dailyBrief: '制定编制规划、设计薪酬体系、处理组织调整和敏感人事决策。', avatar: '/images/avatars/legal.png', departmentId: 'hr', personality: 'sneaky', lines: ['组织优化方案老板签了，下周宣贯。', 'N+1 预算批了，按名单执行。', '敬业协议模板法务更新过了。'] },

  // ===== 财务部 =====
  { id: 'finance-1', name: '仓鼠·抬头错了', role: '财务专员', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '审报销、记账、对账、回「这张发票不合规」的飞书。', avatar: '/images/avatars/finance.png', departmentId: 'finance', personality: 'strict', lines: ['这笔费用超预算了，补说明。', '发票抬头错了，重开。', '月度结账这周别催我付款。'] },
  { id: 'finance-2', name: '企鹅·差一分钱', role: '内审经理', tier: 'senior', tierLabel: '高级 / 主管', dailyBrief: '做内控抽查、写审计报告、跟进整改，数字差一分都要查到底。', avatar: '/images/avatars/penguin-finance.png', departmentId: 'finance', personality: 'strict', lines: ['这笔关联交易需要补充披露。', '存货盘点差异，业务部门来解释。', '内控缺陷报告本周五董事会前出。'] },
  { id: 'finance-3', name: '鳄·税局来函', role: '税务总监', tier: 'director', tierLabel: '总监', dailyBrief: '申报纳税、税务筹划、应对稽查，合规和节税之间找平衡。', avatar: '/images/avatars/legal.png', departmentId: 'finance', personality: 'sneaky', lines: ['增值税申报截止周五。', '这项政策适用有争议，我问外所。', '税务稽查通知到了，材料准备中。'] },

  // ===== 法务部 =====
  { id: 'legal-1', name: '鳄·这个不行哈', role: '法务专员', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '审合同条款、出法律意见、回复业务咨询，「这个不行」是高频句。', avatar: '/images/avatars/legal.png', departmentId: 'legal', personality: 'strict', lines: ['责任条款风险太高，建议修改。', '知识产权归属要写清楚。', '这个商业模式合规性存疑。'] },
  { id: 'legal-2', name: '企鹅·新规更新了', role: '合规总监', tier: 'director', tierLabel: '总监', dailyBrief: '建合规体系、处理监管报送、主导数据隐私与反垄断评估。', avatar: '/images/avatars/penguin-finance.png', departmentId: 'legal', personality: 'strict', lines: ['隐私政策要按新规更新。', '这项业务需要合规评估报告。', '监管问询函周五前回复。'] },

  // ===== 管理层 =====
  { id: 'ceo-1', name: '棕熊·我拍板了', role: 'CEO / 创始人', tier: 'executive', tierLabel: '负责人 / VP', dailyBrief: '开战略会、见投资人、批预算、在三条路里选最贵的那条。', avatar: '/images/avatars/ceo.png', departmentId: 'management', personality: 'sneaky', lines: ['下个季度 All in 这条赛道。', '现金流还能撑多久？财务今晚报数。', '这个方向我拍板了，全力执行。'] },
  { id: 'ceo-2', name: '老虎·差15个点', role: '事业群总裁', tier: 'executive', tierLabel: '负责人 / VP', dailyBrief: '对事业部 P&L 负责，周会盯指标，月度向董事会汇报。', avatar: '/images/avatars/tiger-boss.png', departmentId: 'management', personality: 'strict', lines: ['营收目标差 15%，各条线出方案。', '人效比太低，组织要优化。', '竞品动作很大，我们不能慢。'] },
  { id: 'ceo-3', name: '熊猫·你们领会', role: '副总裁', tier: 'executive', tierLabel: '负责人 / VP', dailyBrief: '协调多条线资源、参加决策会、上传下达，擅长把压力翻译成「再想想」。', avatar: '/images/avatars/pm-sleepy.png', departmentId: 'management', personality: 'chill', lines: ['老板意思我传达了，你们领会一下。', '这个争议你们先对齐，别上报。', '战略方向没问题，执行灵活一点。'] },

  // ===== 支持部 =====
  { id: 'support-1', name: '羊驼·90秒回', role: '客服专员', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '爆款笔记后咨询量暴涨，SLA 要求 90 秒内响应；「为什么我发的看不到」一天能遇二十遍。', avatar: '/images/avatars/support.png', departmentId: 'support', personality: 'chill', lines: ['工单已升级技术，预计 2 小时内有回复。', '理解您着急，我这边帮您查审核状态。', '专业问题我得转产品确认，不能乱答——不然客诉算我的。'] },
  { id: 'support-2', name: '考拉·打印机又坏', role: '行政专员', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '订会议室、采购物资、修打印机、办入职手续，后勤琐事从不缺席。', avatar: '/images/avatars/koala-support.png', departmentId: 'support', personality: 'tired', lines: ['会议室冲突了，我帮你协调隔壁。', '办公用品库存低了，采购单已提。', '访客系统更新了，登记流程变了。'] },
  { id: 'support-3', name: '鸭鸭·47通/天', role: '客服实习生', tier: 'intern', tierLabel: '实习生', dailyBrief: '接基础咨询、记工单、按话术回复，复杂 case 转给带教老师。', avatar: '/images/avatars/dev-backend.png', departmentId: 'support', personality: 'energetic', lines: ['用户问退款进度，我查了订单。', '话术库新增了三条常见问题。', '今天接了 47 通电话，手酸。'] },

  // ===== 数据部 =====
  { id: 'data-1', name: '狐狸·口径是啥', role: '数据分析师', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '上午写 SQL 取数，下午开会对齐口径；新业务 80% 时间在搭看板，稳定后才做得起专题分析。', avatar: '/images/avatars/data.png', departmentId: 'data', personality: 'chill', lines: ['埋点缺了关键字段，得让研发补采集。', '口径和上次不一致，先对齐定义再出数。', '分析结论写了，业务愿不愿意改是另一回事。'] },
  { id: 'data-2', name: '猩·线下涨了线上掉', role: '算法工程师', tier: 'senior', tierLabel: '高级 / 主管', dailyBrief: '训模型、做 A/B、调特征，过拟合了上线，不过拟合了老板不满意。', avatar: '/images/avatars/monkey-design.png', departmentId: 'data', personality: 'energetic', lines: ['模型离线指标涨了，线上还没验。', '特征工程这轮加了 12 个维度。', '推荐结果多样性不够，再调参。'] },
  { id: 'data-3', name: '鹦·ETL 卡住了', role: 'BI 工程师', tier: 'associate', tierLabel: '专员 +1', dailyBrief: '建看板、维护数据仓库、响应「能不能加个字段」的第 N 次请求。', avatar: '/images/avatars/parrot-hr.png', departmentId: 'data', personality: 'tired', lines: ['看板刷新延迟，我在查 ETL。', '口径和上次不一致，先对齐定义。', '这个报表需求排下周了。'] },
];

export const npcs: NPC[] = rawNpcs.map((n) => ({
  ...n,
  avatar: getPartyAvatar(n.id, n.departmentId),
}));
