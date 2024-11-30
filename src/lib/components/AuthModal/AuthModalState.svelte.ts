import { getContext, setContext } from "svelte";

export class AuthModalState {
  isVisible: boolean = $state(true);
  loginForm: {
    username: string;
    password: string;
  } = $state({ username: '', password: '' });
  signupForm: {
    username: string;
    password: string;
    inviteCode: string;
  } = $state({ username: '', password: '', inviteCode: '' });

  constructor() { };

  closeModal() {
    // Reset all form values to defaults
    this.loginForm = { username: '', password: '' };
    this.signupForm = { username: '', password: '', inviteCode: '' };
    this.isVisible = false;
  }

  openModal() {
    this.isVisible = true;
  }
}

const AUTHMODAL_CTX = 'AUTHMODAL_CTX';

export function setAuthModalState() {
  const authModalState = new AuthModalState();
  setContext(AUTHMODAL_CTX, authModalState);
  return authModalState;
}

export function getAuthModalState() {
  return getContext<AuthModalState>(AUTHMODAL_CTX);
}

