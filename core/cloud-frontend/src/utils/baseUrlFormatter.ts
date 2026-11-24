export const httpsToSocketUrl = (url: string) =>
  url.replace("http://", "ws://").replace("https://", "wss://");
