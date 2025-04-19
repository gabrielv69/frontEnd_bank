export type MessageType = 'success' | 'info' | 'error' | 'warning';
export interface Message {
  text: string;
  type: MessageType;
}
