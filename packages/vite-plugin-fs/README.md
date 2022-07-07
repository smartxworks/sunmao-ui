# @sunmao-ui/vite-plugin-fs

The vite plutin for sunmao to read and write the applications and modules schema files.

## Usage

You should enable the plugin in the `vite.config.js` first.

```js
import * as path from 'path';
import { defineConfig } from 'vite';
import sunmaoFsVitePlugin from '@sunmao-ui/vite-plugin-fs';
import routes from './src/routes';

export default defineConfig({
  plugins: [
    sunmaoFsVitePlugin({
      schemas: routes
        .filter(route => 'name' in route)
        .map(route => ({
          name: route.name,
          path: path.resolve(__dirname, `./src/applications/${route.name}.json`),
        })),
      modulesDir: path.resolve(__dirname, './src/modules'),
    }),
  ],
});
```

Read the schemas of the applications and the modules:

```ts
const PREFIX = '/sunmao-fs';

export async function fetchApp(name: string): Promise<Application> {
  const application = await (await fetch(`${PREFIX}/${name}`)).json();

  if (application.kind === 'Application') {
    return application;
  }

  throw new Error('failed to load schema');
}

export async function fetchModules(): Promise<Module[]> {
  const response = await (await fetch(`${PREFIX}/modules`)).json();

  if (Array.isArray(response)) {
    return response;
  }

  throw new Error('failed to load schema');
}

const [app, modules] = await Promise.all([fetchApp(name), fetchModules()]);
```

Modify the schemas:

```ts
export function saveApp(name: string, app: Application) {
  return fetch(`${PREFIX}/${name}`, {
    method: 'put',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      value: app,
    }),
  });
}

export function saveModules(modules: Module[]) {
  return fetch(`${PREFIX}/modules`, {
    method: 'put',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      value: modules,
    }),
  });
}

initSunmaoUIEditor({
  defaultApplication: app,
  defaultModules: modules,
  runtimeProps: config,
  storageHandler: {
    onSaveApp: function (app) {
      return saveApp(name, app);
    },
    onSaveModules: function (modules) {
      return saveModules(modules);
    },
  },
});
```
