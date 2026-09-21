import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://diegodella.ar',
  output: 'static',
  build: { format: 'file' },
  compressHTML: false,
  integrations: [mdx()],
  markdown: { syntaxHighlight: false, processor: satteri({ features: { smartPunctuation: false } }) },
  devToolbar: { enabled: false },
});
