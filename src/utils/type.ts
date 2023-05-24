export type StaringChatConfig = {
  name: string;
  domainName: string;
  assistantId: string;
  primaryColor: string;
  page: string;
};


export interface ChatOptions {
  csid: string;
  primaryColor?: string;
  bubbleOpenImg?: string;
  bubbleCloseImg?: string;
}
