import h from './utils/runtime';

import styles from './style.mod.less';
import { BubbleButtonId } from './utils/constants';
import ChatHolder from './ChatHolder';

class ChatManager {
  private bubbleButton?: HTMLElement;
  private currentState = false;
  private onStateChangeHandler?: (state: boolean) => void;

  constructor(private primaryColor: string, private chatHolder: ChatHolder) {
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
          class={styles.open}
          src="//mtbird-cdn.staringos.com/111144171373-1216141-41610-1141410-611010103032357.png"
        />
        <img
          class={styles.close}
          src="//mtbird-cdn.staringos.com/14100111131010-101025-41521-102214-045113111511016317.png"
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
      background: this.primaryColor,
    };
  }
}

export default ChatManager;
