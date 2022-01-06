import { ComponentSchema } from '@sunmao-ui/core';

export const leafSymbol = Symbol('leaf');
export const branchSymbol = Symbol('branch');

/**
 * an operation list, it is based on a doubly linked list with a cursor point to current operation executed
 */
export class OperationList<TOperation extends IOperation = IOperation> {
  /**
   * head node is only a dummy node, it represent the initial state of the app
   */
  private readonly head = new ListNode<null, never, TOperation | null>(null);
  /**
   * cursor mean the last executed operation
   */
  private _cursor: ListNode<TOperation | null>;
  /**
   * a public getter for cursor's value
   */
  public get cursor(): ListNode<TOperation | null> {
    return this._cursor;
  }

  constructor() {
    this._cursor = this.head;
  }
  /**
   * insert a new node after cursor, unlink node after cursor and move cursor to the new node
   * @param value inserted operation
   * @returns {TOperation} the inserted node's value
   */
  insert(value: TOperation) {
    if (this._cursor.next) {
      // unlink cursor's next from list
      this._cursor.next.prev = null;
    }
    // connect new node to cursor and move cursor to the created node
    this._cursor = this._cursor.next = new ListNode(value, this._cursor);
    return this.cursor;
  }
  /**
   * move cursor to its next sibling
   * @returns {TOperation} current cursor's value
   */
  moveNext() {
    if (this._cursor.next) {
      this._cursor = this._cursor.next;
    } else {
      throw new Error('cursor has already been moved to tail.');
    }
    return this.cursor;
  }

  /**
   * move cursor to its previous sibling
   * @returns {IOperation} current cursor's value
   */
  movePrev() {
    if (this._cursor.prev) {
      this._cursor = this._cursor.prev;
    } else {
      throw new Error('cursor has already been moved to head.');
    }
    return this.cursor;
  }

  /**
   * iterate and reduce each node by reduce function
   * @param cb reduce function
   * @param initialData intial data for reduceLeft
   * @returns reduced value
   */
  reduce<TData>(cb: (prev: TData, node: TOperation) => TData, initialData: TData): TData {
    // ignore dummy head;
    let node = this.head.next;
    while (node && node.val) {
      initialData = cb(initialData, node.val);
      node = node.next;
    }
    return initialData;
  }
  /**
   * reverse iterate and reduce each node by reduce function
   * @param cb reduce function
   * @param initialData intial data for reduceRight
   * @returns reduced value
   */
  reduceRight<TData>(
    cb: (prev: TData, node: TOperation) => TData,
    initialData: TData
  ): TData {
    let node: ListNode<TOperation | null, TOperation | null, TOperation | null> | null =
      this.cursor;
    while (node && node.val) {
      initialData = cb(initialData, node.val);
      node = node.prev;
    }
    return initialData;
  }
}

/**
 * list node of doubly linked list
 */
export class ListNode<T, TPrev = T, TNext = T> {
  constructor(
    public val: T,
    public prev: ListNode<TPrev> | null = null,
    public next: ListNode<TNext> | null = null
  ) {}
}

export interface IUndoRedo {
  do(...args: any[]): any;
  redo(...args: any[]): any;
  undo(...args: any[]): any;
}

export interface IUndoRedoManager extends IUndoRedo {
  operationStack: OperationList;
}

export interface IOperation<TContext = any> extends IUndoRedo {
  /**
   * the context of operation, provide any information an operation needed
   */
  context: TContext;
  /**
   * infer the type of operation, leaf or branch
   */
  type: symbol;
  do(prev: ComponentSchema[]): ComponentSchema[];
  redo(prev: ComponentSchema[]): ComponentSchema[];
  undo(prev: ComponentSchema[]): ComponentSchema[];
}

/**
 * leaf operation is the operation that actually change the schema
 */
export abstract class BaseLeafOperation<TContext> implements IOperation<TContext> {
  context: TContext;
  type = leafSymbol;

  constructor(context: TContext) {
    this.context = context;
  }
  /**
   * do a leaf operation, implement it in subclass
   * @param prev prev application schema
   * @returns changed application schema
   */
  abstract do(prev: ComponentSchema[]): ComponentSchema[];
  /**
   * for leaf operation, most time redo is the same as do, override it if not
   * @param prev prev application schema
   * @returns changed application schema
   */
  redo(prev: ComponentSchema[]): ComponentSchema[] {
    return this.do(prev);
  }
  /**
   * undo a leaf operation, implement it in subclass
   * @param prev prev application schema
   * @returns changed application schema
   */
  abstract undo(prev: ComponentSchema[]): ComponentSchema[];

  static isLeafOperation<T>(op: IOperation<T>): op is BaseLeafOperation<T> {
    return op.type === leafSymbol;
  }
}
/**
 * branch operation is the operation that contains other child operation.
 */
export abstract class BaseBranchOperation<TContext>
  implements IOperation<TContext>, IUndoRedoManager
{
  operationStack: OperationList;
  context: TContext;
  type = branchSymbol;

  constructor(context: TContext) {
    this.context = context;
    this.operationStack = new OperationList();
  }

  /**
   * for branch operation, do will do all the child operation for the head to tail
   * it don't concern about cursor because a branch operation should do all redo all its children
   * @param prev prev application schema
   * @returns changed application schema
   */
  abstract do(prev: ComponentSchema[]): ComponentSchema[];

  /**
   * for branch operation, redo is the same as do
   * @param prev prev application schema
   * @returns changed application schema
   */
  redo(prev: ComponentSchema[]): ComponentSchema[] {
    return this.operationStack.reduce((prev, node) => {
      prev = node.redo(prev);
      return prev;
    }, prev);
  }

  /**
   * for branch operation, undo will undo all the child operation for the tail to head
   * it don't concern about cursor because a branch operation should undo all its children, the cursor should always be its tail
   * @param prev prev application schema
   * @returns changed application schema
   */
  undo(prev: ComponentSchema[]): ComponentSchema[] {
    return this.operationStack.reduceRight((prev, node) => {
      prev = node.undo(prev);
      return prev;
    }, prev);
  }

  static isBranchOperation<T>(op: IOperation<T>): op is BaseBranchOperation<T> {
    return op.type === branchSymbol;
  }
}
