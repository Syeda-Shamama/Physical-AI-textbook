import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'An AI-Native Textbook — Embodied Intelligence for the Real World',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://Syeda-Shamama.github.io',
  baseUrl: '/Physical-AI-textbook/',

  organizationName: 'Syeda-Shamama',
  projectName: 'Physical-AI-textbook',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI & Robotics',
      logo: {
        alt: 'Physical AI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'textbookSidebar',
          position: 'left',
          label: 'Textbook',
        },
        {
          to: '/signup',
          label: 'Sign Up',
          position: 'right',
        },
        {
          to: '/login',
          label: 'Sign In',
          position: 'right',
        },
        {
          href: 'https://github.com/Syeda-Shamama/Physical-AI-textbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Modules',
          items: [
            {label: 'Module 1: ROS 2', to: '/module1/intro'},
            {label: 'Module 2: Gazebo & Unity', to: '/module2/intro'},
            {label: 'Module 3: NVIDIA Isaac', to: '/module3/intro'},
            {label: 'Module 4: VLA', to: '/module4/intro'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'Panaversity', href: 'https://panaversity.org'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Panaversity. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
