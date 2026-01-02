import { Component } from '../core/Component';
import { uiStore } from '../stores/uiStore';

type SidebarProps = {
  children?: (string | HTMLElement | Component)[];
};

export class Sidebar extends Component<SidebarProps> {
  template() {
    return `<aside class="w-32 rounded-sm bg-[#28292e] flex flex-col gap-2 fixed top-2 bottom-2 left-2 transition-all duration-200 overflow-hidden"></aside>`;
  }

  mount() {
    if (!this.props.children) return;

    this.root.textContent = ''; // clear any placeholder

    for (const child of this.props.children) {
      if (typeof child === 'string') {
        this.root.appendChild(document.createTextNode(child));
      } else if (child instanceof Component) {
        this.root.appendChild(child.render());
      } else {
        this.root.appendChild(child);
      }
    }

    // Subscribe to store changes
    this.subscribeToUIStore((state) => {
      this.updateVisibility(state.isSidebarOpen);
    });

    // Set initial state
    this.updateVisibility(uiStore.getState().isSidebarOpen);
  }

  private updateVisibility(isOpen: boolean): void {
    if (isOpen) {
      this.root.classList.remove('w-8', 'h-8', 'justify-center');
      this.root.classList.add('w-32');
    } else {
      this.root.classList.remove('w-32');
      this.root.classList.add('w-8', 'h-8', 'justify-center');
    }
  }
}
