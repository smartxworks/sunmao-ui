import { parseExpression, expChunkToString } from '@sunmao-ui/shared';
import * as acorn from 'acorn';
import * as acornLoose from 'acorn-loose';
import { simple as simpleWalk } from 'acorn-walk';
import { flattenDeep, isArray, isObject } from 'lodash-es';
import { isExpression } from '../validator/utils';
import {
  ComponentId,
  IAppModel,
  IComponentModel,
  IFieldModel,
  ModuleId,
  RefInfo,
} from './IAppModel';
import escodegen from 'escodegen';

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

export class FieldModel implements IFieldModel {
  isDynamic = false;
  refs: Record<ComponentId | ModuleId, RefInfo> = {};
  private nodes: Record<string, acorn.Node> = {};
  private value: unknown | Array<IFieldModel> | Record<string, IFieldModel>;

  constructor(
    value: unknown,
    public appModel?: IAppModel,
    public componentModel?: IComponentModel
  ) {
    this.update(value);
    this.appModel?.emitter.on('idChange', this.onReferenceIdChange.bind(this));
  }

  get rawValue() {
    if (isObject(this.value)) {
      if (isArray(this.value)) {
        return this.value.map(field => field.rawValue);
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

  private updateValue(value: unknown, shouldExtendValues = true) {
    if (isObject(value)) {
      const isArrayValue = isArray(value);
      const isOldValueObject = isObject(this.value);

      this.value = (Object.keys(value) as Array<keyof typeof value>).reduce(
        (result, key) => {
          const oldValue: IFieldModel | null = isObject(this.value)
            ? this.value[key]
            : null;
          let newValue: FieldModel;

          if (oldValue) {
            (oldValue as FieldModel).updateValue(value[key], false);
            newValue = oldValue;
          } else {
            newValue = new FieldModel(value[key], this.appModel, this.componentModel);
          }

          if (isArray(result)) {
            result.push(newValue);
          } else {
            result[key] = newValue;
          }

          return result;
        },
        (isArrayValue
          ? []
          : shouldExtendValues && isOldValueObject
          ? this.value
          : {}) as Record<string, IFieldModel>
      );
    } else {
      this.value = value;
    }
    this.isDynamic = isExpression(value);
    this.parseReferences();
  }

  update(value: unknown) {
    this.updateValue(value);
  }

  getProperty(key: string | number): FieldModel | undefined {
    if (typeof this.value === 'object') {
      return (this.value as any)[key];
    }
    return undefined;
  }

  getValue() {
    return this.value;
  }

  traverse(cb: (f: IFieldModel, key: string) => void) {
    function _traverse(field: FieldModel, key: string) {
      if (isObject(field.value)) {
        for (const _key in field.value) {
          const val = field.getProperty(_key);
          if (val instanceof FieldModel) {
            _traverse(val, `${key}.${_key}`);
          }
        }
      } else {
        cb(field, key);
      }
    }
    _traverse(this, '');
  }

  private parseReferences() {
    if (!this.isDynamic || typeof this.value !== 'string') return;

    const exps = flattenDeep(
      parseExpression(this.value as string).filter(exp => typeof exp !== 'string')
    );

    this.refs = {};
    this.nodes = {};

    exps.forEach(exp => {
      let lastIdentifier: ComponentId = '' as ComponentId;
      const node = (acornLoose as typeof acorn).parse(exp, { ecmaVersion: 2020 });

      this.nodes[exp] = node;

      simpleWalk(node, {
        Expression: expressionNode => {
          switch (expressionNode.type) {
            case 'Identifier':
              const key = exp.slice(
                expressionNode.start,
                expressionNode.end
              ) as ComponentId;

              if (this.refs[key]) {
                this.refs[key].nodes.push(expressionNode as Flatten<RefInfo['nodes']>);
              } else {
                this.refs[key] = {
                  nodes: [expressionNode as Flatten<RefInfo['nodes']>],
                  properties: [],
                };
              }
              lastIdentifier = key;

              break;
            case 'MemberExpression':
              const str = exp.slice(expressionNode.start, expressionNode.end);
              let path = str.replace(lastIdentifier, '');
              if (path.startsWith('.')) {
                path = path.slice(1, path.length);
              }
              this.refs[lastIdentifier]?.properties.push(path);
              break;
            default:
          }
        },
      });
    });
  }

  onReferenceIdChange({ oldId, newId }: { oldId: ComponentId; newId: ComponentId }) {
    if (!(this.refs[oldId] && this.componentModel)) {
      return;
    }

    const exps = parseExpression(this.value as string);
    const newExps = exps.map(exp => {
      const node = this.nodes[exp.toString()];

      if (node) {
        const ref = this.refs[oldId];

        ref.nodes.forEach(refNode => {
          refNode.name = newId;
        });

        this.refs[newId] = ref;
        delete this.refs[oldId];

        return [escodegen.generate(node)];
      }

      return exp;
    });
    const value = expChunkToString(newExps);

    this.componentModel._isDirty = true;
    this.update(value);
  }
}
