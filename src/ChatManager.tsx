import h from './utils/runtime';

import styles from './style.mod.less';
import {
  BubbleButtonId,
  DefaultBubbleButtonBackgroundImage,
} from './utils/constants';
import ChatHolder from './ChatHolder';
import { ChatOptions } from './utils/type';

class ChatManager {
  private bubbleButton?: HTMLElement;
  private currentState = false;
  private onStateChangeHandler?: (state: boolean) => void;

  constructor(private opts: ChatOptions, private chatHolder: ChatHolder) {
    this.initView();
    this.chatHolder.onCloseChat = this.close;
  }

  set holderState(state: boolean) {
    this.currentState = state;
    this.onStateChangeHandler?.(state);

    if (this.currentState) {
      this.bubbleButton?.classList.add(styles.close);
    } else {
      this.bubbleButton?.classList.remove(styles.close);
    }

    state ? this.chatHolder.open() : this.chatHolder.destroy();
  }

  onStateChange(handler: (state: boolean) => void) {
    this.onStateChangeHandler = handler;
  }

  get holderState() {
    return this.currentState;
  }

  private initView() {
    const bubbleButton = (
      <div
        class={styles.button}
        style={this.generateCustomButtonStyle()}
        id={BubbleButtonId}
      >
        <img
          class={`${styles.open} ${
            this.opts.bubbleOpenImg ? styles.customized : ''
          }`}
          src={
            this.opts.bubbleOpenImg || DefaultBubbleButtonBackgroundImage.Open
          }
        />
        <img
          class={`${styles.close} ${
            this.opts.bubbleCloseImg || this.opts.bubbleOpenImg
              ? styles.customized
              : ''
          }`}
          src={
            this.opts.bubbleOpenImg && !this.opts.bubbleCloseImg
              ? this.opts.bubbleOpenImg
              : this.opts.bubbleCloseImg ||
                DefaultBubbleButtonBackgroundImage.Close
          }
        />
      </div>
    );

    bubbleButton.addEventListener('click', () => {
      this.onClick();
    });

    document.body.appendChild(bubbleButton);
    this.bubbleButton = bubbleButton;
  }

  private onClick() {
    this.holderState = !this.holderState;
  }

  private close = () => {
    this.holderState = false;
  };

  private generateCustomButtonStyle() {
    return {
      background: this.opts.primaryColor,
    };
  }
}

export default ChatManager;
