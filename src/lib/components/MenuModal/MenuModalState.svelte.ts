import { getContext, setContext } from "svelte";

export class MenuModalState {
  isVisible: boolean = $state(false);
  page: 'main' | 'invite' = $state('main');

  constructor() { }

  closeModal() {
    this.page = 'main';
    this.isVisible = false;
  }

  openModal() {
    this.isVisible = true;
  }
}

const MENUMODAL_CTX = 'MENUMODAL_CTX';

export function setMenuModalState() {
  const menuModalState = new MenuModalState();
  setContext(MENUMODAL_CTX, menuModalState);
  return menuModalState;
}

export function getMenuModalState() {
  return getContext<MenuModalState>(MENUMODAL_CTX);
}
