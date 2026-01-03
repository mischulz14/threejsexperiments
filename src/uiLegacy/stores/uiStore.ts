import { Store } from '../core/Store';

export type UIState = {
  isSidebarOpen: boolean;
};

export const uiStore = new Store<UIState>({
  isSidebarOpen: true,
});
