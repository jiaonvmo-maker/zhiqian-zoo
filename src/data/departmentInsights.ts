import type { RealWorkScene, CommunityVoice } from '@/types';

export interface DeptInsights {
  realScenes: RealWorkScene[];
  voices: CommunityVoice[];
}

export const departmentInsights: Record<string, DeptInsights> = {
  product: {
    realScenes: [
      { title: '下午两点三十七分', scene: '群里 @ 你：不难吧？下周能上？研发已经发流汗表情了。' },
      { title: '复盘', scene: '推送前两天还行第三天掉了。你得编个原因，还得像真的。' },
      { title: '面试还原', scene: '不问你八股，问你推送文案怎么写、效果怎么证——答不上来就尬住。' },
    ],
    voices: [
      { text: '说白了大量时间在催人、对齐人、跟研发扯皮。', from: '干了两年产品的' },
      { text: '国内推进靠情商这事不丢人，丢人的是装不知道。', from: '跳过一次槽的 PM' },
      { text: '面试官就盯你有没有真的用过自家产品。', from: '面过小红书实习的' },
    ],
  },
  tech: {
    realScenes: [
      { title: '二面', scene: '超卖、热 key、异步下单失败咋兜底——项目照搬教程也得讲清你写了哪。' },
      { title: '九点十六', scene: 'PagerDuty 红了。群里说在写了，其实文件夹刚建好。' },
      { title: '现在', scene: 'AI 能写测试了，但线上挂了还是你爬起来。' },
    ],
    voices: [
      { text: '说好几个月没手写 HTML 了，落后感是真的。', from: '小宇宙听友' },
      { text: '快是快了，业务不懂照样白搭。', from: '转产品失败的开发' },
      { text: '大厂就那样，紧绷着紧绷着就习惯了。', from: '《职业离想》听众' },
    ],
  },
  operation: {
    realScenes: [
      { title: '入职第一周', scene: 'JD 写运营，实际账号内容投放店铺直播全你一个人。' },
      { title: '周一', scene: '品牌嫌土、电商嫌软、老板要爆款——你改稿。' },
      { title: '复盘', scene: '转化在天猫，站内数据不好看，锅可能还是你的。' },
    ],
    voices: [
      { text: '预算没到位 KPI 先到位了，经典。', from: '中小厂小红书运营' },
      { text: '最难是持续找到还能用的内容套路。', from: '电商内容团队出来的' },
      { text: '让执行的人去创新，谁都痛苦。', from: '带过实习生的运营' },
    ],
  },
  commercial: {
    realScenes: [
      { title: '客户微信', scene: '竞品便宜一半你们能降吗——你还在吃饭。' },
      { title: '月底', scene: 'Pipeline 差一截，老客户要返点，嗓子已经哑了。' },
      { title: '内部', scene: '研发说没排期，运营说没资源，客户说今天要方案。' },
    ],
    voices: [
      { text: '签的是信任，黄了三个月白干。', from: '干了五年 ToB 的' },
      { text: '面试一下午挺 nice，负责人那场才是真的考。', from: '面过小红书销售的' },
      { text: '吃饭送礼那套有用，但得真懂产品。', from: '广告销售' },
    ],
  },
  design: {
    realScenes: [
      { title: '评审', scene: '按钮再大一点再红一点。你打开第 8 个 Figma 页面。' },
      { title: '走查', scene: '圆角差 2px。研发说安卓就这样。' },
      { title: '周五四点', scene: '视觉规范又更新了。全部重来，习惯就好。' },
    ],
    voices: [
      { text: '评审靠证据不靠嘴，但证据也要熬夜做。', from: 'UI 三年' },
      { text: '再改一版这五个字我都能背出来。', from: '交互' },
      { text: '核心创作者怕翻车，设计得护着他们别乱点。', from: '做过 C 端发布的' },
    ],
  },
  hr: {
    realScenes: [
      { title: '招聘', scene: '一个岗两百份简历，业务还说就要资深的。' },
      { title: '实习', scene: '筛简历、约面试、系统里录信息——杂但都得仔细。' },
      { title: '绩效季', scene: '谈话、签字、有人哭有人骂，你都见过。' },
    ],
    voices: [
      { text: '招不到人压力大，招错人压力更大。', from: 'HRBP' },
      { text: '把人放错位置比人不行更常见。', from: '带过团队的 HR' },
      { text: '合规和人情之间走钢丝，没有教程。', from: 'HR 实习转正' },
    ],
  },
  finance: {
    realScenes: [
      { title: '报销', scene: '抬头错了。对方催你，你只能说系统关账了明天吧。' },
      { title: '月底', scene: '业务催付款，你没合同编号不敢批。' },
      { title: '审计', scene: '差一分钱对不上，全组加班查。' },
    ],
    voices: [
      { text: '不是故意卡你，是怕审计追着我跑。', from: '财务审核' },
      { text: '发票那张纸糊了真的报不了。', from: '被驳回过的运营' },
      { text: '上市前才发现账混在一起，要命。', from: '见过 IPO 的财务' },
    ],
  },
  legal: {
    realScenes: [
      { title: '合同', scene: '销售说今晚要签。你标红第七条，他回客户不会同意。' },
      { title: '业务', scene: '快上线了才来问合不合规——你只能说不行。' },
      { title: '日常', scene: '风险确认书签完，大家继续干。留档是你的活。' },
    ],
    voices: [
      { text: '慢是因为真在看，不是为难你。', from: '法务' },
      { text: '出事挨骂的也是我们，不拦不行。', from: '合规' },
      { text: '老板说要干，你就得让他签字认风险。', from: '老法务' },
    ],
  },
  management: {
    realScenes: [
      { title: '周一早会', scene: '营收翻倍成本减半。你点头，心里在算缺口。' },
      { title: '管培', scene: '跟老板日程、整理研报——离权力近也容易误判自己有权。' },
      { title: '会后', scene: '上传下达。上面一句模糊，下面一百种理解。' },
    ],
    voices: [
      { text: '战略谁都能骂，买单的通常就一个。', from: '事业部负责人' },
      { text: '对齐俩字儿后面全是利益。', from: 'VP' },
      { text: '夹心层嘛，习惯了。', from: '部门经理' },
    ],
  },
  support: {
    realScenes: [
      { title: '爆款之后', scene: '咨询量炸十倍，回复慢五分钟人就走。' },
      { title: '一线', scene: '笔记怎么不见了——你要查审核、限流、申诉，用户只认你。' },
      { title: '多平台', scene: '小红书问完去淘宝买，信息不同步，又挨骂。' },
    ],
    voices: [
      { text: '态度好但问题没解决，评价就这样。', from: '客服三年' },
      { text: '机器人解决不了的时候还是我们扛。', from: '平台客服' },
      { text: '敏感肌能不能用这种问题答错就客诉。', from: '美妆客服' },
    ],
  },
  data: {
    realScenes: [
      { title: '取数', scene: 'DAU 掉了。打开 SQL，埋点又是空的。' },
      { title: '汇报', scene: '老板要直观。你删了六张图留一张大的。' },
      { title: '对齐', scene: '口径又变了。两个分析师能吵一上午。' },
    ],
    voices: [
      { text: '数跑完了业务不改，白跑。', from: '分析师' },
      { text: '说用数据说话，但口径得先吵清楚。', from: '运营转数据的' },
      { text: '以前 Excel 一天，现在一小时——埋点没传照样歇菜。', from: '数据岗' },
    ],
  },
};
