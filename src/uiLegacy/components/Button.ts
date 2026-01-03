import { Component } from '../core/Component';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

type ButtonProps = {
  label?: string;
  variant?: ButtonVariant;
  className?: string;
  children?: (string | HTMLElement)[];
  onClick?: () => void;
};

const BASE_CLASSES = `
  inline-flex items-center justify-center gap-2 px-2 py-1
  whitespace-nowrap rounded-md
  text-sm font-medium
  cursor-pointer
`;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: `
    bg-gray-900 text-gray-200
    hover:bg-primary/90
  `,
  secondary: `
   text-gray-200
  `,
  outline: `
    border border-input 
  `,
};

export class Button extends Component<ButtonProps> {
  template() {
    const variant = this.props.variant ?? 'primary';

    return `
      <button
        class="${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${this.props.className} "
        type="button"
      >
        ${this.props.label}
      </button>
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
