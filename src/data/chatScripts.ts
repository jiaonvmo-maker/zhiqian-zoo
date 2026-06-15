import type { ChatMessage } from '@/types';
import { npcs } from './npcs';

const NOW = Date.now();

function time(offsetMin: number): number {
  return NOW - offsetMin * 60000;
}

export function generateChatScript(departmentId: string): ChatMessage[] {
  const scripts: Record<string, ChatMessage[]> = {
    product: [
      { id: 'c1', npcId: 'pm-1', text: '那个测评的需求 老板又问进度了 @你', timestamp: time(60), mood: 'normal' },
      { id: 'c2', npcId: 'pm-2', text: '数据又掉了……活动还上不上', timestamp: time(55), mood: 'energetic' },
      { id: 'c3', npcId: 'pm-1', text: '不难吧 就改个文案', timestamp: time(50), mood: 'normal' },
      { id: 'c4', npcId: 'pm-2', text: '老板很关注这个项目，每天问我进度', timestamp: time(48), mood: 'energetic' },
      { id: 'c5', npcId: 'pm-1', text: '对标一下竞品，人家都上线三个月了', timestamp: time(45), mood: 'normal' },
      { id: 'c6', npcId: 'pm-1', text: '用户调研做了吗？样本量够吗？', timestamp: time(40), mood: 'strict' },
      { id: 'c7', npcId: 'pm-2', text: 'PRD写好了，谁来看一眼？', timestamp: time(38), mood: 'normal' },
      { id: 'c8', npcId: 'pm-1', text: '原型图呢？交互稿呢？视觉稿呢？', timestamp: time(35), mood: 'angry' },
      { id: 'c9', npcId: 'pm-2', text: '开发说这个做不了，你们帮我压一压', timestamp: time(30), mood: 'sneaky' },
      { id: 'c10', npcId: 'pm-1', text: '今晚加个班，把这个方案对齐一下', timestamp: time(25), mood: 'normal' },
      { id: 'c11', npcId: 'pm-2', text: '（转发）老板原话："要快、要好、要省"', timestamp: time(20), mood: 'normal' },
      { id: 'c12', npcId: 'pm-1', text: '又要改需求？这已经是本周第三次了...', timestamp: time(15), mood: 'tired' },
      { id: 'c13', npcId: 'pm-2', text: '没事，习惯就好，改需求是产品经理的日常', timestamp: time(12), mood: 'normal' },
      { id: 'c14', npcId: 'pm-1', text: '谁能把这个文档补一下？明天要汇报了', timestamp: time(8), mood: 'normal' },
      { id: 'c15', npcId: 'pm-2', text: '汇报PPT我来做，你们专心写方案', timestamp: time(5), mood: 'energetic' },
    ],
    tech: [
      { id: 'c1', npcId: 'dev-1', text: '服务又挂了，生产环境出502了', timestamp: time(60), mood: 'tired' },
      { id: 'c2', npcId: 'qa-1', text: '测了10个Bug，你们怎么写的代码？', timestamp: time(55), mood: 'angry' },
      { id: 'c3', npcId: 'dev-2', text: '这不是Bug是特性，懂不懂啊', timestamp: time(52), mood: 'normal' },
      { id: 'c4', npcId: 'dev-1', text: '加班到凌晨，头发又少了三根', timestamp: time(50), mood: 'tired' },
      { id: 'c5', npcId: 'qa-1', text: '这个流程走不通，点击就报错', timestamp: time(48), mood: 'strict' },
      { id: 'c6', npcId: 'dev-2', text: '需求改了第几版了？我辞职算了', timestamp: time(45), mood: 'angry' },
      { id: 'c7', npcId: 'dev-1', text: '先排期吧，手上有三个需求在写了', timestamp: time(42), mood: 'tired' },
      { id: 'c8', npcId: 'qa-1', text: '开发说没问题？那这白屏是我眼花了？', timestamp: time(40), mood: 'angry' },
      { id: 'c9', npcId: 'dev-2', text: '代码提交了，但是CI/CD挂了', timestamp: time(38), mood: 'tired' },
      { id: 'c10', npcId: 'dev-1', text: '服务器硬盘满了，日志清理一下吧', timestamp: time(35), mood: 'normal' },
      { id: 'c11', npcId: 'qa-1', text: '回归测试通过率60%，你们自测了吗？', timestamp: time(32), mood: 'strict' },
      { id: 'c12', npcId: 'dev-2', text: '（图片）新建文件夹.jpg', timestamp: time(30), mood: 'normal' },
      { id: 'c13', npcId: 'dev-1', text: '今天周五，有问题周一再说', timestamp: time(25), mood: 'normal' },
      { id: 'c14', npcId: 'qa-1', text: '周一？周一我要提测了！', timestamp: time(22), mood: 'angry' },
      { id: 'c15', npcId: 'dev-2', text: '算了，继续写吧，反正没有周末', timestamp: time(20), mood: 'tired' },
      { id: 'c16', npcId: 'dev-1', text: '谁动了我的分支？合并冲突炸了', timestamp: time(18), mood: 'angry' },
      { id: 'c17', npcId: 'qa-1', text: '我能在你工位旁边看着你修Bug吗？', timestamp: time(15), mood: 'sneaky' },
      { id: 'c18', npcId: 'dev-2', text: '不用，你在这我更紧张', timestamp: time(12), mood: 'normal' },
    ],
    operation: [
      { id: 'c1', npcId: 'op-1', text: '预算不够了，再做一轮裂变活动', timestamp: time(60), mood: 'energetic' },
      { id: 'c2', npcId: 'op-2', text: '文案写好了，阅读量又暴跌', timestamp: time(55), mood: 'tired' },
      { id: 'c3', npcId: 'op-1', text: 'KPI还差30%，求资源啊各位', timestamp: time(50), mood: 'normal' },
      { id: 'c4', npcId: 'op-2', text: '热点追不上了，隔壁公司都发完了', timestamp: time(48), mood: 'tired' },
      { id: 'c5', npcId: 'op-1', text: '这次618活动方案谁看一下？', timestamp: time(45), mood: 'normal' },
      { id: 'c6', npcId: 'op-2', text: '社群裂变的SOP我整理好了', timestamp: time(42), mood: 'normal' },
      { id: 'c7', npcId: 'op-1', text: '商务说预算砍半，我们怎么办？', timestamp: time(40), mood: 'normal' },
      { id: 'c8', npcId: 'op-2', text: '发公众号吧，零成本', timestamp: time(38), mood: 'normal' },
      { id: 'c9', npcId: 'op-1', text: '用户增长了0.5%，值得发战报！', timestamp: time(35), mood: 'energetic' },
      { id: 'c10', npcId: 'op-2', text: '0.5%？这也能吹？', timestamp: time(32), mood: 'normal' },
      { id: 'c11', npcId: 'op-1', text: '能吹！包装一下就是"逆势增长"', timestamp: time(30), mood: 'sneaky' },
      { id: 'c12', npcId: 'op-2', text: '运营人的日常：没有预算，全靠演技', timestamp: time(28), mood: 'normal' },
      { id: 'c13', npcId: 'op-1', text: '今晚直播谁来顶？主播请假了', timestamp: time(25), mood: 'normal' },
      { id: 'c14', npcId: 'op-2', text: '我来吧...反正我也没什么头发可以掉了', timestamp: time(22), mood: 'tired' },
      { id: 'c15', npcId: 'op-1', text: '宝子们冲！这波数据必须好看！', timestamp: time(18), mood: 'energetic' },
    ],
    commercial: [
      { id: 'c1', npcId: 'sales-1', text: '客户又改需求了，说要定制化开发', timestamp: time(60), mood: 'normal' },
      { id: 'c2', npcId: 'sales-1', text: '合同还没签，客户要再比三家', timestamp: time(55), mood: 'normal' },
      { id: 'c3', npcId: 'sales-1', text: '给点折扣呗，业绩压力太大了', timestamp: time(50), mood: 'sneaky' },
      { id: 'c4', npcId: 'sales-1', text: '这个大客户我跟了三个月了', timestamp: time(48), mood: 'tired' },
      { id: 'c5', npcId: 'sales-1', text: '签单了！200万！今晚我请客！', timestamp: time(45), mood: 'happy' },
      { id: 'c6', npcId: 'sales-1', text: '（半小时后）客户说再考虑一下', timestamp: time(42), mood: 'tired' },
      { id: 'c7', npcId: 'sales-1', text: '销售人的命不是命，客户的考虑才是命', timestamp: time(40), mood: 'normal' },
      { id: 'c8', npcId: 'sales-1', text: '谁帮我做个方案PPT？今晚要用', timestamp: time(38), mood: 'normal' },
      { id: 'c9', npcId: 'sales-1', text: '客户说我们的报价比竞品高50%', timestamp: time(35), mood: 'normal' },
      { id: 'c10', npcId: 'sales-1', text: '没事，我们服务好，值这个价', timestamp: time(32), mood: 'sneaky' },
    ],
    design: [
      { id: 'c1', npcId: 'design-1', text: '没对齐！这个间距应该是4px', timestamp: time(60), mood: 'strict' },
      { id: 'c2', npcId: 'design-2', text: '改第8稿了，用户旅程还是有问题', timestamp: time(55), mood: 'tired' },
      { id: 'c3', npcId: 'design-1', text: '参考一下dribbble，这个颜色不行', timestamp: time(52), mood: 'angry' },
      { id: 'c4', npcId: 'design-2', text: '再做一轮可用性测试吧', timestamp: time(50), mood: 'normal' },
      { id: 'c5', npcId: 'design-1', text: 'PM说按钮要再大一点，再红一点', timestamp: time(48), mood: 'angry' },
      { id: 'c6', npcId: 'design-2', text: '大？红？这什么审美...', timestamp: time(45), mood: 'normal' },
      { id: 'c7', npcId: 'design-1', text: '8稿了！我Figma文件要爆炸了', timestamp: time(42), mood: 'tired' },
      { id: 'c8', npcId: 'design-2', text: '习惯就好，我最高纪录17稿', timestamp: time(40), mood: 'normal' },
      { id: 'c9', npcId: 'design-1', text: '视觉规范更新了，全部重新来', timestamp: time(38), mood: 'angry' },
      { id: 'c10', npcId: 'design-2', text: '全部？你认真的吗？', timestamp: time(35), mood: 'surprised' },
      { id: 'c11', npcId: 'design-1', text: '设计师的第一课：没有什么是不能重画的', timestamp: time(32), mood: 'normal' },
      { id: 'c12', npcId: 'design-2', text: '我画的是UI，丢掉的是人生', timestamp: time(30), mood: 'tired' },
    ],
    hr: [
      { id: 'c1', npcId: 'hr-1', text: '来，谈谈你的绩效评级', timestamp: time(60), mood: 'strict' },
      { id: 'c2', npcId: 'hr-1', text: '这周末团建，去爬山，全员必须参加', timestamp: time(55), mood: 'normal' },
      { id: 'c3', npcId: 'hr-1', text: '考勤异常，你上周迟到了3次', timestamp: time(50), mood: 'strict' },
      { id: 'c4', npcId: 'hr-1', text: '春季招聘计划：要招20个人，预算砍了一半', timestamp: time(48), mood: 'normal' },
      { id: 'c5', npcId: 'hr-1', text: '（转发）公司新规定：饮水机旁边不能聊天', timestamp: time(45), mood: 'normal' },
      { id: 'c6', npcId: 'hr-1', text: '有人投诉办公区太吵，请大家保持安静', timestamp: time(42), mood: 'strict' },
      { id: 'c7', npcId: 'hr-1', text: '生日福利取消了，改为精神鼓励', timestamp: time(40), mood: 'normal' },
      { id: 'c8', npcId: 'hr-1', text: '离职手续在3楼办理，电梯左手边', timestamp: time(38), mood: 'normal' },
      { id: 'c9', npcId: 'hr-1', text: '今晚培训："如何提升职场幸福感"', timestamp: time(35), mood: 'sneaky' },
      { id: 'c10', npcId: 'hr-1', text: '强制参加，签到算入考勤', timestamp: time(32), mood: 'strict' },
    ],
    finance: [
      { id: 'c1', npcId: 'finance-1', text: '预算超了，这月亏损200万', timestamp: time(60), mood: 'strict' },
      { id: 'c2', npcId: 'finance-1', text: '发票不对，报销驳回，重新贴', timestamp: time(55), mood: 'normal' },
      { id: 'c3', npcId: 'finance-1', text: 'Q2财务结算开始了，各部门交表', timestamp: time(50), mood: 'strict' },
      { id: 'c4', npcId: 'finance-1', text: '你的出差报销有3张发票不合规', timestamp: time(48), mood: 'normal' },
      { id: 'c5', npcId: 'finance-1', text: '公司决定暂缓涨薪计划', timestamp: time(45), mood: 'normal' },
      { id: 'c6', npcId: 'finance-1', text: '食堂预算也砍了，以后午餐自己解决', timestamp: time(42), mood: 'normal' },
      { id: 'c7', npcId: 'finance-1', text: '这个合同付款条款要改，账期太长', timestamp: time(40), mood: 'strict' },
      { id: 'c8', npcId: 'finance-1', text: '审计来了，所有人准备好材料', timestamp: time(38), mood: 'strict' },
      { id: 'c9', npcId: 'finance-1', text: '（图片）一张糊到看不清的发票.jpg', timestamp: time(35), mood: 'normal' },
      { id: 'c10', npcId: 'finance-1', text: '这种发票不能报销！重新开！', timestamp: time(32), mood: 'angry' },
    ],
    legal: [
      { id: 'c1', npcId: 'legal-1', text: '这个方案不合规，有法律风险', timestamp: time(60), mood: 'strict' },
      { id: 'c2', npcId: 'legal-1', text: '条款要改，先过法务再说', timestamp: time(55), mood: 'normal' },
      { id: 'c3', npcId: 'legal-1', text: '用户协议要更新了， GDPR合规', timestamp: time(50), mood: 'strict' },
      { id: 'c4', npcId: 'legal-1', text: '这个营销活动涉嫌虚假宣传', timestamp: time(48), mood: 'strict' },
      { id: 'c5', npcId: 'legal-1', text: '合同里这个免责条款无效', timestamp: time(45), mood: 'normal' },
      { id: 'c6', npcId: 'legal-1', text: '我们被投诉了，准备应诉材料', timestamp: time(42), mood: 'normal' },
      { id: 'c7', npcId: 'legal-1', text: '法务意见：不能做。句号。', timestamp: time(40), mood: 'strict' },
      { id: 'c8', npcId: 'legal-1', text: '老板说这个必须做。那你们签个风险确认书。', timestamp: time(38), mood: 'sneaky' },
    ],
    management: [
      { id: 'c1', npcId: 'ceo-1', text: '我们要All in AI，这是战略级项目', timestamp: time(60), mood: 'normal' },
      { id: 'c2', npcId: 'ceo-1', text: '兄弟们加油，明年上市', timestamp: time(55), mood: 'sneaky' },
      { id: 'c3', npcId: 'ceo-1', text: '最近大家都辛苦了，我都知道', timestamp: time(50), mood: 'normal' },
      { id: 'c4', npcId: 'ceo-1', text: '但是公司现在处于关键期，需要大家再拼一拼', timestamp: time(48), mood: 'normal' },
      { id: 'c5', npcId: 'ceo-1', text: '（转发）一篇《狼性团队》的公众号文章', timestamp: time(45), mood: 'normal' },
      { id: 'c6', npcId: 'ceo-1', text: '这个方向我看行，投入不设上限', timestamp: time(42), mood: 'sneaky' },
      { id: 'c7', npcId: 'ceo-1', text: '不设上限的意思是先做，预算后面补', timestamp: time(40), mood: 'normal' },
      { id: 'c8', npcId: 'ceo-1', text: '这个季度目标：营收翻倍，成本减半', timestamp: time(38), mood: 'sneaky' },
      { id: 'c9', npcId: 'ceo-1', text: '谁有问题？没有问题就散会', timestamp: time(35), mood: 'normal' },
      { id: 'c10', npcId: 'ceo-1', text: '有问题也先执行，执行中解决', timestamp: time(32), mood: 'strict' },
    ],
    support: [
      { id: 'c1', npcId: 'support-1', text: '又有人投诉了，对不起给您添麻烦了', timestamp: time(60), mood: 'tired' },
      { id: 'c2', npcId: 'support-1', text: '会议室订好了，在3楼左手边', timestamp: time(55), mood: 'normal' },
      { id: 'c3', npcId: 'support-1', text: '工单已记录，预计24小时内回复', timestamp: time(50), mood: 'normal' },
      { id: 'c4', npcId: 'support-1', text: '客户说再打不通就315投诉...', timestamp: time(48), mood: 'tired' },
      { id: 'c5', npcId: 'support-1', text: '今天接了87个电话，嗓子哑了', timestamp: time(45), mood: 'tired' },
      { id: 'c6', npcId: 'support-1', text: '有个客户骂了15分钟没重复词，挺有才华的', timestamp: time(42), mood: 'normal' },
      { id: 'c7', npcId: 'support-1', text: '前台快递堆成山了，谁来领一下', timestamp: time(40), mood: 'normal' },
      { id: 'c8', npcId: 'support-1', text: '打印机又卡纸了，第5次', timestamp: time(38), mood: 'tired' },
      { id: 'c9', npcId: 'support-1', text: '（转发）客户好评："客服态度很好，但问题没解决"', timestamp: time(35), mood: 'normal' },
    ],
    data: [
      { id: 'c1', npcId: 'data-1', text: 'SQL跑不出来，漏斗又掉了', timestamp: time(60), mood: 'tired' },
      { id: 'c2', npcId: 'data-1', text: '埋点没传，预测准确率不到50%', timestamp: time(55), mood: 'normal' },
      { id: 'c3', npcId: 'data-1', text: 'DAU跌了15%，快找原因！', timestamp: time(50), mood: 'angry' },
      { id: 'c4', npcId: 'data-1', text: '看板更新了，大家自己去看', timestamp: time(48), mood: 'normal' },
      { id: 'c5', npcId: 'data-1', text: '转化漏斗在第三步断崖下跌', timestamp: time(45), mood: 'normal' },
      { id: 'c6', npcId: 'data-1', text: '我排查了一下，是前端埋点漏了', timestamp: time(42), mood: 'normal' },
      { id: 'c7', npcId: 'data-1', text: '数据不对？很正常，我们口径每周变一次', timestamp: time(40), mood: 'sneaky' },
      { id: 'c8', npcId: 'data-1', text: '老板要"直观"的数据，我做了30张图表', timestamp: time(38), mood: 'tired' },
      { id: 'c9', npcId: 'data-1', text: '他说"还是第一张好看"，那张是我随便拉的', timestamp: time(35), mood: 'normal' },
    ],
  };

  return scripts[departmentId] || [];
}

export function generateRandomLine(npcId: string): string {
  const npcLines: Record<string, string[]> = {
    'pm-1': ['这个需求很简单','怎么实现我不管','下周能上线吗','用户很需要这个','先出个方案','老板很关注','对标一下竞品','先对齐颗粒度','排期表呢？','又是临时需求'],
    'pm-2': ['数据掉了','赶紧上个活动','对标一下竞品','老板很关注','再改一版','KPI还差多少？','转化率呢？','用户留存崩了','赶紧补个活动','拉新成本太高了'],
    'dev-1': ['在写了','这不是Bug是特性','先排期吧','服务又挂了','代码提交了','CI/CD挂了','合并冲突','数据库又锁了','缓存过期了','API限流了'],
    'dev-2': ['加班到凌晨','需求改第几版了','我辞职算了','头发又少了','review一下','这个技术债','重构还是重写？','屎山代码','谁来维护？','又加班'],
    'qa-1': ['这算Bug','测了10个Bug','这个流程走不通','开发说没问题','回归测试','验收不通过','边界条件呢？','性能不达标','兼容性问题','又复现了'],
    'op-1': ['预算不够','再做个裂变','KPI还差30%','求资源','活动上线了','数据怎么样？','用户反馈呢？','竞品又搞事了','流量成本涨了','ROI多少'],
    'op-2': ['文案写好了','再改一版吧','热点追不上了','阅读量暴跌','发公众号','社群炸了','评论区控不住了','舆情监控','品牌调性','内容排期'],
    'sales-1': ['客户又改需求','合同还没签','这个要定制','给点折扣','签单了','客户跑了','回款呢？','竞标失败了','渠道要费用','客单价太低'],
    'design-1': ['没对齐','改第8稿了','这个颜色不行','参考dribbble','像素级','间距呢？','字体不对','阴影参数','圆角不一致','视觉层级'],
    'design-2': ['用户旅程有问题','再做可用性测试','这里逻辑不通','调研一下','交互稿','原型评审','信息架构','交互流程','用户路径','留存率'],
    'hr-1': ['来谈话','绩效评级出来了','团建去爬山','考勤异常','招不到人','离职率','薪酬调研','培训计划','企业文化','强制分布'],
    'finance-1': ['预算超了','发票不对','报销驳回','这月亏损','等审批','成本分析','利润率','现金流','审计来了','费用管控'],
    'legal-1': ['这不合规','条款要改','有风险','先过法务','不同意','免责声明','知识产权','数据合规','隐私协议','用户授权'],
    'ceo-1': ['我们要All in AI','这是战略级项目','兄弟们加油','明年上市','看好你们','投入不设上限','降本增效','全员营销','使命必达','周末加个班'],
    'support-1': ['又有人投诉','对不起添麻烦了','记录工单','会议室订好了','已反馈','87个电话','嗓子哑了','快递堆成山','打印机卡纸','已转接'],
    'data-1': ['SQL跑不出来','漏斗又掉了','埋点没传','预测不准','看板更新了','DAU跌了','转化断崖','口径变了','30张图表','数据口径'],
  };
  const lines = npcLines[npcId] || ['...'];
  return lines[Math.floor(Math.random() * lines.length)];
}

// Quick reply templates per department
export const QUICK_REPLIES: Record<string, string[]> = {
  product: ['好的PM，我排期', '这个能做，但得加时间', '需求文档在哪？', '能不能不改了？', '先出MVP？'],
  tech: ['修好了', '这不是Bug', '在写了', '合并冲突了', '服务挂了？'],
  operation: ['活动方案发你了', '预算真不够', '文案我改好了', '阅读量多少？', '热点来了！'],
  commercial: ['合同我看看', '折扣我申请一下', '客户约好了', '回款催了', '竞品报价呢？'],
  design: ['好看！', '能再改一版吗', '对齐了吗？', '参考发一下', '颜色能再调吗'],
  hr: ['绩效怎么评？', '团建能不去吗', '报销驳回了？', '考勤正常吧', '假批了吗？'],
  finance: ['发票补好了', '预算申请交了', '报表做好了', '审计材料齐了', '费用明细在这'],
  legal: ['合规意见呢？', '条款改好了', '风险评估呢？', '协议签了', '授权拿到了'],
  management: ['收到', '马上执行', '保证完成', '已经推进了', '明天汇报'],
  support: ['工单已处理', '会议室空着', '投诉记录了', '快递我拿了', '打印机修好了'],
  data: ['看板更新了', '漏斗数据在这', '埋点加好了', '预测模型跑了', 'SQL跑出来了'],
};

// NPC auto-reply to user messages
export function getNPCReply(npcId: string, userText: string): { text: string; mood: 'normal' | 'angry' | 'sneaky' | 'tired' | 'energetic' | 'strict' } {
  const npc = npcs.find((n) => n.id === npcId);
  if (!npc) return { text: '嗯，知道了', mood: 'normal' };

  const lower = userText.toLowerCase();
  
  // Pattern matching for fun replies
  if (lower.includes('好') || lower.includes('ok') || lower.includes('收到')) {
    return { text: '效率！我就喜欢你这样的', mood: 'energetic' };
  }
  if (lower.includes('bug') || lower.includes('修') || lower.includes('问题')) {
    return { text: '（警觉）哪里又有问题了？', mood: 'strict' };
  }
  if (lower.includes('不') || lower.includes('不能') || lower.includes('拒绝')) {
    return { text: '？你敢拒绝？', mood: 'angry' };
  }
  if (lower.includes('改') || lower.includes('再')) {
    return { text: '又要改？我的头发...', mood: 'tired' };
  }
  if (lower.includes('加班') || lower.includes('周末')) {
    return { text: '（发来一个加班申请表）填一下', mood: 'sneaky' };
  }
  if (lower.includes('谢谢') || lower.includes('请') || lower.includes('奶茶')) {
    return { text: '算你有良心，这事我帮你扛了', mood: 'energetic' };
  }
  if (lower.includes('吗？') || lower.includes('？')) {
    return { text: '你问我？我问谁？', mood: 'tired' };
  }
  if (lower.includes('排期') || lower.includes('时间') || lower.includes('多久')) {
    return { text: '排期？我的排期已经排到明年了', mood: 'tired' };
  }
  if (lower.includes('测试') || lower.includes('qa')) {
    return { text: '测试那边你自求多福吧', mood: 'sneaky' };
  }
  if (lower.includes('上线') || lower.includes('发布')) {
    return { text: '上线？先过我这关再说', mood: 'strict' };
  }
  
  // Default random reply
  const defaults = [
    { text: '嗯，继续', mood: 'normal' as const },
    { text: '（已读不回）', mood: 'tired' as const },
    { text: '收到，安排', mood: 'energetic' as const },
    { text: '别催了，在弄了', mood: 'angry' as const },
    { text: '（发来一个表情包）', mood: 'sneaky' as const },
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}
