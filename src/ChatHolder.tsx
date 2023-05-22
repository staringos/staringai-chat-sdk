import { ChatIframeId, ChatHolderId, HolderSpinner } from './utils/constants';
import { fetchCSInfo } from './api/api';
import styles from './style.mod.less';
import h from './utils/runtime';
import { queryStringify } from './utils';
import { regenerateToken } from './utils';
import { checkIfDomExists } from './utils/dom';

class ChatHolder {
  private holder: HTMLElement;
  private iframe: HTMLIFrameElement;
  private startingCSConfig?: StaringChatConfig;
  onCloseChat?: () => void;
  private user?: {
    isVisitor: boolean;
    token: string;
  };
  private isRemoteDataLoaded = false;

  constructor(private botId: string) {
    this.initView();
  }

  set openStatus(isOpen: boolean) {
    if (isOpen) {
      if (document.getElementById(ChatHolderId)) {
        this.holder.classList.remove(styles.hide);
      } else {
        document.body.appendChild(this.holder);
        this.loading = true;
      }

      this.handleAnimationend('', styles.fadeIn);
      this.holder.classList.add(styles.fadeIn);
    } else {
      this.handleAnimationend(styles.hide, styles.fadeOut);
      this.holder.classList.add(styles.fadeOut);
    }
  }

  private async initUser() {
    return {
      isVisitor: true,
      token: await regenerateToken(),
    };
  }

  private async initConfig(token: string) {
    const config = await this.fetchCSConfig(this.botId, token);
    if (!config) {
      console.warn("can't find config!");
    }
    return config;
  }

  private async fetchCSConfig(
    id: string,
    token: string
  ): Promise<StaringChatConfig | undefined> {
    try {
      const result = await fetchCSInfo(id, token);
      if (result.code === 200) {
        return result.data as StaringChatConfig;
      }
    } catch (error) {
      // TODO error
    }

    return undefined;
  }

  private onMobileClose = () => {
    this.onCloseChat?.();
  };

  private initView() {
    this.holder = (
      <div id={ChatHolderId} class={styles.holder}>
        <div id={HolderSpinner} class={styles.spinner}></div>
        <img
          onclick={this.onMobileClose}
          class={styles.mobileClose}
          src="https://mtbird-cdn.staringos.com/111341237116-1213160-41407-131535-31210161616121517175.png"
        />
      </div>
    );

    this.holder.appendChild(
      <div class={styles.powered}>
        Powered by{' '}
        <strong>
          <a href="#">StaringAI</a>
        </strong>
      </div>
    );
  }

  public mountIframe = (botUrl: string) => {
    if (checkIfDomExists(ChatIframeId)) {
      return;
    }

    this.iframe = (
      <iframe
        src={botUrl}
        id={ChatIframeId}
        class={styles.chatBody}
        onload={this.onIframeLoad}
        allow="'camera;microphone;fullscreen;display-capture;picture-in-picture;clipboard-write;'"
      ></iframe>
    ) as HTMLIFrameElement;

    this.holder.prepend(this.iframe);
  };

  private onIframeLoad = () => {
    setTimeout(() => {
      this.loading = false;
    }, 800);
  };

  private async loadRemoteData() {
    const user = await this.initUser();
    const config = await this.initConfig(user?.token);
    return {
      user,
      config,
    };
  }

  set loading(state: boolean) {
    const spinner = document.getElementById(HolderSpinner);
    if (state) {
      spinner.classList.remove(styles.hide);
    } else {
      spinner.classList.add(styles.hide);
    }
  }

  public async open() {
    this.openStatus = true;

    if (!this.isRemoteDataLoaded) {
      this.isRemoteDataLoaded = true;

      const { config, user } = await this.loadRemoteData();

      this.startingCSConfig = config;
      this.user = user;

      this.mountIframe(this.generatePageUrl(config));
    }
  }

  public hide() {
    this.openStatus = false;
  }

  private generatePageUrl(config: StaringChatConfig) {
    // let url = `${process.env.STARING_MTBIRD_BASE_URL}/${config.page}?`;
    let url = `${process.env.STARING_MTBIRD_BASE_URL}/${config.page}?`;

    url += queryStringify({
      ...config,
      botId: this.botId,
      t: this.user?.token || '',
    });

    return url;
  }

  private handleAnimationend(added: string, removed: string) {
    const animationend = () => {
      const holder = this.holder;
      holder.removeEventListener('animationend', animationend);
      added && holder.classList.add(added);
      removed && holder.classList.remove(removed);
    };

    const animationcancel = () => {
      console.log('cancel');
    };

    this.holder.addEventListener('animationend', animationend);
    this.holder.addEventListener('animationcancel', animationcancel);
  }

  public destroy() {
    const animationend = () => {
      this.holder.removeEventListener('animationend', animationend);
      document.body.removeChild(this.holder);
    };
    this.holder.addEventListener('animationend', animationend);
    this.handleAnimationend('', styles.fadeOut);
    this.holder.classList.add(styles.fadeOut);
  }
}

export default ChatHolder;
