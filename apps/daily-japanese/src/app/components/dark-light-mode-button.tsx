import { SunIcon, MoonIcon } from '@heroicons/react/solid';
import {
  SunIcon as SunOutline,
  MoonIcon as MoonOutline,
} from '@heroicons/react/outline';

export function DarkLightModeBtn() {
  function toggleDarkMode(): void {
    document.body.classList.toggle('dark');
    const sunIcon = document.querySelector('#sun-icon');
    const moonIcon = document.querySelector('#moon-icon');
    const button = document.querySelector('#dark-mode-toggle-button');
    const sunMoonClassesToToggle = ['hidden', 'fill-yellow-400'];
    const buttonClasses = [
      'translate-x-[15%]',
      'translate-x-[85%]',
      'bg-white',
      'bg-gray-200',
    ];

    buttonClasses.map((x) => button?.classList.toggle(x));
    sunMoonClassesToToggle.map((x) => [
      sunIcon?.classList.toggle(x),
      moonIcon?.classList.toggle(x),
    ]);
  }
  return (
    <div className="relative">
      <button
        className="flex justify-center absolute w-12 rounded-full  bg-gray-200 h-6 top-2/4 -translate-y-2/4 translate-x-[85%] transition-all ease-in-out duration-300"
        onClick={toggleDarkMode}
        id="dark-mode-toggle-button"
      >
        <SunIcon className="hidden w-4" id="sun-icon" />
        <MoonIcon className="w-4 fill-yellow-400" id="moon-icon" />
      </button>
      <div className="flex justify-around w-24 p-[3px] h-9 rounded-full bg-gray-200 dark:bg-gray-800">
        <SunOutline className="w-5" />
        <MoonOutline className="w-5" />
      </div>
    </div>
  );
}
