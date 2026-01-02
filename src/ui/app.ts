import { EXPERIMENTS } from '../constants/Constants';
import { Button } from './components/Button';
import { ExperimentCard } from './components/ExperimentCard';
import { Sidebar } from './components/Sidebar';
import { uiStore } from './stores/uiStore';

export function createApp() {
  const hideSidebarButton = new Button({
    onClick: () => {
      const { isSidebarOpen: sidebarOpen } = uiStore.getState();
      uiStore.setState({ isSidebarOpen: !sidebarOpen });
    },
    className: '!bg-[#28292e] !rounded-none',
    children: [
      `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 ml-auto">
     <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
    </svg>
    `,
    ],
  });

  const experimentCards = EXPERIMENTS.map(
    (ex) =>
      new ExperimentCard({
        label: ex.name,
        onClick() {
          // attach url to url pathname and reload page with url
          const url = new URL(window.location.href);
          url.pathname = ex.url;
          window.location.href = url.href;
        },
      }),
  );

  const cardContainer = document.createElement('div');
  cardContainer.className = 'experiment-cards-container flex flex-col gap-2';
  experimentCards.forEach((card) => {
    cardContainer.appendChild(card.render());
  });

  const sidebar = new Sidebar({
    children: [hideSidebarButton.render(), cardContainer],
  });

  document.body.appendChild(sidebar.render());
}
