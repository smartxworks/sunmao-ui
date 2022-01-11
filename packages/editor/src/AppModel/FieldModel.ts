import { parseExpression } from '@sunmao-ui/runtime';
import * as acorn from 'acorn';
import * as acornLoose from 'acorn-loose';
import { simple as simpleWalk } from 'acorn-walk';
import { flattenDeep, isArray, isObject, isPlainObject } from 'lodash-es';
import { ComponentId, IFieldModel, ModuleId } from './IAppModel';

(window as any).acorn = acorn;
(window as any).acornLoose = acornLoose;
(window as any).simpleWalk = simpleWalk;

const regExp = new RegExp('.*{{.*}}.*');

isPlainObject

export class FieldModel implements IFieldModel {
  private value: unknown | Array<IFieldModel> | Record<string, IFieldModel>;
  isDynamic = false;
  refs: Array<ComponentId | ModuleId> = [];

  constructor(value: unknown) {
    this.update(value);
  }

  get rawValue() {
    if (isObject(this.value)) {
      if (isArray(this.value)) {
        return this.value.map((field) => field.rawValue)
      } else {
        const _thisValue = this.value as Record<string, IFieldModel>;
        const res: Record<string, any> = {};
        for (const key in _thisValue) {
          res[key] = _thisValue[key].rawValue;
        }
        return res;
      }
    }
    return this.value;
  }

  update(value: unknown) {
    if (isObject(value)) {
      if (!isObject(this.value)) {
        this.value = isArray(value) ? [] : {}
      }

      for (const key in value) {
        const val = (value as Record<string, unknown>)[key];
        const _thisValue = this.value as Record<string, IFieldModel>;
        if (!_thisValue[key]) {
          _thisValue[key] = new FieldModel(val);
        } else {
          _thisValue[key].update(val);
        }
      }
    } else {
      this.value = value;
    }
    this.isDynamic = typeof value === 'string' && regExp.test(value);
    this.parseReferences();
  }

  getProperty(key?: string | number): FieldModel | unknown {
    if (key === undefined) {
      return this.value;
    }
    if (key !== undefined && typeof this.value === 'object') {
      return (this.value as any)[key];
    }
    return undefined;
  }

  traverse(cb: (f: IFieldModel, key: string) => void) {
    function _traverse(field: FieldModel, key: string) {
      if (isObject(field.value)) {
        for (const _key in field.value) {
          const val = field.getProperty(_key)
          if (val instanceof FieldModel) {
            _traverse(val, `${key}.${_key}`)
          }
        }
      } else {
        cb(field, key)
      }
    }
    _traverse(this, '')
  }

  private parseReferences() {
    if (!this.isDynamic || typeof this.value !== 'string') return;

    const refs: string[] = [];
    const exps = flattenDeep(
      parseExpression(this.value as string).filter(exp => typeof exp !== 'string')
    );

    exps.forEach(exp => {
      simpleWalk(acornLoose.parse(exp, { ecmaVersion: 2020 }), {
        Identifier: node => {
          refs.push(exp.slice(node.start, node.end));
        },
      });
    });
    this.refs = refs as Array<ComponentId | ModuleId>;
  }
}
