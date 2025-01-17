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

export type RequestProgressMessage = UserMessage & {
  action: 'request_progress';
  data: UserClientAction['request_progress'];
}

export type RequestPostsMessage = UserMessage & {
  action: 'request_posts';
  data: UserClientAction['request_posts'];
}

export type UserDataResponse = UserMessage & {
  action: 'user_data_response';
  data: UserServerAction['user_data_response'];
};

export type UserProgressResponse = UserMessage & {
  action: 'progress_response';
  data: UserServerAction['progress_response'];
}

export type UserPostsResponse = UserMessage & {
  action: 'posts_response';
  data: UserServerAction['posts_response'];
}
