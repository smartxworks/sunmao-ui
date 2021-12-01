import { Application, ApplicationComponent } from '@sunmao-ui/core';
import { ApplicationFixture } from '../../__fixture__/application';
import { AdjustComponentOrderLeafOperation } from '../../src/operations/leaf/component/adjustComponentOrderLeafOperation';

describe('adjust component order operation', () => {
  let app: Application;
  let operation: AdjustComponentOrderLeafOperation;
  let warnSpy: jest.SpyInstance;

  beforeAll(() => {
    warnSpy = jest.spyOn(console, 'warn');
  });

  describe('move up top level component', () => {
    const stack: ApplicationComponent[][] = [];
    beforeAll(() => {
      app = ApplicationFixture['adjustOrderOperation'];
      stack[0] = app.spec.components;
      operation = new AdjustComponentOrderLeafOperation({
        componentId: 'grid_layout2',
        orientation: 'up',
      });
    });
    it('should do operation', () => {
      stack[1] = operation.do(stack[0]);
      expect(stack[1][operation['index']]).toEqual(stack[0][operation['dest']]);
      expect(stack[1][operation['dest']]).toEqual(stack[0][operation['index']]);
      const topLevelElements = stack[1].filter(
        c => !c.traits.some(t => t.type === 'core/v1/slot') && c.type !== 'core/v1/dummy'
      );
      const index = topLevelElements.findIndex(
        c => c.id === stack[0][operation['index']].id
      );
      expect(topLevelElements[index + 1].id).toBe(stack[0][operation['dest']].id);
    });
    it('should undo operation', () => {
      stack[2] = operation.undo(stack[1]);
      expect(stack[2]).toEqual(stack[0]);
    });
    it('should redo operation', () => {
      stack[3] = operation.redo(stack[2]);
      expect(stack[3]).toEqual(stack[1]);
    });
    afterAll(() => {
      app = undefined;
      operation = undefined;
    });
  });

  describe('move down top level component', () => {
    const stack: ApplicationComponent[][] = [];
    beforeAll(() => {
      app = ApplicationFixture['adjustOrderOperation'];
      stack[0] = app.spec.components;
      operation = new AdjustComponentOrderLeafOperation({
        componentId: 'grid_layout1',
        orientation: 'down',
      });
    });
    it('should do operation', () => {
      stack[1] = operation.do(stack[0]);
      expect(stack[1][operation['index']]).toEqual(stack[0][operation['dest']]);
      expect(stack[1][operation['dest']]).toEqual(stack[0][operation['index']]);
      const topLevelElements = stack[1].filter(
        c => !c.traits.some(t => t.type === 'core/v1/slot') && c.type !== 'core/v1/dummy'
      );
      const index = topLevelElements.findIndex(
        c => c.id === stack[0][operation['index']].id
      );
      expect(topLevelElements[index - 1].id).toBe(stack[0][operation['dest']].id);
    });
    it('should undo operation', () => {
      stack[2] = operation.undo(stack[1]);
      expect(stack[2]).toEqual(stack[0]);
    });
    it('should redo operation', () => {
      stack[3] = operation.redo(stack[2]);
      expect(stack[3]).toEqual(stack[1]);
    });
    afterAll(() => {
      app = undefined;
      operation = undefined;
    });
  });

  it('should not move up top level component in the top', () => {
    app = ApplicationFixture['adjustOrderOperation'];
    operation = new AdjustComponentOrderLeafOperation({
      componentId: 'grid_layout1',
      orientation: 'up',
    });
    expect(operation.do(app.spec.components)).toEqual(app.spec.components);
    expect(warnSpy).toHaveBeenCalledWith('the element cannot move up');
  });

  it('should not move down top level component in the bottom', () => {
    app = ApplicationFixture['adjustOrderOperation'];
    operation = new AdjustComponentOrderLeafOperation({
      componentId: 'grid_layout2',
      orientation: 'down',
    });
    expect(operation.do(app.spec.components)).toEqual(app.spec.components);
    expect(warnSpy).toHaveBeenCalledWith('the element cannot move down');
  });

  describe('move up child component', () => {
    const stack: ApplicationComponent[][] = [];
    beforeAll(() => {
      app = ApplicationFixture['adjustOrderOperation'];
      stack[0] = app.spec.components;
      operation = new AdjustComponentOrderLeafOperation({
        componentId: 'userInfoContainer',
        orientation: 'up',
      });
    });
    it('should do operation', () => {
      stack[1] = operation.do(stack[0]);
      expect(stack[1][operation['index']]).toEqual(stack[0][operation['dest']]);
      expect(stack[1][operation['dest']]).toEqual(stack[0][operation['index']]);
      const parent = (
        stack[1]
          .find(c => c.id === 'userInfoContainer')
          .traits.find(t => t.type === 'core/v1/slot').properties.container as {
          id: string;
        }
      ).id;
      const siblingElements = stack[1].filter(c =>
        c.traits.some(
          t =>
            t.type === 'core/v1/slot' &&
            (t.properties.container as { id: string }).id === parent
        )
      );
      const index = siblingElements.findIndex(
        c => c.id === stack[0][operation['index']].id
      );
      expect(siblingElements[index + 1].id).toBe(stack[0][operation['dest']].id);
    });
    it('should undo operation', () => {
      stack[2] = operation.undo(stack[1]);
      expect(stack[2]).toEqual(stack[0]);
    });
    it('should redo operation', () => {
      stack[3] = operation.redo(stack[2]);
      expect(stack[3]).toEqual(stack[1]);
    });
    afterAll(() => {
      app = undefined;
      operation = undefined;
    });
  });

  describe('move down child component', () => {
    const stack: ApplicationComponent[][] = [];
    beforeAll(() => {
      app = ApplicationFixture['adjustOrderOperation'];
      stack[0] = app.spec.components;
      operation = new AdjustComponentOrderLeafOperation({
        componentId: 'usersTable',
        orientation: 'down',
      });
    });
    it('should do operation', () => {
      stack[1] = operation.do(stack[0]);
      expect(stack[1][operation['index']]).toEqual(stack[0][operation['dest']]);
      expect(stack[1][operation['dest']]).toEqual(stack[0][operation['index']]);
      const parent = (
        stack[1]
          .find(c => c.id === 'userInfoContainer')
          .traits.find(t => t.type === 'core/v1/slot').properties.container as {
          id: string;
        }
      ).id;
      const siblingElements = stack[1].filter(c =>
        c.traits.some(
          t =>
            t.type === 'core/v1/slot' &&
            (t.properties.container as { id: string }).id === parent
        )
      );
      const index = siblingElements.findIndex(
        c => c.id === stack[0][operation['index']].id
      );
      expect(siblingElements[index - 1].id).toBe(stack[0][operation['dest']].id);
    });
    it('should undo operation', () => {
      stack[2] = operation.undo(stack[1]);
      expect(stack[2]).toEqual(stack[0]);
    });
    it('should redo operation', () => {
      stack[3] = operation.redo(stack[2]);
      expect(stack[3]).toEqual(stack[1]);
    });
    afterAll(() => {
      app = undefined;
      operation = undefined;
    });
  });

  it('should not move up child component in the top', () => {
    app = ApplicationFixture['adjustOrderOperation'];
    operation = new AdjustComponentOrderLeafOperation({
      componentId: 'usersTable',
      orientation: 'up',
    });
    expect(operation.do(app.spec.components)).toEqual(app.spec.components);
    expect(warnSpy).toHaveBeenCalledWith('the element cannot move up');
  });

  it('should not move down child component in the bottom', () => {
    app = ApplicationFixture['adjustOrderOperation'];
    operation = new AdjustComponentOrderLeafOperation({
      componentId: 'userInfoContainer',
      orientation: 'down',
    });
    expect(operation.do(app.spec.components)).toEqual(app.spec.components);
    expect(warnSpy).toHaveBeenCalledWith('the element cannot move down');
  });

  beforeAll(() => {
    warnSpy.mockClear();
  });
});
