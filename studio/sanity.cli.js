import {defineCliConfig} from 'sanity/cli';
import connection from '../sanity.config.json';

export default defineCliConfig({
  api: {
    projectId: connection.projectId,
    dataset: connection.dataset,
  },
});
