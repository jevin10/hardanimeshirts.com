import type { UserActionType, UserClientAction, UserPayload, UserServerAction } from "../actions/user";
import type { BaseWSMessage } from "./base";

export interface UserMessage extends BaseWSMessage {
  domain: 'user';
  action: UserActionType;
  data: UserPayload<UserActionType>;
}

export type RequestUserDataMessage = UserMessage & {
  action: 'request_user_data';
  data: UserClientAction['request_user_data'];
};

export type UserDataResponse = UserMessage & {
  action: 'user_data_response';
  data: UserServerAction['user_data_response'];
};
