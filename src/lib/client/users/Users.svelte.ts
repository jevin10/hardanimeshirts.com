import { getContext, setContext } from "svelte";
import { UserData } from "./UserData.svelte";
import type { Imageboard } from "../imageboard/Imageboard.svelte";
import type { User } from "lucia";
import { SvelteMap } from "svelte/reactivity";

interface UsersDeps {
  imageboardState: Imageboard;
  currentUser: User | null;
}

export class Users {
  private imageboardState: Imageboard;
  users: SvelteMap<string, UserData> = $state(new SvelteMap());
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

  createUserData(userId: string, username: string): UserData {
    const userData = new UserData({
      userId,
      username
    }, this.imageboardState);
    this.addUserData(userData);
    return userData;
  }

  addUserData(userData: UserData) {
    if (this.users.has(userData.id.username)) {
      console.log('[Users] UserData already exists in map, not adding');
      return;
    }
    console.log('[Users] Adding UserData to map');
    this.users.set(userData.id.username, userData);
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
