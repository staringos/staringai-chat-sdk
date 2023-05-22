import ChatManager from './ChatManager';
import ChatHolder from './ChatHolder';
import { DefaultChatOptions } from './utils/constants';

export interface ChatOptions {
  csid: string;
  primaryColor?: string;
}

class Chat {
  private chatManage?: ChatManager;
  private chatHolder?: ChatHolder;
  private options: ChatOptions;

  constructor(options: ChatOptions) {
    this.options = this.mergeDefaultOption(options);
  }

  public async init() {
    this.initChantManager();
  }

  private initChantManager() {
    this.chatHolder = new ChatHolder(this.options?.csid);

    this.chatManage = new ChatManager(
      this.options.primaryColor,
      this.chatHolder
    );

    this.chatManage.onStateChange(this.onChatStateChange);
  }

  private onChatStateChange = async (state: boolean) => {
    console.log('onChatStateChange', state);
  };

  private mergeDefaultOption(options: ChatOptions) {
    return {
      ...DefaultChatOptions,
      ...options,
    };
  }
}

export default Chat;
