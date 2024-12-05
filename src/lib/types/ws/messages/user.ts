import type { UserActionType, UserPayload } from "../actions/user";
import type { BaseWSMessage } from "./base";

export interface UserMessage extends BaseWSMessage {
  domain: 'user';
  action: UserActionType;
  data: UserPayload<UserActionType>;
}
