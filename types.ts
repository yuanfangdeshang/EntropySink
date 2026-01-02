export interface Session {
  wxid: string;
  nickname: string;
  remark: string;
  displayName: string;
  type: string;
  lastTimestamp: number;
  messageCount: number;
}

export interface RawMessage {
  localId: number;
  createTime: number;
  formattedTime: string;
  type: string | number; // Sometimes it's a string description, sometimes an ID in other exports
  localType: number;
  content: string;
  isSend: number | null; // 1 for send, 0 for receive
  senderUsername: string;
  senderDisplayName: string;
  senderAvatarKey?: string;
  source?: string; // XML content containing noise
  emojiMd5?: string;
}

export interface ChatExport {
  session: Session;
  messages: RawMessage[];
  avatars?: Record<string, any>;
}

export interface CleanOptions {
  anonymizeUsers: boolean;
  removeTime: boolean;
  removeSystemMessages: boolean;
  simplifyMedia: boolean;
  mergeConsecutive: boolean;
  maskSensitive: boolean;
  useShortAliases: boolean;
  customKeywords: string; // New: User defined words to redact (names, places)
}