import { parseExpression } from '@sunmao-ui/runtime';
import * as acorn from 'acorn';
import * as acornLoose from 'acorn-loose';
import { simple as simpleWalk } from 'acorn-walk';
import { flattenDeep } from 'lodash-es';
import { ComponentId, IFieldModel, ModuleId } from './IAppModel';

(window as any).acorn = acorn;
(window as any).acornLoose = acornLoose;
(window as any).simpleWalk = simpleWalk;

const regExp = new RegExp('.*{{.*}}.*');

export class FieldModel implements IFieldModel {
  value: any;
  isDynamic = false;
  refs: Array<ComponentId | ModuleId> = [];

  constructor(value: unknown) {
    this.update(value);
  }

  update(value: unknown) {
    this.value = value;
    this.isDynamic = typeof value === 'string' && regExp.test(value);
    this.parseReferences();
  }

  parseReferences() {
    if (!this.isDynamic || typeof this.value !== 'string') return;

    const refs: string[] = [];
    const exps = flattenDeep(parseExpression(this.value as string).filter(exp => typeof exp !== 'string'))

    exps.forEach(exp => {
      simpleWalk(acornLoose.parse(exp, acorn.defaultOptions), {
        Identifier: node => {
          console.log('node', node);
          refs.push(exp.slice(node.start, node.end));
        },
      });
    })
    this.refs = refs as Array<ComponentId | ModuleId>;
    console.log('this.refs', this.refs)
  }
}
