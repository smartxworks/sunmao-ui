import { Module } from '@sunmao-ui/core';
import * as acorn from 'acorn';
import * as acornLoose from 'acorn-loose';
import { simple as simpleWalk } from 'acorn-walk';

const ModuleIdPrefix = '{{ $moduleId }}__';

type StringPos = {
  start: number;
  end: number;
  replaceStr: string;
};

// add {{$moduleId}} in moduleSchema
export function addModuleId(module: Module): Module {
  const ids: string[] = [];
  module.impl.forEach(c => {
    ids.push(c.id);
    if (c.type === 'core/v1/moduleContainer') {
      ids.push(c.properties.id as string);
    }

    if (c.type === 'chakra_ui/v1/list') {
      ids.push((c.properties.template as any).id);
    }
  });
  function traverse(tree: Record<string, any>) {
    for (const key in tree) {
      const val = tree[key];
      if (typeof val === 'string') {
        if (ids.includes(val)) {
          tree[key] = `${ModuleIdPrefix}${val}`;
        } else {
          const newField = replaceProperty(val, ids);
          tree[key] = newField;
        }
      } else if (typeof val === 'object') {
        traverse(val);
      }
    }
  }

  traverse(module.impl);
  traverse(module.spec.stateMap);
  return module;
}

// remove {{$moduleId}} in moduleSchema
export function removeModuleId(module: Module): Module {
  function traverse(tree: Record<string, any>) {
    for (const key in tree) {
      const val = tree[key];
      if (typeof val === 'string') {
        tree[key] = val.replaceAll(ModuleIdPrefix, '');
      } else if (typeof val === 'object') {
        traverse(val);
      }
    }
  }

  traverse(module.impl);
  traverse(module.spec.stateMap);
  return module;
}

function replaceExp(exp: string, ids: string[]): string | void {
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
    null;
  }
  const newExp = identifierPos.reverse().reduce((result, { start, end, replaceStr }) => {
    return result.slice(0, start) + `${replaceStr}` + result.slice(end);
  }, exp);

  return newExp;
}

function replaceProperty(property: string, ids: string[]): string {
  const expRegExp = new RegExp('{{(.*?)}}', 'g');
  const matches = [...property.matchAll(expRegExp)];

  if (matches.length === 0) return property;

  const expPos: StringPos[] = [];
  matches.forEach(match => {
    const newExp = replaceExp(match[1], ids);
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
