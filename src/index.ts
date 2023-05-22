import Chat from './Chat';
import { queryParse } from './utils';

const main = () => {
  const currentSrc = (document.currentScript as HTMLScriptElement).src;

  const options: any = {
    ...(window as any).StaringChatConfig,
    ...queryParse(currentSrc?.split?.('?').pop()),
  };

  const chatSDK = new Chat(options);
  chatSDK.init();
};

main();
