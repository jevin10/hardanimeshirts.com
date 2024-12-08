import { getContext, setContext } from "svelte";

export class AuthModalState {
  isVisible: boolean = $state(false);
  loginForm: {
    username: string;
    password: string;
  } = $state({ username: '', password: '' });
  signupForm: {
    username: string;
    password: string;
    inviteCode: string;
  } = $state({ username: '', password: '', inviteCode: '' });

  constructor() { }

  closeModal() {
    this.loginForm = { username: '', password: '' };
    this.signupForm = { username: '', password: '', inviteCode: '' };
    this.isVisible = false;
  }

  openModal() {
    this.isVisible = true;
  }

  async submitLogin() {
    try {
      const formData = new FormData();
      console.log(this.loginForm.username);
      formData.append('username', this.loginForm.username);
      formData.append('password', this.loginForm.password);

      const response = await fetch('/api/login', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Login failed');
      }

      // If successful, close the modal
      this.closeModal();
      // redirect
      window.location.href = '/';
    } catch (err) {
      console.error('Login submission failed:', err);
      throw err; // Re-throw to handle in the UI
    }
  }

  async submitSignup() {
    try {
      const formData = new FormData();
      formData.append('username', this.signupForm.username);
      formData.append('password', this.signupForm.password);
      formData.append('inviteCode', this.signupForm.inviteCode);

      const response = await fetch('/api/signup', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup submission failed:', err);
      throw err;
    }
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

