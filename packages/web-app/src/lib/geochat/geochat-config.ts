export interface GeoChatConfig {
  chatApiUrl: string;
  chatHistoryUrl: string;
  warmUpUrl: string;
  chatHistoryVerifyUrl: string;
}

let config: GeoChatConfig = {
  chatApiUrl: 'https://0y633i08af.execute-api.ca-central-1.amazonaws.com/staging/chat',
  chatHistoryUrl: 'https://0y633i08af.execute-api.ca-central-1.amazonaws.com/staging/chathistory',
  warmUpUrl: 'https://0y633i08af.execute-api.ca-central-1.amazonaws.com/staging/warmup',
  chatHistoryVerifyUrl: 'https://0y633i08af.execute-api.ca-central-1.amazonaws.com/staging/chathistory/verify',
};

export function setGeoChatConfig(newConfig: GeoChatConfig) {
  config = newConfig;
}

export function getGeoChatConfig(): GeoChatConfig {
  return config;
}
