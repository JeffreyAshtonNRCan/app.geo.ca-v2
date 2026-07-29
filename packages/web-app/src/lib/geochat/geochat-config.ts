export interface GeoChatConfig {
  chatApiUrl: string;
  chatHistoryUrl: string;
}

let config: GeoChatConfig = {
  chatApiUrl: 'https://0y633i08af.execute-api.ca-central-1.amazonaws.com/staging/chat',
  chatHistoryUrl: 'https://0y633i08af.execute-api.ca-central-1.amazonaws.com/staging/chathistory',
};

export function setGeoChatConfig(newConfig: GeoChatConfig) {
  config = newConfig;
}

export function getGeoChatConfig(): GeoChatConfig {
  return config;
}
