import { ChatExport, CleanOptions, RawMessage } from '../types';

// --- Data Constants ---

// Top 300+ Common Chinese Surnames
const COMMON_SURNAMES = 
  "李王张刘陈杨赵黄周吴徐孙胡朱高林何郭马罗梁宋郑谢韩唐冯于董萧程曹袁邓许傅沈曾彭吕苏卢蒋蔡贾丁魏薛叶阎余潘杜戴夏钟汪田任姜范方石姚谭廖邹熊金陆郝孔白崔康毛邱秦江史顾侯邵孟龙万段雷钱汤尹黎易常武乔贺赖龚文庞樊兰殷施尤普赫干解牟游景詹安邵葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊於惠家封芮羿储靳汲邴糜松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶郜黎蓟薄印宿白怀蒲台从鄂索咸籍赖卓蔺屠蒙池乔阴鬱胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍郤璩桑桂濮牛寿通边扈燕冀郏浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查后荆红游竺权逯盖益桓公";

// Common words starting with a surname character that should NOT be redacted.
// e.g. "高" is a surname, but "高兴" (happy) should be kept.
const COMMON_WORDS_WHITELIST = new Set([
  "没有", "没什么", "没事", "没关系", "没有", // Mei
  "高兴", "告诉", "高速", "高高兴兴", "高中", // Gao
  "明天", "明白", "明星", "明亮", "明确", // Ming
  "方方", "方便", "方法", "方向", "方面", // Fang
  "大家", "大力", "大声", // Da (rare surname)
  "如果", "如何", "如今", // Ru
  "本来", "本人", "本意", // Ben
  "和平", "和气", "和睦", // He
  "文化", "文明", "文章", // Wen
  "安安", "安全", "安排", "安静", // An
  "正常", "正如", "正当", // Zheng
  "白白", "白色", "白天", // Bai
  "毛病", "毛衣", // Mao
  "长江", "长长", // Chang
  "黄山", "黄色", // Huang
  "林业", "林地", // Lin
  "天天", "天气", "天然", // Tian
  "千万", "千里", // Qian
  "金钱", "金色", // Jin
  "史诗", "历史", // Shi
  "交通", "交流", // Jiao (rare)
  "雷雨", "雷电", // Lei
  "云朵", "云彩", // Yun
  "花朵", "花草", // Hua
]);

// Helper to get separate Date and Time strings
const getDateTimeParts = (timestamp: number) => {
  const dateObj = new Date(timestamp * 1000);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const mins = dateObj.getMinutes().toString().padStart(2, '0');
  
  return {
    dateStr: `${year}-${month}-${day}`,
    timeStr: `${hours}:${mins}`
  };
};

const maskSensitiveData = (text: string, customKeywords: string = ""): string => {
  let cleaned = text;

  // 1. Custom Keywords (User provided)
  if (customKeywords && customKeywords.trim().length > 0) {
    const keywords = customKeywords.split(/[,，\n]/).map(k => k.trim()).filter(k => k.length > 0);
    keywords.sort((a, b) => b.length - a.length);
    keywords.forEach(keyword => {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'g');
      cleaned = cleaned.replace(regex, '[REDACTED]');
    });
  }

  // 2. Automated Chinese Name Detection (Heuristic)
  // Logic: Match [Surname][1-2 Chinese Chars]
  // Note: This is aggressive. We use the whitelist to protect common words.
  const surnameRegex = new RegExp(`([${COMMON_SURNAMES}])[\\u4e00-\\u9fa5]{1,2}`, 'g');
  
  cleaned = cleaned.replace(surnameRegex, (match) => {
    // If the match is in our whitelist (e.g. "高兴"), keep it.
    if (COMMON_WORDS_WHITELIST.has(match)) {
      return match;
    }
    // Also skip if it's just a common phrase pattern we missed
    // Simple check: if it ends with common particles like '的', '了', '是', ignore it (likely a sentence fragment)
    if (/[的了是着过]$/.test(match)) {
      return match;
    }
    
    return '[NAME_REDACTED]';
  });


  // 3. Mask URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '[URL]');

  // 4. Mask Email Addresses
  cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');

  // 5. Mask Phones/IDs
  cleaned = cleaned.replace(/\b\d{6,}\b/g, '[NUM_REDACTED]');
  cleaned = cleaned.replace(/\b\d{3,}[- ]\d{3,}[- ]\d{3,}\b/g, '[PHONE_REDACTED]');

  // 6. Address Heuristics
  cleaned = cleaned.replace(/[\u4e00-\u9fa5]{2,}(省|市|区|县|街道|路|号|室)/g, (match) => {
    if (match.length > 8) return '[ADDRESS_REDACTED]'; 
    return match;
  });

  return cleaned;
};

export const processChatLog = (data: ChatExport, options: CleanOptions): string => {
  const { messages, session } = data;

  if (!messages || !Array.isArray(messages)) {
    throw new Error("Invalid JSON format: 'messages' array missing.");
  }

  const sortedMessages = [...messages].sort((a, b) => a.createTime - b.createTime);
  const lines: string[] = [];

  // --- Step 1: Identify Users & Assign Aliases ---
  const userMap = new Map<string, string>(); // ID -> Display Name
  const aliasMap = new Map<string, string>(); // ID -> Short Alias (A, B, C)
  const uniqueSenderIds = new Set<string>();

  // Collect all senders
  sortedMessages.forEach(msg => {
    const id = msg.senderUsername || msg.senderDisplayName || "unknown_user";
    if (!uniqueSenderIds.has(id)) {
      uniqueSenderIds.add(id);
      
      let displayName = msg.senderDisplayName || id;
      if (id === session.wxid && !msg.senderDisplayName) {
        displayName = "Me";
      }
      userMap.set(id, displayName);
    }
  });

  let charCode = 65; // 'A'
  uniqueSenderIds.forEach(id => {
    const alias = String.fromCharCode(charCode++);
    aliasMap.set(id, alias);
  });

  // --- Step 2: Build Header ---
  lines.push(`--- Chat Session ---`);
  
  if (options.useShortAliases) {
    lines.push(`[Legend]`);
    uniqueSenderIds.forEach(id => {
      const alias = aliasMap.get(id);
      let realName = userMap.get(id);
      
      if (options.anonymizeUsers) {
        realName = `Person ${alias}`;
      }
      
      lines.push(`${alias}: ${realName}`);
    });
    lines.push(`[End Legend]`);
  } else if (options.anonymizeUsers) {
     lines.push(`Note: Users have been anonymized.`);
  }

  if (options.maskSensitive) {
    lines.push(`Note: Sensitive data (phones, emails, urls, names) redacted.`);
  }
  lines.push("");

  // --- Step 3: Process Messages ---
  
  let lastDateStr = "";
  let lastSenderId: string | null = null;
  let lastTimeMinute: string | null = null;
  
  let currentBlock: string[] = [];
  let blockHeader = "";

  const flushBlock = () => {
    if (currentBlock.length > 0) {
      lines.push(`${blockHeader}${currentBlock.join(" ")}`);
      currentBlock = [];
    }
  };

  sortedMessages.forEach((msg) => {
    // 1. Filter
    if (options.removeSystemMessages) {
      if (msg.localType === 10000 || msg.type === "拍一拍消息") return;
    }

    // 2. Prepare Content
    let content = msg.content;
    if (options.simplifyMedia) {
      if (msg.localType === 3) content = "[Image]";
      else if (msg.localType === 34) content = "[Audio]";
      else if (msg.localType === 43) content = "[Video]";
      else if (msg.localType === 47) content = "[Sticker]";
      else if (msg.localType === 49) content = "[Link/File]";
    }
    content = content.replace(/<msgsource>[\s\S]*?<\/msgsource>/g, '').trim();
    
    // 3. Apply Masking
    if (options.maskSensitive) {
      // First, specifically mask known participant names (high confidence)
      if (options.anonymizeUsers) {
         userMap.forEach((name, id) => {
           if (name && name !== "Me" && name.length > 1) {
             const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
             const regex = new RegExp(escapedName, 'g');
             content = content.replace(regex, `[User ${aliasMap.get(id)}]`);
           }
         });
      }

      // Then apply general heuristics (custom + automated surnames + numbers)
      content = maskSensitiveData(content, options.customKeywords);
    }

    content = content.replace(/\s+/g, ' '); 
    if (!content) return;

    // 4. Time & Date Logic
    const { dateStr, timeStr } = getDateTimeParts(msg.createTime);

    if (dateStr !== lastDateStr) {
      flushBlock();
      lastSenderId = null; 
      lastTimeMinute = null;
      
      if (!options.removeTime) {
         lines.push("");
         lines.push(`--- ${dateStr} ---`);
      }
      lastDateStr = dateStr;
    }

    // 5. Sender ID Resolution
    const senderId = msg.senderUsername || msg.senderDisplayName || "unknown_user";
    let senderLabel = "";

    if (options.useShortAliases) {
      senderLabel = aliasMap.get(senderId) || "?";
    } else {
      if (options.anonymizeUsers) {
        senderLabel = `User ${aliasMap.get(senderId)}`; 
      } else {
        senderLabel = userMap.get(senderId) || "Unknown";
      }
    }

    // 6. Merging Check
    const shouldMerge = options.mergeConsecutive && 
                        senderId === lastSenderId && 
                        timeStr === lastTimeMinute;

    if (shouldMerge) {
      currentBlock.push(content);
    } else {
      flushBlock();
      lastSenderId = senderId;
      lastTimeMinute = timeStr;
      
      let prefix = "";
      if (!options.removeTime) {
        prefix += `[${timeStr}] `;
      }
      prefix += `${senderLabel}: `;
      
      blockHeader = prefix;
      currentBlock.push(content);
    }
  });

  flushBlock();

  return lines.join("\n");
};