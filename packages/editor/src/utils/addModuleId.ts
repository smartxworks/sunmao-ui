import { Module } from '@sunmao-ui/core';
import * as acorn from 'acorn';
import * as acornLoose from 'acorn-loose';
import { simple as simpleWalk } from 'acorn-walk';
import produce from 'immer';
import { CORE_VERSION, CoreComponentName } from '@sunmao-ui/shared';

const ModuleIdPrefix = '{{ $moduleId }}__';

type StringPos = {
  start: number;
  end: number;
  replaceStr: string;
};

// add {{$moduleId}} in moduleSchema
export function addModuleId(originModule: Module): Module {
  return produce(originModule, module => {
    const ids: string[] = [];
    module.impl.forEach(c => {
      ids.push(c.id);
      if (c.type === `${CORE_VERSION}/${CoreComponentName.ModuleContainer}`) {
        ids.push(c.properties.id as string);
      }

      if (c.type === 'chakra_ui/v1/list') {
        ids.push((c.properties.template as any).id);
      }
    });
    function traverse(tree: Record<string, any>, isValueExp = false) {
      for (const key in tree) {
        const val = tree[key];
        if (typeof val === 'string') {
          if (isValueExp) {
            // case 1: value is expression, replace it
            const newField = replaceIdsInExp(val, ids);
            tree[key] = newField;
          } else if (ids.includes(val)) {
            // case 2: value is equal to a component id
            tree[key] = `${ModuleIdPrefix}${val}`;
          } else {
            // case 3: value is normal string, try to replace the componentIds in this string
            const newField = replaceIdsInProperty(val, ids);
            tree[key] = newField;
          }
        } else if (typeof val === 'object') {
          // case 4: value is object, recurse it
          traverse(val, isValueExp);
        }
      }
    }

    traverse(module.impl);
    // value of stateMap is expression, not property
    traverse(module.spec.stateMap, true);
    traverse(module.spec.methods, true);
  });
}

// remove '{{$moduleId}}__' in moduleSchema
export function removeModuleId(originModule: Module): Module {
  return produce(originModule, module => {
    function traverse(tree: Record<string, any>) {
      for (const key in tree) {
        const val = tree[key];
        if (typeof val === 'string') {
          tree[key] = val.replace(/{{ \$moduleId }}__/g, '');
        } else if (typeof val === 'object') {
          traverse(val);
        }
      }
    }

    traverse(module.impl);
    traverse(module.spec.stateMap);
    traverse(module.spec.methods);
  });
}

// example: replaceIdsInExp('{{input1.value}} + {{input2.value}}', ids: ['input1']])
export function replaceIdsInProperty(property: string, ids: string[]): string {
  const matches = [...property.matchAll(/{{((.|\n)*?)}}/g)];

  if (matches.length === 0) return property;

  const expPos: StringPos[] = [];
  matches.forEach(match => {
    const newExp = replaceIdsInExp(match[1], ids);
    if (newExp) {
      expPos.push({
        // + 2 because of '{{' length is 2
        start: match.index! + 2,
        end: match.index! + 2 + match[1].length,
        replaceStr: newExp,
      });
    }
  });
  if (expPos.length === 0) return property;

  return expPos.reverse().reduce((result, { start, end, replaceStr }) => {
    return result.slice(0, start) + `${replaceStr}` + result.slice(end);
  }, property);
}

// example: replaceIdsInExp('input1.value', ids: ['input1']])
function replaceIdsInExp(exp: string, ids: string[]): string | void {
  const identifierPos: StringPos[] = [];
  simpleWalk((acornLoose as typeof acorn).parse(exp, { ecmaVersion: 2020 }), {
    Identifier: node => {
      const objectName = exp.slice(node.start, node.end);
      if (ids.includes(objectName)) {
        identifierPos.push({
          start: node.start,
          end: node.end,
          replaceStr: `${ModuleIdPrefix}${objectName}`,
        });
      }
    },
  });

  if (identifierPos.length === 0) {
    return exp;
  }
  const newExp = identifierPos.reverse().reduce((result, { start, end, replaceStr }) => {
    return result.slice(0, start) + `${replaceStr}` + result.slice(end);
  }, exp);

  return newExp;
}
