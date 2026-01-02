import { Component } from '../core/Component';

type CardProps = {
  label?: string;
  className?: string;
  children?: (string | HTMLElement)[];
  onClick?: () => void;
};

export class ExperimentCard extends Component<CardProps> {
  template() {
    return `
      <div
        class="rounded-sm text-gray-400 px-2 py-1 hover:bg-gray-800 transition-all duration-200 cursor-pointer flex justify-center items-center gap-2 text-xs text-center"
      >
        ${this.props.label}
      </div>
    `;
  }

  mount() {
    if (this.props.onClick)
      this.root.addEventListener('click', this.props.onClick);

    if (this.props.label) {
      this.root.textContent = this.props.label;
    }

    if (this.props.children) {
      this.root.textContent = ''; // clear label if children exist
      for (const child of this.props.children) {
        if (typeof child === 'string') {
          // Parse string as HTML
          const template = document.createElement('template');
          template.innerHTML = child.trim();
          this.root.appendChild(template.content);
        } else {
          this.root.appendChild(child);
        }
      }
    }
  }
}
