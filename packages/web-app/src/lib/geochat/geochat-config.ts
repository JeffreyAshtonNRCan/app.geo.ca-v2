export interface GeoChatConfig {
  appUrl: string;
  chatApiUrl: string;
  chatHistoryUrl: string;
  chatWarmUpUrl: string;
  chatHistoryVerifyUrl: string;
}

let config: GeoChatConfig = {
  appUrl: 'https://stage.app.geo.ca',
  chatApiUrl: 'https://0y633i08af.execute-api.ca-central-1.amazonaws.com/staging/chat',
  chatHistoryUrl: 'https://0y633i08af.execute-api.ca-central-1.amazonaws.com/staging/chathistory',
  chatWarmUpUrl: 'https://0y633i08af.execute-api.ca-central-1.amazonaws.com/staging/warmup',
  chatHistoryVerifyUrl: 'https://0y633i08af.execute-api.ca-central-1.amazonaws.com/staging/chathistory/verify',
};

export function setGeoChatConfig(newConfig: GeoChatConfig) {
  config = newConfig;
}

export function getGeoChatConfig(): GeoChatConfig {
  return config;
}
