import type { WorkMoment } from '../workMomentTypes';

/** 除产品外 10 个部门的沉浸式「干一天」 */
export const workMomentsOthers: Record<string, WorkMoment> = {
  tech: {
    deptId: 'tech',
    title: '技术部',
    when: '完整一天 · 后端开发',
    role: '后端工程师（专员 +1）',
    oneLiner: '开发是把产品写的「要做什么」变成真正能点的 App/网站的人——日常是写代码、对接口、修 Bug，线上出事要半夜爬起来。',
    dayFlow: [
      { time: '10:00', title: '站会', desc: '说昨天干了啥、今天干啥、卡在哪' },
      { time: '11:00', title: '写代码', desc: '按需求单开发功能' },
      { time: '15:00', title: '联调', desc: '跟前端/测试对字段、对流程' },
      { time: '17:00', title: 'Code Review', desc: '同事检查你的代码' },
      { time: '21:00', title: 'oncall', desc: '线上告警，可能要救火' },
    ],
    mightLike: ['解决具体问题的成就感', '逻辑清晰、坐得住', '愿意持续学新东西'],
    mightStruggle: ['讨厌需求变来变去', '完全不想碰线上故障', '只爱想法不爱细节'],
    steps: [
      {
        phase: '① 站会',
        phaseTip: '敏捷团队每天短会同步进度——别迟到，别讲太久。',
        jargon: [
          { term: '站会', plain: 'Daily Standup，站着开的小会，每人 1 分钟：昨天/今天/阻塞。' },
          { term: '迭代', plain: '一个开发周期，常见 1～2 周，到期要交付一批功能。' },
          { term: '需求单 / Story', plain: 'Jira/飞书上的任务卡，写清要做啥。' },
        ],
        pings: [
          { from: '柯基策划', text: '推送人群包接口今天能联调吗' },
          { from: '你', text: '昨天修完登录 Bug，今天做人群包，卡在等数据字段' },
        ],
        choices: [
          {
            label: '把 block 说清楚',
            youSay: '字段定不下来我做不了 麻烦产品 @ 数据',
            reply: { from: '柯基策划', text: '我去催' },
            thought: '会喊 block 的开发，不会被 silently 憋死。',
            teach: 'block = 被卡住。站会要说 block，否则 PM 以为你在摸鱼。',
            next: 1,
          },
          {
            label: '只说「在写了」',
            youSay: '在推进',
            reply: { from: '树懒全栈', text: '推进到哪了哥' },
            thought: '「在写了」是梗，也是危险信号。',
            teach: '开发沟通要具体：完成百分之几、差什么输入。',
            next: 1,
          },
        ],
      },
      {
        phase: '② 写代码 & 联调',
        phaseTip: '联调 = 前后端一起跑通一条链路，字段对不上是常态。',
        jargon: [
          { term: '接口 / API', plain: '前后端约定的「数据格式」——像插座和插头，对不上就报错。' },
          { term: '联调', plain: '一起调试，看请求和返回对不对。' },
          { term: '字段', plain: 'JSON 里的 key，比如 userId、title。' },
        ],
        pings: [
          { from: '哈士奇前端', text: '你这返回少个 pushTitle 我页面空白了' },
          { from: '你', text: '文档没写啊……我补' },
        ],
        choices: [
          {
            label: '更文档并修接口',
            youSay: '我补字段+更新 Swagger 十分钟后你再拉',
            reply: { from: '哈士奇前端', text: 'OK' },
            thought: '联调扯皮少靠文档多靠沟通。你选对了。',
            teach: 'Swagger/接口文档 = 前后端契约。改了代码要更文档，不然下次还吵。',
            next: 2,
          },
          {
            label: '说是前端传错',
            youSay: '你参数传错了吧',
            reply: { from: '哈士奇前端', text: '截图甩你脸上了' },
            thought: '先查自己再甩锅，是职业素养。',
            teach: '联调黄金法则：先看日志，再开口。',
            next: 2,
          },
        ],
      },
      {
        phase: '③ Code Review',
        phaseTip: 'CR = 同事读你的代码，挑 bug、规范、设计问题。被提意见是正常的。',
        jargon: [
          { term: 'CR / Code Review', plain: '代码评审，合并进主分支前必过。' },
          { term: 'PR / Merge Request', plain: '合并请求，把你的分支合进主代码。' },
          { term: '主分支', plain: '线上代码来源，不能随便乱合。' },
        ],
        pings: [
          { from: '树懒全栈', text: 'PR 看了：这里没判空 并发下会炸 改一下' },
        ],
        choices: [
          {
            label: '改完再请看',
            youSay: '收到 我加校验 改完 @ 你',
            reply: { from: '树懒全栈', text: '嗯' },
            thought: 'CR 不是针对你人，是针对代码质量。',
            teach: '新手 CR 常改：空指针、异常处理、命名、重复代码。虚心改成长快。',
            next: 3,
          },
          {
            label: '觉得小题大做',
            youSay: '能跑就行吧……',
            reply: { from: '树懒全栈', text: '线上炸了算谁的' },
            thought: '「能跑」和「能扛流量」差很远。',
            teach: '生产环境 = 真实用户用的环境。小 bug × 大流量 = 大事故。',
            next: 3,
          },
        ],
      },
      {
        phase: '④ 测试 & 上线',
        phaseTip: '测试验收通过才能发版。上线有窗口，回滚是保命技能。',
        jargon: [
          { term: '提测', plain: '开发说「做好了」，交给测试测。' },
          { term: 'P0 Bug', plain: '最高优先级缺陷，不修不能上线。' },
          { term: '上线 / 发版', plain: '把新代码部署到生产环境。' },
        ],
        pings: [
          { from: '啄木鸟测试', text: '提了 3 个 Bug 其中 1 个 P0：空人群包会 500' },
          { from: '海狸运维', text: '今晚 22:00-24:00 变更窗口' },
        ],
        choices: [
          {
            label: '先修 P0 再提测',
            youSay: 'P0 我 1 小时修完 再给你回归',
            reply: { from: '啄木鸟测试', text: '行 别偷偷上线' },
            thought: '跟测试关系好，上线才顺。',
            teach: '回归测试 = 改完后再测一遍旧功能，防「修 A 坏 B」。',
            next: 4,
          },
          {
            label: '求先上再修',
            youSay: '业务急 先上这个小问题后面修',
            reply: { from: '啄木鸟测试', text: '我不签字' },
            thought: '测试不签字，运维不敢发。规则护所有人。',
            teach: '上线流程：开发自测 → 测试验收 → 运维发布。跳步风险你背。',
            next: 4,
          },
        ],
      },
      {
        phase: '⑤ oncall 救火',
        phaseTip: '线上挂了，oncall 工程师要响应。回滚往往比热修快。',
        jargon: [
          { term: 'oncall', plain: '轮值待命，告警来了要处理。' },
          { term: '502 / 500', plain: 'HTTP 错误码，用户看到「服务器错误」。' },
          { term: '回滚', plain: '恢复到上一个稳定版本。' },
        ],
        pings: [
          { from: 'PagerDuty', text: '🔴 生产 502' },
          { from: '柯基策划', text: '用户在骂了！！' },
        ],
        choices: [
          {
            label: '先回滚',
            youSay: '我先回滚 稳住了再查日志',
            reply: { from: '海狸运维', text: '窗口开了 搞' },
            thought: '先止血再手术。这是标准操作。',
            teach: '热修 = 线上直接改。风险高，除非回滚不行才用。',
          },
          {
            label: '线上改一行',
            youSay: '我怀疑缓存 key 改一行就好',
            reply: { from: '海狸运维', text: '别 回滚' },
            thought: '听运维的。他们见过太多「改一行」变灾难。',
            teach: '事故复盘要写：根因、影响、怎么防再犯。开发也要参与。',
          },
        ],
        endTag: '开发的一天：站会 → 写代码 → 联调 → CR → 测试 → 可能 oncall。写代码时间大概一半，剩下是沟通和救火。',
      },
    ],
    summary: {
      processRecap: '开发主线：领任务 → 实现接口/逻辑 → 联调对字段 → CR 改质量 → 测试通过 → 运维上线。线上故障 oncall 回滚。你不是「写代码的机器」，还要写文档、估时、沟通 block。',
      keyJargon: [
        { term: '站会 / 迭代 / Story', plain: '每日同步；开发周期；任务卡' },
        { term: '接口 / 联调 / 字段', plain: '前后端数据约定' },
        { term: 'CR / PR', plain: '代码评审与合并' },
        { term: '提测 / P0 / 回归', plain: '交给测试；最高优 Bug；再测一遍' },
        { term: '上线 / 回滚 / oncall', plain: '发版；版本恢复；值班救火' },
      ],
      selfCheck: ['逻辑题/细节错漏你能忍吗？', '需求一周改四次，你会崩吗？', '愿意晚上被叫起来修 Bug 吗？'],
      verdictHint: '喜欢「做出来能跑」、逻辑强、能抗压，适合开发。若讨厌变更、讨厌沟通，可先试测试或数据（离代码近但不同节奏）。',
    },
  },

  operation: {
    deptId: 'operation',
    title: '运营部',
    when: '完整一天 · 内容运营',
    role: '内容运营专员',
    oneLiner: '运营是「让用户来、留下来、动起来」——写文案、做活动、看数据，经常一个人扛多条线。',
    dayFlow: [
      { time: '09:30', title: '看数据', desc: '阅读、转化、竞品咋样' },
      { time: '11:00', title: '出方案', desc: '写什么、啥调性、投不投流' },
      { time: '14:00', title: '改稿扯皮', desc: '品牌、电商、老板各要各的' },
      { time: '16:00', title: '发布盯评', desc: '发出去了，评论区也要管' },
      { time: '17:30', title: '复盘', desc: '数据好不好，下周咋改' },
    ],
    mightLike: ['对热点、文案敏感', '能抗压、多头对接', '看到数据涨跌有感觉'],
    mightStruggle: ['只想写自己喜欢的', '极度社恐不想对接', '受不了「再改一版」'],
    steps: [
      {
        phase: '① 看数据 & 竞品',
        phaseTip: '运营不是凭感觉发内容——先看昨天那条咋样，再看别人咋做的。',
        jargon: [
          { term: '阅读/曝光', plain: '多少人看到了你的笔记/帖子。' },
          { term: '转化', plain: '看到之后有没有点击、购买、注册——各公司定义不同。' },
          { term: '种草', plain: '让用户「想买/想试」，不一定当场下单。' },
        ],
        pings: [
          { from: '数据群', text: '昨日笔记阅读 1.2w，点击率 3.1%，低于均值' },
          { from: '你老板', text: '竞品那条 10w+ 了 咱们呢' },
        ],
        choices: [
          {
            label: '拆标题和封面',
            youSay: '我对比前三条爆款 拆标题结构和封面差异 下午出结论',
            reply: { from: '你老板', text: '行' },
            thought: '运营分析从「像谁、差在哪」开始。',
            teach: '竞品分析不是抄，是找可复制的「结构」：开头、痛点、CTA。',
            next: 1,
          },
          {
            label: '说是运气',
            youSay: '算法吧 随缘',
            reply: { from: '你老板', text: '那要你干啥' },
            thought: '「算法」不能当万能借口。',
            teach: '平台有推荐机制，但内容结构、发布时间、标签你都能控一部分。',
            next: 1,
          },
        ],
      },
      {
        phase: '② 出方案',
        phaseTip: '方案要写清：目标、人群、内容形式、预算、怎么验收。',
        jargon: [
          { term: 'KPI', plain: '考核指标，比如阅读量、涨粉、GMV。' },
          { term: '调性', plain: '品牌气质——高级/可爱/专业，不能乱。' },
          { term: 'AB 测试', plain: '两版内容比哪个好。' },
        ],
        pings: [
          { from: '品牌 Lisa', text: '别太硬广 要软种草' },
          { from: '电商大刘', text: '要带链接 要 GMV' },
        ],
        choices: [
          {
            label: '两版 AB',
            youSay: '我出 A 软种草 B 强转化 跑数据选',
            reply: { from: '你老板', text: '聪明' },
            thought: 'AB 是运营避免内耗的利器。',
            teach: 'GMV = 成交总额。种草常在站外成交，要提前跟老板对齐「算谁的业绩」。',
            next: 2,
          },
          {
            label: '只站一边',
            youSay: '我只做品牌向',
            reply: { from: '电商大刘', text: '那你跟老板解释 GMV' },
            thought: '偏科可以，但要知后果。',
            teach: '运营常夹在品牌（声量）和电商（卖货）之间——这是岗位常态。',
            next: 2,
          },
        ],
      },
      {
        phase: '③ 改稿 & 对接',
        phaseTip: '一条内容可能过：运营自己 → 主管 → 品牌 → 法务（若有）。',
        jargon: [
          { term: 'ROI', plain: '投入产出比，投 1 块赚几块。' },
          { term: '投放 / 投流', plain: '花钱买曝光，不是每条内容都能投。' },
          { term: 'CTA', plain: 'Call To Action，「点击购买」「私信领」这类引导。' },
        ],
        pings: [
          { from: '品牌 Lisa', text: '第三版还是太 sales 了' },
          { from: '你', text: '（改第四版）' },
        ],
        choices: [
          {
            label: '拿数据说话',
            youSay: '我加一版上次类似软文的转化数据 参考这个力度',
            reply: { from: '品牌 Lisa', text: '……那按这个来' },
            thought: '运营也要会「温和地刚」。',
            teach: '改稿不是无限妥协，用历史案例能省很多口水。',
            next: 3,
          },
          {
            label: '全听品牌的',
            youSay: '好好好都改',
            thought: '改到没转化，锅还是你的。要留沟通记录。',
            teach: '飞书/微信留痕：谁让改成啥样，复盘时有用。',
            next: 3,
          },
        ],
      },
      {
        phase: '④ 发布 & 复盘',
        phaseTip: '发出去了还没完——评论区、投流效果、站外转化都要跟。',
        jargon: [
          { term: '投流', plain: '给内容加预算买推荐。' },
          { term: '完读率', plain: '内容读完了的比例，视频尤其看这个。' },
          { term: '归因', plain: '这笔成交算谁拉的——运营常踩坑。' },
        ],
        pings: [
          { from: '数据群', text: '站内阅读 OK，天猫进店 +15%，GMV 在电商那边' },
          { from: '你老板', text: '下午汇报你怎么讲' },
        ],
        choices: [
          {
            label: '截图留证汇报',
            youSay: '我报站内+进店链路 转化在电商表 一起讲',
            reply: { from: '你老板', text: '专业' },
            thought: '会汇报的运营不容易背锅。',
            teach: '入职就问清：KPI 看站内还是全链路？写入 OKR 或邮件。',
          },
          {
            label: '只报阅读',
            youSay: '阅读不错就算成功',
            reply: { from: '你老板', text: '老板问 GMV 呢' },
            thought: '单一指标容易被问穿。',
            teach: '运营要会讲「我做了什么 → 影响了哪段链路」。',
          },
        ],
        endTag: '运营的一天：看数 → 策划 → 改稿 → 发布 → 复盘。创意重要，但更常是执行和扯皮。',
      },
    ],
    summary: {
      processRecap: '运营主线：数据诊断 → 方案（目标/KPI/形式）→ 跨部门改稿 → 发布盯评 → 复盘归因。小厂常一人全包：内容+投放+社群+店铺。',
      keyJargon: [
        { term: '种草 / 转化 / GMV', plain: '种草；下一步动作；成交总额' },
        { term: '调性 / KPI / ROI', plain: '品牌感；考核；投入产出' },
        { term: 'AB / 投流 / 归因', plain: '对比测试；买量；业绩算谁的' },
      ],
      selfCheck: ['能连续改五版稿子吗？', '品牌与电商打架时你能协调吗？', '数据不好时扛得住吗？'],
      verdictHint: '爱内容、爱热点、能扯皮能复盘，运营合适。若只想安静写作，可考虑编辑/文案岗（边界更窄）。',
    },
  },

  commercial: {
    deptId: 'commercial',
    title: '商业化',
    when: '完整一天 · 大客户经理',
    role: 'ToB 销售 / 客户经理',
    oneLiner: '销售是把公司产品「卖出去、签回来、钱收回来」——见客户、写方案、谈价格，月底看业绩。',
    dayFlow: [
      { time: '09:00', title: '盘 Pipeline', desc: '哪些客户在跟、差多少业绩' },
      { time: '11:00', title: '见客户 / demo', desc: '讲产品、答质疑' },
      { time: '15:00', title: '内部协调', desc: '法务、运营、研发能不能接' },
      { time: '19:00', title: '谈价格', desc: '折扣、返点、合同条款' },
      { time: '21:00', title: '录 CRM', desc: '跟进记录不能少' },
    ],
    mightLike: ['跟人打交道 energize 你', '目标感强、抗拒绝', '能喝酒也能写 PPT'],
    mightStruggle: ['社恐、怕被拒绝', '讨厌 KPI 和月底冲刺', '不想出差应酬'],
    steps: [
      {
        phase: '① 盘客户',
        phaseTip: '销售早上常看 CRM：谁该跟、谁快签、谁要凉了。',
        jargon: [
          { term: 'Pipeline', plain: '潜在客户清单和阶段——线索/意向/报价/签约。' },
          { term: 'CRM', plain: '客户关系系统，记录谁跟进了啥。' },
          { term: 'KA', plain: 'Key Account，大客户，单量大、周期长。' },
        ],
        pings: [
          { from: '你老板', text: '季度还差 40 万 名单里谁最近能动' },
          { from: '你', text: '王总方案在审 李总比价中' },
        ],
        choices: [
          {
            label: '按阶段排优先级',
            youSay: '王总催合同 我下午 push 法务；李总约 demo 打差异',
            reply: { from: '你老板', text: '行' },
            thought: '销售不是瞎忙，是排优先级。',
            teach: '销售漏斗：线索越多顶端，越往下越少，要专注「快成交」的。',
            next: 1,
          },
          {
            label: '说都在跟',
            youSay: '都在跟放心',
            reply: { from: '你老板', text: '具体呢' },
            thought: '模糊回答在大客户销售里不加分。',
            teach: '好销售能说出：每个客户卡在哪、下一步啥、预计何时签。',
            next: 1,
          },
        ],
      },
      {
        phase: '② 客户会议',
        phaseTip: 'demo = 演示产品。客户问的不只是功能，还有「比竞品好在哪」。',
        jargon: [
          { term: 'demo', plain: '产品演示，现场或线上。' },
          { term: '聚光 / 蒲公英', plain: '小红书广告/达人产品名，销售要会讲。' },
          { term: '方案', plain: '针对客户的投放/合作计划，常要定制。' },
        ],
        pings: [
          { from: '客户王总', text: '竞品报价低一半 你们优势在哪' },
        ],
        choices: [
          {
            label: '讲差异+案例',
            youSay: '价不是唯一 我们达人质量+复盘服务 发您同行业 case',
            reply: { from: '客户王总', text: '发来看看' },
            thought: 'ToB 销售卖「信任+解决方案」，不只会降价。',
            teach: 'case = 成功案例。准备 3 个同行业故事，比参数表管用。',
            next: 2,
          },
          {
            label: '直接申请折扣',
            youSay: '我回去申请折扣',
            reply: { from: '狮子销售', text: '别乱承诺！！' },
            thought: '折扣是筹码，不是第一反应。',
            teach: '先价值后价格。折扣要换条件：签长约、预付、案例授权等。',
            next: 2,
          },
        ],
      },
      {
        phase: '③ 内部协调',
        phaseTip: '客户要的，公司不一定能接——销售要在客户和内部之间传话、砍价。',
        jargon: [
          { term: '返点', plain: '给客户的利润返还，行业常见，要审批。' },
          { term: '定制', plain: '非标需求，研发/运营可能不接。' },
          { term: '合同', plain: '法务审，周期常比你想的长。' },
        ],
        pings: [
          { from: '客户王总', text: '合同今晚能签吗' },
          { from: '鳄鱼法务', text: '第七条不行 改完再说' },
        ],
        choices: [
          {
            label: '管理客户预期',
            youSay: '王总条款在走法务 明早给您定稿 今晚先确认商务条款',
            reply: { from: '客户王总', text: '行' },
            thought: '销售要会「拖得有技巧」——给明确下一步。',
            teach: 'Never say「不行」，说「正在办，X 点给您」。',
            next: 3,
          },
          {
            label: '催法务',
            youSay: '@法务 客户等着！！！',
            reply: { from: '鳄鱼法务', text: '催没用 条款有问题' },
            thought: '跟内部同事也讲关系和流程。',
            teach: '法务是帮你避坑的。提前送审比今晚催有用。',
            next: 3,
          },
        ],
      },
      {
        phase: '④ 签约 & 复盘',
        phaseTip: '签完不是结束——回款、续约、客诉都还可能找你。',
        jargon: [
          { term: '回款', plain: '客户把钱打过来，销售常背这个 KPI。' },
          { term: '客单价', plain: '一单平均多少钱。' },
          { term: '续约', plain: '老客户第二年还签不签。' },
        ],
        pings: [
          { from: '客户王总', text: '合同签了 首款下周' },
          { from: '你老板', text: '不错 李总那边呢' },
        ],
        choices: [
          {
            label: '更新 CRM 并攻下一单',
            youSay: '王总已签 录入 CRM；李总明天二访',
            thought: '签一单喘口气，Pipeline 里还有下一单。',
            teach: '销售是连续战。庆祝 5 分钟，然后看下一个。',
          },
          {
            label: '先庆祝',
            youSay: '终于签了！！',
            reply: { from: '你老板', text: '李总呢' },
            thought: '情绪可以理解，但老板看的是总数。',
            teach: '大单值得高兴，但 Pipeline 不能断——「签完即饥荒」是销售大忌。',
          },
        ],
        endTag: '销售的一天：盘客户 → 见客户 → 协调内部 → 谈价签约 → 录 CRM。业绩压力真实，提成也真实。',
      },
    ],
    summary: {
      processRecap: 'ToB 销售：维护 Pipeline → 拜访/demo → 定制方案 → 协调法务运营 → 谈判签约 → 回款续约。核心是信任与解决问题，不是背产品参数。',
      keyJargon: [
        { term: 'Pipeline / CRM / KA', plain: '客户池；客户系统；大客户' },
        { term: 'demo / 方案 / case', plain: '演示；合作计划；成功案例' },
        { term: '返点 / 回款 / 续约', plain: '利润返还；收钱；续签' },
      ],
      selfCheck: ['被拒绝十次还能打第十一通电话吗？', '能同时哄客户和内部同事吗？', '月底 KPI 压顶扛得住吗？'],
      verdictHint: '外向、抗压、目标感强，销售能赚大钱也苦。若讨厌 KPI，可看售前/客户成功（签后服务，节奏不同）。',
    },
  },

  hr: {
    deptId: 'hr',
    title: '人力资源',
    when: '完整一天 · HR 专员',
    role: '招聘 HR 专员',
    oneLiner: 'HR 是「公司管人的那一摊」——招人、办入职、算考勤、搞绩效，夹在业务和员工中间。',
    dayFlow: [
      { time: '09:30', title: '筛简历', desc: '200 份里挑 10 份' },
      { time: '11:00', title: '约面试', desc: '协调候选人和业务时间' },
      { time: '14:00', title: '面试/谈薪', desc: '聊候选人，别乱承诺' },
      { time: '16:00', title: '办手续', desc: '入职、考勤、员工问政策' },
      { time: '17:30', title: '跟业务对齐', desc: 'HC、绩效、离职' },
    ],
    mightLike: ['喜欢跟人聊、帮别人解决问题', '细致、守规则', '对组织怎么运转好奇'],
    mightStruggle: ['讨厌做「坏人」传达裁员', '极社恐', '受不了重复事务'],
    steps: [
      {
        phase: '① 筛简历',
        phaseTip: '业务说「要资深的」，预算给「能招实习生的」——HR 第一天就要学会问清 HC。',
        jargon: [
          { term: 'HC', plain: 'Headcount，编制名额，招几个、什么级别。' },
          { term: 'JD', plain: 'Job Description，招聘岗位说明。' },
          { term: '漏斗', plain: '简历→面试→offer→入职，每层筛掉一批。' },
        ],
        pings: [
          { from: '业务老大', text: '这个岗很急 这周能到岗吗' },
          { from: '你', text: 'JD 发我最终版 薪资带宽多少' },
        ],
        choices: [
          {
            label: '先要清楚标准',
            youSay: '必须项和加分项列一下 别我筛完您说不对',
            reply: { from: '业务老大', text: '行 发你' },
            thought: 'HR 不是魔法——标准不清，筛再久也白搭。',
            teach: '好 JD：做什么、要什么、给多少、团队啥样。含糊 JD 招不到人。',
            next: 1,
          },
          {
            label: '先筛再说',
            youSay: '收到我看起来',
            thought: '返工概率 90%。',
            teach: '招聘第一课：跟 hiring manager 对齐，比刷招聘网站重要。',
            next: 1,
          },
        ],
      },
      {
        phase: '② 面试协调',
        phaseTip: '你要协调候选人、面试官、会议室——三方时间对齐是体力活。',
        jargon: [
          { term: '业务面', plain: '用人部门面试，看专业能力。' },
          { term: 'HR 面', plain: '看动机、薪资预期、稳定性。' },
          { term: '背调', plain: 'Background Check，核实学历、工作经历。' },
        ],
        pings: [
          { from: '候选人', text: '贵司加班多吗 我还有别家 offer' },
        ],
        choices: [
          {
            label: '诚实+亮点',
            youSay: '项目紧会忙 但有导师制度 您更关心哪块我帮您约对应面试官聊',
            reply: { from: '候选人', text: '行 先面' },
            thought: 'HR 话术：不撒谎，不全说满。',
            teach: 'offer = 录用通知。谈薪前要知道公司 bandwidth（薪资范围）。',
            next: 2,
          },
          {
            label: '画大饼',
            youSay: '从不加班 发展无限',
            reply: { from: '候选人', text: '（上网一搜）……' },
            thought: '候选人也会查 Glassdoor/小红书。诚实长久。',
            teach: '过度承诺 → 入职三个月离职，算 HR 招聘质量差。',
            next: 2,
          },
        ],
      },
      {
        phase: '③ 发 offer & 入职',
        phaseTip: 'offer 要审批：薪资、职级、期权等。入职要办：合同、账号、工位。',
        jargon: [
          { term: 'offer', plain: '录用通知书，含岗位、薪资、入职日。' },
          { term: '职级', plain: 'P5/M3 这类，影响薪资带宽。' },
          { term: 'onboarding', plain: '入职培训、领设备、办手续。' },
        ],
        pings: [
          { from: '系统', text: '候选人接受 offer 入职日下周一' },
          { from: 'IT', text: '账号要提单 提前两个工作日' },
        ],
        choices: [
          {
            label: '走 checklist',
            youSay: '我按 onboarding 清单今天提 IT、行政、主管确认',
            thought: '新人第一天电脑没账号，骂的是 HR。',
            teach: 'onboarding checklist 是 HR 专业度体现。新人体验从这里开始。',
          },
          {
            label: '到时候再说',
            youSay: '还早',
            thought: '周一新人站门口没工位，你懂的。',
            teach: '入职体验差 → 试用期离职率高 → 还是 HR 的 KPI。',
          },
        ],
        endTag: 'HR 的一天：筛人 → 协调面试 → offer/入职 → 员工事务。招不到人时压力在 HR，招错人压力也在。',
      },
    ],
    summary: {
      processRecap: '招聘 HR：对齐 HC/JD → 筛简历 → 安排面试 → 谈薪发 offer → onboarding。还有绩效、考勤、员工关系等模块，小 HR 全包。',
      keyJargon: [
        { term: 'HC / JD / 漏斗', plain: '编制；岗位说明；筛选流程' },
        { term: 'offer / 背调 / 职级', plain: '录用；背景调查；级别' },
        { term: 'onboarding', plain: '入职流程' },
      ],
      selfCheck: ['能一天聊八个候选人还不虚吗？', '业务催、候选人问，你能两边安抚吗？', '对细节（合同、日期）耐心吗？'],
      verdictHint: '爱与人沟通、细致、能扛夹心饼干压力，HR 可试。若只想战略不管事务，要到大厂分模块才行。',
    },
  },

  finance: {
    deptId: 'finance',
    title: '财务部',
    when: '完整一天 · 财务专员',
    role: '费用会计 / 财务专员',
    oneLiner: '财务是「公司钱的管家」——审报销、做账、控预算，对数字敏感，对规则更敏感。',
    dayFlow: [
      { time: '09:30', title: '审报销', desc: '发票、预算、合同对不对' },
      { time: '11:00', title: '对账', desc: '银行、业务、账簿一致吗' },
      { time: '14:00', title: '做报表', desc: '给老板看经营情况' },
      { time: '16:00', title: '答业务问', desc: '这钱能不能花' },
      { time: '17:30', title: '关账准备', desc: '月底尤其忙' },
    ],
    mightLike: ['数字对上了很爽', '规则清晰、流程明确', '细心不怕重复查'],
    mightStruggle: ['讨厌 Say no 得罪人', '受不了每月关账加班', '完全不想跟业务扯皮'],
    steps: [
      {
        phase: '① 审报销',
        phaseTip: '每张票要看：抬头、税号、金额、是否超预算、有没有合同。',
        jargon: [
          { term: '发票抬头', plain: '发票上的公司名，必须跟报销主体一致。' },
          { term: '预算', plain: '这部门今年能花多少钱，超了要特批。' },
          { term: '三单匹配', plain: '合同、发票、验收单金额一致——防舞弊。' },
        ],
        pings: [
          { from: '运营小张', text: '姐能先批吗 机票要出' },
          { from: '系统', text: '⚠️ 抬头与主体不一致' },
        ],
        choices: [
          {
            label: '退回并教',
            youSay: '抬头错了按模板重开 今天关账系统了明天批 不是卡你',
            reply: { from: '运营小张', text: '哦好' },
            thought: 'Say no 要带原因和路径，冲突小一半。',
            teach: '财务不是故意难为人——错票审计追责是财务背。',
            next: 1,
          },
          {
            label: '先批再说',
            youSay: '先给你批',
            thought: '审计查到，你写说明写到哭。',
            teach: '合规 > 人情。特批要走特批流，别私下通融。',
            next: 1,
          },
        ],
      },
      {
        phase: '② 关账 & 报表',
        phaseTip: '月底要把当月所有账结清，出利润表、现金流——晚一天老板就问。',
        jargon: [
          { term: '关账', plain: '月度结账，此后这月账不能随便改。' },
          { term: 'P&L', plain: 'Profit & Loss，利润表，赚没赚钱。' },
          { term: '现金流', plain: '钱进进出出，比利润更生死。' },
        ],
        pings: [
          { from: 'CFO', text: '这月费用超预算的部门列表今天出' },
        ],
        choices: [
          {
            label: '按规则出表',
            youSay: '超预算三家 附原因和合同编号 下午发',
            thought: '财务的价值是让老板看见真实现金。',
            teach: '利润好但现金流断，公司照样死。财务要会讲两者区别。',
          },
          {
            label: '帮业务圆',
            youSay: '我看看能不能调分类',
            reply: { from: 'CFO', text: '别调 是什么就是什么' },
            thought: '做账不是做漂亮，是做真。',
            teach: 'IPO/融资时财务历史会被翻个底朝天。规矩从今天养成。',
          },
        ],
        endTag: '财务的一天：审票 → 对账 → 报表 → 答「能不能报」。Say no 是日常，不是恶意。',
      },
    ],
    summary: {
      processRecap: '财务专员主线：费用审核 → 账务处理 → 对账 → 报表 → 关账。业财融合时还要帮业务看懂数字。',
      keyJargon: [
        { term: '发票抬头 / 预算 / 三单匹配', plain: '开票名；花钱额度；合同票验收一致' },
        { term: '关账 / P&L / 现金流', plain: '月结；利润表；钱进出' },
      ],
      selfCheck: ['差一分钱对不上能接受吗？', '能礼貌拒绝不合规报销吗？', '月底加班 OK 吗？'],
      verdictHint: '细心、守规则、对数字不犯困，财务稳。若只想分析不想审票，目标财务 BP/分析岗（路不同）。',
    },
  },

  legal: {
    deptId: 'legal',
    title: '法务部',
    when: '完整一天 · 法务专员',
    role: '法务专员',
    oneLiner: '法务是「公司合同的守门员」——审条款、防风险，经常要对业务说「这不行」。',
    dayFlow: [
      { time: '10:00', title: '审合同', desc: '销售、采购送来的 PDF' },
      { time: '13:00', title: '答咨询', desc: '这活动合规吗' },
      { time: '15:00', title: '改条款', desc: '跟对方律师扯' },
      { time: '17:00', title: '存档案', desc: '版本、审批留痕' },
    ],
    mightLike: ['爱抠细节、逻辑严密', '能顶住压力说 No', '对规则/权利义务感兴趣'],
    mightStruggle: ['讨厌被催「今晚就要签」', '不想当「扫兴的人」', '文科学霸但怕撕逼'],
    steps: [
      {
        phase: '① 审合同',
        phaseTip: '重点看：责任谁担、知识产权归谁、数据怎么用、争议在哪仲裁。',
        jargon: [
          { term: '违约责任', plain: '做不到赔多少、怎么赔。' },
          { term: '知识产权', plain: '成果归谁，尤其定制开发。' },
          { term: '管辖', plain: '打官司去哪个法院/仲裁。' },
        ],
        pings: [
          { from: '狮子销售', text: '客户今晚要签！！合同能过吗' },
          { from: '你', text: '（看第 14 条）' },
        ],
        choices: [
          {
            label: '标红必改',
            youSay: '第七条无限责任不行 我标红改法 改完今晚可出',
            reply: { from: '狮子销售', text: '客户不一定同意' },
            thought: '法务价值在「拦下会炸的条款」。',
            teach: '不是找茬，是分配风险。无限责任=公司可能赔光。',
            next: 1,
          },
          {
            label: '风险确认书',
            youSay: '这版我拦不住 业务负责人签风险确认书我留档',
            reply: { from: '狮子销售', text: '……行' },
            thought: '业务坚持干，你要留证据保护自己。',
            teach: 'risk acceptance = 业务签字认账，法务已告知。',
            next: 1,
          },
        ],
      },
      {
        phase: '② 合规咨询',
        phaseTip: '活动、文案、数据收集都可能踩广告法、隐私法。',
        jargon: [
          { term: '合规', plain: '符合法律法规和公司政策。' },
          { term: '隐私政策', plain: '告诉用户数据怎么收集使用。' },
          { term: '广告法', plain: '不能绝对化用语如「第一」「最好」乱用。' },
        ],
        pings: [
          { from: '运营', text: '文案写「行业第一」可以吗' },
        ],
        choices: [
          {
            label: '给改法',
            youSay: '第一不行 换「深受用户喜爱」类表述 证据留存',
            thought: '法务也要给方案，不是只会说不行。',
            teach: '合规审查要赶在活动上线前，临上线才找法务必吵架。',
          },
          {
            label: '只说不行',
            youSay: '不行',
            reply: { from: '运营', text: '那写啥？？' },
            thought: '只说 No 会被绕开。要教替代写法。',
            teach: '好法务 = 风险可控 + 业务能跑。',
          },
        ],
        endTag: '法务的一天：审合同、答咨询、改条款、存档。慢，往往是因为责任大。',
      },
    ],
    summary: {
      processRecap: '法务主线：合同审查 → 合规咨询 → 争议处理 → 档案留痕。要懂一点业务，否则会被架空。',
      keyJargon: [
        { term: '违约责任 / 知识产权 / 管辖', plain: '赔责；归属；争议解决地' },
        { term: '合规 / 隐私 / 广告法', plain: '合法；用户数据；宣传用语' },
        { term: '风险确认书', plain: '业务坚持时的留档' },
      ],
      selfCheck: ['能耐心抠 PDF 吗？', '被催签时能坚持原则吗？', '对法条/案例查得下去吗？'],
      verdictHint: '严谨、抗压、爱抠细节，法务合适。需法学背景或司考/法硕路径，入行前查清楚。',
    },
  },

  management: {
    deptId: 'management',
    title: '管理层',
    when: '完整一天 · 事业部负责人',
    role: '事业部总经理',
    oneLiner: '管理层是「对一块业务的结果负责」——定目标、配人配钱、拍板、向上汇报、向下扛压。',
    dayFlow: [
      { time: '09:00', title: '战略会', desc: '公司要什么数字' },
      { time: '11:00', title: '拆 OKR', desc: '分到各团队' },
      { time: '14:00', title: '协调资源', desc: '抢 HC、抢预算' },
      { time: '16:00', title: '1:1', desc: '跟下属聊' },
      { time: '19:00', title: '向上汇报', desc: '给 CEO/董事会材料' },
    ],
    mightLike: ['大局观、做决策不 paralysis', '能扛 multi 方压力', '对商业结果有 ownership'],
    mightStruggle: ['不想对 P&L 负责', '讨厌政治和开会', '管人耐心不足'],
    steps: [
      {
        phase: '① 接目标',
        phaseTip: 'CEO 说的「翻倍」「降本」要翻译成团队能执行的 OKR。',
        jargon: [
          { term: 'OKR', plain: 'Objectives & Key Results，目标与关键结果，对齐用。' },
          { term: 'P&L', plain: 'Profit & Loss，这块业务赚没赚钱，你背。' },
          { term: '对齐', plain: '确保上下对「要什么」理解一致。' },
        ],
        pings: [
          { from: 'CEO', text: '这季度营收翻倍 成本减半 出方案' },
          { from: '财务', text: '（附缺口表）' },
        ],
        choices: [
          {
            label: '分阶段谈',
            youSay: '目标收到 建议分阶段 人力预算匹配再上',
            reply: { from: 'CEO', text: '先方案 资源后谈' },
            thought: '「资源后谈」= 你先扛。管理层常态。',
            teach: 'OKR 不是许愿，要可衡量。写不出 KR 的目标都是口号。',
            next: 1,
          },
          {
            label: '私下对齐再上会',
            youSay: '（私聊 CFO）数字咱先对齐？',
            thought: '会前通气减少当众翻车。',
            teach: '管理不是赌勇气，是赌信息充分。',
            next: 1,
          },
        ],
      },
      {
        phase: '② 协调与拍板',
        phaseTip: '产品、研发、运营抢资源——你要拍优先级，不可能全满足。',
        jargon: [
          { term: '资源', plain: '人、钱、时间——永远不够。' },
          { term: '优先级', plain: '先做什么后做什么，管理者核心工作。' },
          { term: '1:1', plain: '一对一沟通，管人必备。' },
        ],
        pings: [
          { from: '产品 VP', text: '不加人做不了' },
          { from: '研发总监', text: '需求太多做不完' },
        ],
        choices: [
          {
            label: '砍 scope 定优先级',
            youSay: '三条线只能保两条 第三条 Q2 资源表我下午发',
            thought: '管理就是选择。不敢砍，全员过劳还做不完。',
            teach: '说「都要」= 没人对你负责。清晰优先级是护身符。',
          },
          {
            label: '和稀泥',
            youSay: '大家加油',
            reply: { from: '研发总监', text: '……' },
            thought: '口号不能当资源。',
            teach: '员工尊重会做取舍的老板，不是只会打气的。',
          },
        ],
        endTag: '管理层的一天：开会、对齐、抢资源、拍板、背结果。累在脑子里，不是键盘上。',
      },
    ],
    summary: {
      processRecap: '管理者：接战略 → 拆 OKR → 配资源 → 盯执行 → 对 P&L 负责。不是「职位高了就轻松」，是责任换了形态。',
      keyJargon: [
        { term: 'OKR / KPI', plain: '目标体系；考核指标' },
        { term: 'P&L', plain: '盈亏责任' },
        { term: '对齐 / 优先级 / 1:1', plain: '共识；取舍；管人' },
      ],
      selfCheck: ['团队做不好你扛吗？', '能在信息不全时拍板吗？', '愿意大量开会协调吗？'],
      verdictHint: '管理岗通常从专业岗做起来，不是毕业第一条路。先在一个领域扎深，再考虑带团队。',
    },
  },

  support: {
    deptId: 'support',
    title: '支持部',
    when: '完整一天 · 客服专员',
    role: '在线客服',
    oneLiner: '客服是「用户找得到的人」——接电话/在线聊，解决问题、安抚情绪，常按 SLA 考核。',
    dayFlow: [
      { time: '09:00', title: '接班看队列', desc: '多少人在等' },
      { time: '10:00', title: '接工单', desc: '一条接一条' },
      { time: '14:00', title: '升级协调', desc: '找技术/运营' },
      { time: '17:00', title: '填记录', desc: '工单不能乱' },
    ],
    mightLike: ['帮到人会有成就感', '耐心、情绪稳定', '沟通清晰'],
    mightStruggle: ['被骂还不能还嘴', '重复问题问到吐', '夜班或高峰抗压'],
    steps: [
      {
        phase: '① 接首单',
        phaseTip: 'SLA 规定多久必须首响——超时扣绩效。',
        jargon: [
          { term: 'SLA', plain: 'Service Level Agreement，服务时效，如 90 秒内响应。' },
          { term: '工单', plain: 'Ticket，一条问题一个号，全程可追溯。' },
          { term: '首响', plain: '第一次回复用户的时间。' },
        ],
        pings: [
          { from: '用户A', text: '我笔记怎么不见了！！！' },
          { from: '系统', text: '⏱ 剩余 47 秒' },
        ],
        choices: [
          {
            label: '标准流程',
            youSay: '非常抱歉给您不好体验 我马上查审核状态 请稍等',
            reply: { from: '用户A', text: '快点' },
            thought: '话术是护甲，真心是加分。',
            teach: '先安抚再处理。用户急时听不进解释，先认情绪。',
            next: 1,
          },
          {
            label: '直接升级',
            youSay: '帮您升级专人 2 小时内回复',
            reply: { from: '用户A', text: '上次也这么说' },
            thought: '升级要真的跟，不然信任归零。',
            teach: '升级不是甩锅，是承诺更专人+更短时效。',
            next: 1,
          },
        ],
      },
      {
        phase: '② 查因 & 回复',
        phaseTip: '很多问题是审核限流、规则误解——你要查内部系统，不能瞎编。',
        jargon: [
          { term: '限流', plain: '内容还在，但推荐变少，用户以为「删了」。' },
          { term: '申诉', plain: '用户走流程请求复审。' },
          { term: '客诉', plain: '客户投诉，严重会升级管理层。' },
        ],
        pings: [
          { from: '内部群', text: '限流不是删 按话术解释+申诉链接' },
        ],
        choices: [
          {
            label: '解释+给路径',
            youSay: '查到了是展示受限 这是说明和申诉入口 我帮您备注加急',
            thought: '客服价值 = 把复杂规则翻译成人话。',
            teach: '背熟 TOP20 问题话术，但别像机器人——用户听得出来。',
          },
          {
            label: '模糊应付',
            youSay: '系统问题吧',
            reply: { from: '用户A', text: '你们到底专不专业' },
            thought: '糊弄会升级客诉，最后更麻烦。',
            teach: '说不确定时可以：「我确认后 X 点前回复您」。',
          },
        ],
        endTag: '客服的一天：接工单 → 查系统 → 协调内部 → 记录。嗓子、耐心、情绪都是消耗品。',
      },
    ],
    summary: {
      processRecap: '客服主线：队列接单 → 按 SLA 响应 → 查因/升级 → 闭环工单。是用户情绪的缓冲垫，也是产品问题的晴雨表。',
      keyJargon: [
        { term: 'SLA / 工单 / 首响', plain: '时效；问题单；首次回复' },
        { term: '限流 / 申诉 / 客诉', plain: '展示变少；复审；投诉' },
      ],
      selfCheck: ['被骂还能保持礼貌吗？', '重复问题百遍还不烦吗？', '能接受排班和 KPI 吗？'],
      verdictHint: '耐心、稳定、想先进互联网，客服是低门槛入口。可转运营/产品（需主动学，不是自动转）。',
    },
  },

  data: {
    deptId: 'data',
    title: '数据部',
    when: '完整一天 · 数据分析师',
    role: '数据分析师',
    oneLiner: '分析师用 SQL/工具从数据库里取数、做图、写结论——帮业务回答「发生了什么、为什么、咋办」。',
    dayFlow: [
      { time: '10:00', title: '接需求', desc: '产品/运营要个数' },
      { time: '11:00', title: '写 SQL 取数', desc: '口径对齐最耗时' },
      { time: '14:00', title: '做看板', desc: 'BI 工具可视化' },
      { time: '16:00', title: '汇报', desc: '讲人话，不是堆表' },
    ],
    mightLike: ['从数字里找规律', '逻辑清晰', '愿意学 SQL/工具'],
    mightStruggle: ['业务不听结论只想「要个数」', '口径反复改很烦', '完全不想碰代码'],
    steps: [
      {
        phase: '① 接需求',
        phaseTip: '先问：指标定义？时间范围？跟上次一样吗？——不问清楚必返工。',
        jargon: [
          { term: '口径', plain: '指标怎么算，如 DAU 算不算游客。' },
          { term: '埋点', plain: 'App 里埋代码上报用户行为，没埋就没数。' },
          { term: '需求单', plain: '谁要什么数、啥时候要、用来干啥。' },
        ],
        pings: [
          { from: '柯基策划', text: 'DAU 咋掉了 下午汇报要用' },
        ],
        choices: [
          {
            label: '先对齐口径',
            youSay: '跟上次周报同一口径吗 要不要拆新用户/老用户',
            reply: { from: '柯基策划', text: '跟上周一样 加拆 cohort' },
            thought: '多问一句，少返工一小时。',
            teach: 'cohort = 同一批用户随时间的变化，如「1 月 1 日注册用户次日留存」。',
            next: 1,
          },
          {
            label: '先跑数再说',
            youSay: '好我拉',
            thought: '跑完发现口径不对，重跑。',
            teach: '分析师时间贵在「问对问题」，不是「跑得快」。',
            next: 1,
          },
        ],
      },
      {
        phase: '② 取数 & 发现',
        phaseTip: 'SQL 从数仓查数据。埋点挂了、字段空，是日常。',
        jargon: [
          { term: 'SQL', plain: '查数据库的语言，分析师必备。' },
          { term: '数仓', plain: '存历史数据的地方，比业务库全。' },
          { term: 'BI / 看板', plain: '可视化报表，RedBI、Tableau 等。' },
        ],
        pings: [
          { from: '你', text: '……push_click 字段又是空的' },
          { from: '浣熊程序', text: '我查' },
        ],
        choices: [
          {
            label: 'partial 分析+说明',
            youSay: '埋点缺了 我先给 partial 结论 并列数据质量问题',
            reply: { from: '柯基策划', text: '行 别瞎编就行' },
            thought: '诚实比假 precision 强。',
            teach: '数据质量文档要写给业务看：缺啥、影响啥、啥时候修。',
            next: 2,
          },
          {
            label: '瞎估',
            youSay: '大概掉因为竞品吧',
            reply: { from: '你老板', text: '证据？' },
            thought: '没数别编。 credibility 一次用完。',
            teach: '分析师信誉 = 结论可复现。给 SQL 或截图。',
            next: 2,
          },
        ],
      },
      {
        phase: '③ 汇报',
        phaseTip: '老板要「直观」——一张总览 + 口头讲三层：结论、原因、建议。',
        jargon: [
          { term: '漏斗', plain: '步骤流失，如浏览→点击→购买。' },
          { term: '归因', plain: '为啥掉了，是渠道、产品还是季节。' },
          { term: 'A/B', plain: '对比实验看哪个方案好。' },
        ],
        pings: [
          { from: '你老板', text: '图直观点 老板看不懂' },
        ],
        choices: [
          {
            label: '一张总览+口述',
            youSay: '一张总览：结论 DAU 降 3% 主因推送点击 建议补埋点+改文案 A/B',
            thought: '删细节不是偷懒，是沟通分层。',
            teach: '汇报结构：结论先行 → 证据 → 建议 → 附录给深挖的人。',
          },
          {
            label: '堆六张表',
            youSay: '（六页 Excel）',
            reply: { from: '你老板', text: '说重点' },
            thought: '表格是给你分析的，不是给老板看的。',
            teach: '可视化选最懂业务的那张，不是最炫的那张。',
          },
        ],
        endTag: '分析师的一天：对齐口径 → SQL 取数 → 分析 → 汇报推动。取数工具人还是策略伙伴，取决于你怎么做。',
      },
    ],
    summary: {
      processRecap: '数据分析主线：澄清需求/口径 → SQL 取数 → 分析归因 → 可视化 → 汇报推动落地。埋点、数仓、业务理解三块缺一不可。',
      keyJargon: [
        { term: '口径 / 埋点 / cohort', plain: '怎么算；行为上报；用户群追踪' },
        { term: 'SQL / 数仓 / BI', plain: '查数；数据仓库；看板' },
        { term: '漏斗 / 归因 / A/B', plain: '流失；原因；实验' },
      ],
      selfCheck: ['愿意学 SQL 吗？', '业务催数时能坚持口径吗？', '能把数字讲成故事吗？'],
      verdictHint: '逻辑好、对数字敏感、愿意沟通，数据分析值得试。可先学 SQL+Excel，实习验证喜不喜欢。',
    },
  },
};
