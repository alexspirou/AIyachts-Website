import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import connection from '../sanity.config.json';
import {yacht} from './schemaTypes/yacht.js';

export default defineConfig({
  name: 'aiyachts',
  title: 'AIyachts fleet',
  projectId: connection.projectId,
  dataset: connection.dataset,
  plugins: [structureTool()],
  schema: {types: [yacht]},
});
