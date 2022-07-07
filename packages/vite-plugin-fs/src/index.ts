import { Plugin } from 'vite';
import * as fs from 'fs';
import bodyParser from 'body-parser';
import { Buffer } from 'buffer';

type Options = {
  schemas: { path: string; name: string }[];
  modulesDir: string;
};

const PREFIX = '/sunmao-fs';

const sunmaoFsVitePlugin: (options: Options) => Plugin = options => {
  return {
    name: 'sunmao-fs-server',
    configureServer(server) {
      server.middlewares.use(PREFIX, bodyParser.json({ limit: '10mb' }));

      options.schemas.forEach(({ name, path }) => {
        server.middlewares.use(`${PREFIX}/${name}`, (req, res) => {
          switch (req.method?.toLowerCase()) {
            case 'get': {
              res.end(fs.readFileSync(path, 'utf-8'));
              break;
            }
            case 'put': {
              const { value } = (req as any).body;

              fs.writeFileSync(path, JSON.stringify(value, null, 2));
              res.end(JSON.stringify({ result: 'done' }));
              break;
            }
            default:
              res.end('invalid method');
          }
        });
      });

      server.middlewares.use(`${PREFIX}/modules`, async (req, res) => {
        const moduleFiles = fs
          .readdirSync(options.modulesDir)
          .filter(moduleFile => moduleFile.includes('.json'));

        switch (req.method?.toLowerCase()) {
          case 'get': {
            const moduleSchemas = await Promise.all(
              moduleFiles.map(async moduleFile => {
                const schema = JSON.parse(
                  await fs.promises.readFile(`${options.modulesDir}/${moduleFile}`, {
                    encoding: 'utf-8',
                  })
                );

                return schema;
              })
            );

            res.end(Buffer.from(JSON.stringify(moduleSchemas)));
            break;
          }
          case 'put': {
            const oldModuleNames = moduleFiles.map(fileName => fileName.split('.')[0]);
            const { value } = (req as any).body;
            const names = value.map(
              (schema: Record<string, any>) => schema.metadata.name
            );

            if (moduleFiles.length < value.length) {
              // add module
              const newModule = value[value.length - 1];

              fs.writeFileSync(
                `${options.modulesDir}/${newModule.metadata.name}.json`,
                JSON.stringify(newModule, null, 2)
              );
            } else if (moduleFiles.length > value.length) {
              // remove module
              const deletedModule = oldModuleNames.find(
                oldName => !names.includes(oldName)
              );

              fs.rmSync(`${options.modulesDir}/${deletedModule}.json`);
            } else {
              // update module
              await Promise.all(
                moduleFiles.map(async fileName => {
                  const oldModuleName = fileName.split('.')[0];
                  const schema = value.find(
                    (moduleSchema: Record<string, any>) =>
                      moduleSchema.metadata.name === oldModuleName
                  );

                  if (schema) {
                    return fs.promises.writeFile(
                      `${options.modulesDir}/${fileName}`,
                      JSON.stringify(schema, null, 2)
                    );
                  } else {
                    const newName = names.find(
                      (name: string) => !oldModuleNames.includes(name)
                    );

                    return fs.promises.rename(
                      `${options.modulesDir}/${fileName}`,
                      `${options.modulesDir}/${newName}.json`
                    );
                  }
                })
              );
            }

            res.end(JSON.stringify({ result: 'done' }));
            break;
          }
          default:
            res.end('invalid method');
        }
      });
    },
  };
};

export default sunmaoFsVitePlugin;
