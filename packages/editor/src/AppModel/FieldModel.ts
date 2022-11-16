import { parseExpression, expChunkToString } from '@sunmao-ui/shared';
import { CustomOptions } from '@sinclair/typebox';
import * as acorn from 'acorn';
import * as acornLoose from 'acorn-loose';
import { simple as simpleWalk } from 'acorn-walk';
import { flattenDeep, isArray, isObject } from 'lodash';
import { isExpression } from '../validator/utils';
import {
  ComponentId,
  IComponentModel,
  ITraitModel,
  IFieldModel,
  ModuleId,
  RefInfo,
  ASTNode,
} from './IAppModel';
import escodegen from 'escodegen';
import { JSONSchema7 } from 'json-schema';

export type FunctionNode = ASTNode & { params: ASTNode[] };
export type DeclaratorNode = ASTNode & { id: ASTNode };
export type ObjectPatternNode = ASTNode & { properties: PropertyNode[] };
export type ArrayPatternNode = ASTNode & { elements: ASTNode[] };
export type PropertyNode = ASTNode & { value: ASTNode };
export type LiteralNode = ASTNode & { raw: string };
export type SequenceExpressionNode = ASTNode & { expressions: LiteralNode[] };
export type ExpressionNode = ASTNode & {
  object: ExpressionNode;
  property: ExpressionNode | LiteralNode;
};
export class FieldModel implements IFieldModel {
  isDynamic = false;
  refComponentInfos: Record<ComponentId | ModuleId, RefInfo> = {};
  private astNodes: Record<string, ASTNode> = {};
  private value: unknown | Array<IFieldModel> | Record<string, IFieldModel>;

  constructor(
    value: unknown,
    private componentModel?: IComponentModel,
    public spec?: JSONSchema7 & CustomOptions,
    private traitModel?: ITraitModel
  ) {
    this.update(value);
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
            newValue = new FieldModel(
              value[key],
              this.componentModel,
              (this.spec?.properties?.[key] || this.spec?.items) as
                | (JSONSchema7 & CustomOptions)
                | undefined,
              this.traitModel
            );
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

  // path is like the param of lodash.get, eg: 'foo.bar.0.value'
  getPropertyByPath(path: string): FieldModel | undefined {
    if (!path) return undefined;
    const arr = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let res: FieldModel | undefined = this;
    arr.forEach(key => {
      if (res) {
        res = res.getProperty(key);
      }
    });
    return res;
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

    this.refComponentInfos = {};
    this.astNodes = {};

    exps.forEach(exp => {
      let lastIdentifier: ComponentId = '' as ComponentId;
      const node = (acornLoose as typeof acorn).parse(exp, { ecmaVersion: 2020 });
      this.astNodes[exp] = node as ASTNode;
      // These are variables of iife or other identifiers, they can't be validated
      // so they should not be added in refs
      let whiteList: ASTNode[] = [];

      simpleWalk(node, {
        Function: functionNode => {
          whiteList = [...whiteList, ...(functionNode as FunctionNode).params];
        },
        Expression: expressionNode => {
          switch (expressionNode.type) {
            case 'Identifier':
              const key = exp.slice(
                expressionNode.start,
                expressionNode.end
              ) as ComponentId;

              if (this.refComponentInfos[key]) {
                this.refComponentInfos[key].componentIdASTNodes.push(
                  expressionNode as ASTNode
                );
              } else if (key) {
                this.refComponentInfos[key] = {
                  componentIdASTNodes: [expressionNode as ASTNode],
                  refProperties: [],
                };
              }
              lastIdentifier = key;

              break;
            case 'MemberExpression':
              if (lastIdentifier) {
                this.refComponentInfos[lastIdentifier]?.refProperties.push(
                  this.genPathFromMemberExpressionNode(expressionNode as ExpressionNode)
                );
              }
              break;
            case 'SequenceExpression':
              const sequenceExpression = expressionNode as SequenceExpressionNode;
              whiteList.push(sequenceExpression.expressions[1]);
              break;
            case 'Literal':
              // do nothing, just stop it from going to default
              break;
            default:
              // clear lastIdentifier when meet other astNode to break the MemberExpression chain
              lastIdentifier = '' as ComponentId;
          }
        },
        ObjectPattern: objPatternNode => {
          const propertyNodes = (objPatternNode as ObjectPatternNode).properties;
          propertyNodes.forEach(property => {
            whiteList.push(property.value);
          });
        },
        ArrayPattern: arrayPatternNode => {
          whiteList = [...whiteList, ...(arrayPatternNode as ArrayPatternNode).elements];
        },
        VariableDeclarator: declarator => {
          whiteList.push((declarator as DeclaratorNode).id);
        },
      });
      // remove whiteList from refs
      for (const key in this.refComponentInfos) {
        if (whiteList.some(({ name }) => key === name)) {
          delete this.refComponentInfos[key as any];
        }
      }
    });
  }

  private genPathFromMemberExpressionNode(expNode: ExpressionNode) {
    const path: string[] = [];
    function travel(node: ExpressionNode) {
      path.unshift(
        node.property?.name || (node.property as LiteralNode)?.raw || node.name
      );
      if (node.object) {
        travel(node.object);
      }
    }

    travel(expNode);
    return path.slice(1).join('.');
  }

  changeReferenceId(oldId: ComponentId, newId: ComponentId) {
    if (!this.componentModel) {
      return;
    }

    if (this.spec?.isComponentId && this.value === oldId) {
      // the normal string property but the `isComponentId` which like the event trait's `componentId` property
      // just simply change its value
      if (this.traitModel) {
        this.traitModel._isDirty = true;
      }
      this.componentModel._isDirty = true;
      this.update(newId);
    } else if (this.refComponentInfos[oldId]) {
      // the component vars in the expressions
      // change the AST nodes values of the related component vars
      // then generate the new expression
      const exps = parseExpression(this.value as string);
      const newExps = exps.map(exp => {
        const node = this.astNodes[exp.toString()];

        if (node) {
          const ref = this.refComponentInfos[oldId];

          ref.componentIdASTNodes.forEach(refNode => {
            refNode.name = newId;
          });

          this.refComponentInfos[newId] = ref;
          delete this.refComponentInfos[oldId];

          return [escodegen.generate(node)];
        }

        return exp;
      });
      const value = expChunkToString(newExps);

      if (this.traitModel) {
        this.traitModel._isDirty = true;
      }
      this.componentModel._isDirty = true;
      this.update(value);
    }
  }
}
