import type { ImageboardActionType, ImageboardPayload } from "../actions/imageboard";
import type { BaseWSMessage } from "./base";

export interface ImageboardMessage extends BaseWSMessage {
  domain: 'imageboard';
  action: ImageboardActionType;
  data: ImageboardPayload<ImageboardActionType>;
}

