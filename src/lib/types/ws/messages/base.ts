import type { Domain } from "../domains";
import type { ImageboardMessage } from "./imageboard";
import type { UserMessage } from "./user";

export interface BaseWSMessage {
  domain: Domain;
  action: string;
  data: unknown;
}

export interface ServerResponseMessage extends BaseWSMessage {
  type: 'server-response';
  data: {
    originalMessage: BaseWSMessage;
    serverTimestamp: string;
  }
}


export type WSMessage = ImageboardMessage | ServerResponseMessage | UserMessage;

