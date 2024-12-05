import { getContext, setContext } from "svelte";
import type { UserData } from "./UserData.svelte";

export class Users {
  users: Map<string, UserData> = $state(new Map());
  currentUserData: UserData | null = $state(null);

  constructor(currentUserData: UserData | null) {
    console.log('[Users] Constructed');
    // set currentUserData if exists
    if (currentUserData) {
      this.currentUserData = currentUserData;
      this.addUserData(currentUserData);
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

export function setUsersState(currentUserData: UserData | null) {
  const usersState = new Users(currentUserData);
  setContext(USERS_CTX, usersState);
  return usersState;
}

export function getUsersState() {
  return getContext<Users>(USERS_CTX);
}
