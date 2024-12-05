import { getContext, setContext } from "svelte";
import { UserData } from "./UserData.svelte";
import type { Imageboard } from "../imageboard/Imageboard.svelte";
import type { User } from "lucia";

interface UsersDeps {
  imageboardState: Imageboard;
  currentUser: User | null;
}

export class Users {
  private imageboardState: Imageboard;
  users: Map<string, UserData> = $state(new Map());
  currentUserData: UserData | null = $state(null);

  constructor(deps: UsersDeps) {
    console.log('[Users] Constructed');
    this.imageboardState = deps.imageboardState;
    // set currentUserData if exists
    if (deps.currentUser) {
      this.currentUserData = new UserData({
        userId: deps.currentUser.id,
        username: deps.currentUser.username,
      }, this.imageboardState);
      this.addUserData(this.currentUserData);
    }
  }

  addUserData(userData: UserData) {
    if (this.users.has(userData.id.userId)) {
      console.log('[Users] UserData already exists in map, not adding');
      return;
    }
    this.users.set(userData.id.userId, userData);
  }
}

const USERS_CTX = 'USERS_CTX';

export function setUsersState(deps: UsersDeps) {
  const usersState = new Users(deps);
  setContext(USERS_CTX, usersState);
  return usersState;
}

export function getUsersState() {
  return getContext<Users>(USERS_CTX);
}
