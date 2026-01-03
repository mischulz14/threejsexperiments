import { uiStore } from '../stores/uiStore';

export abstract class Component<Props = unknown> {
  protected root!: HTMLElement;
  protected props: Props;
  private subscribe?: () => void;

  constructor(props: Props) {
    this.props = props;
  }

  abstract template(): string;
  abstract mount(): void;

  protected subscribeToUIStore(callback: (state: any) => void): void {
    this.subscribe = uiStore.subscribe(callback);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template().trim();

    const el = wrapper.firstElementChild;
    if (!el) {
      throw new Error('Component must have a root element');
    }

    this.root = el as HTMLElement;
    this.mount();
    return this.root;
  }

  destroy() {
    if (this.subscribe) {
      this.subscribe();
    }
    this.root.remove();
  }
}
