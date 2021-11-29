import { Application } from '@sunmao-ui/core';
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
    const stack: Application[] = [];
    beforeAll(() => {
      app = ApplicationFixture['adjustOrderOperation'];
      stack[0] = app;
      operation = new AdjustComponentOrderLeafOperation({
        componentId: 'grid_layout2',
        orientation: 'up',
      });
    });
    it('should do operation', () => {
      stack[1] = operation.do(stack[0]);
      expect(stack[1].spec.components).toMatchSnapshot();
    });
    it('should undo operation', () => {
      stack[2] = operation.undo(stack[1]);
      expect(stack[2].spec.components).toEqual(stack[0].spec.components);
    });
    it('should redo operation', () => {
      stack[3] = operation.redo(stack[2]);
      expect(stack[3].spec.components).toEqual(stack[1].spec.components);
    });
    afterAll(() => {
      app = undefined;
      operation = undefined;
    });
  });

  describe('move down top level component', () => {
    const stack: Application[] = [];
    beforeAll(() => {
      app = ApplicationFixture['adjustOrderOperation'];
      stack[0] = app;
      operation = new AdjustComponentOrderLeafOperation({
        componentId: 'grid_layout1',
        orientation: 'down',
      });
    });
    it('should do operation', () => {
      stack[1] = operation.do(stack[0]);
      expect(stack[1].spec.components).toMatchSnapshot();
    });
    it('should undo operation', () => {
      stack[2] = operation.undo(stack[1]);
      expect(stack[2].spec.components).toEqual(stack[0].spec.components);
    });
    it('should redo operation', () => {
      stack[3] = operation.redo(stack[2]);
      expect(stack[3].spec.components).toEqual(stack[1].spec.components);
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
    expect(operation.do(app)).toEqual(app);
    expect(warnSpy).toHaveBeenCalledWith('the element cannot move up');
  });

  it('should not move down top level component in the bottom', () => {
    app = ApplicationFixture['adjustOrderOperation'];
    operation = new AdjustComponentOrderLeafOperation({
      componentId: 'grid_layout2',
      orientation: 'down',
    });
    expect(operation.do(app)).toEqual(app);
    expect(warnSpy).toHaveBeenCalledWith('the element cannot move down');
  });

  describe('move up child component', () => {
    const stack: Application[] = [];
    beforeAll(() => {
      app = ApplicationFixture['adjustOrderOperation'];
      stack[0] = app;
      operation = new AdjustComponentOrderLeafOperation({
        componentId: 'userInfoContainer',
        orientation: 'up',
      });
    });
    it('should do operation', () => {
      stack[1] = operation.do(stack[0]);
      expect(stack[1].spec.components).toMatchSnapshot();
    });
    it('should undo operation', () => {
      stack[2] = operation.undo(stack[1]);
      expect(stack[2].spec.components).toEqual(stack[0].spec.components);
    });
    it('should redo operation', () => {
      stack[3] = operation.redo(stack[2]);
      expect(stack[3].spec.components).toEqual(stack[1].spec.components);
    });
    afterAll(() => {
      app = undefined;
      operation = undefined;
    });
  });

  describe('move down child component', () => {
    const stack: Application[] = [];
    beforeAll(() => {
      app = ApplicationFixture['adjustOrderOperation'];
      stack[0] = app;
      operation = new AdjustComponentOrderLeafOperation({
        componentId: 'usersTable',
        orientation: 'down',
      });
    });
    it('should do operation', () => {
      stack[1] = operation.do(stack[0]);
      expect(stack[1].spec.components).toMatchSnapshot();
    });
    it('should undo operation', () => {
      stack[2] = operation.undo(stack[1]);
      expect(stack[2].spec.components).toEqual(stack[0].spec.components);
    });
    it('should redo operation', () => {
      stack[3] = operation.redo(stack[2]);
      expect(stack[3].spec.components).toEqual(stack[1].spec.components);
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
    expect(operation.do(app)).toEqual(app);
    expect(warnSpy).toHaveBeenCalledWith('the element cannot move up');
  });

  it('should not move down child component in the bottom', () => {
    app = ApplicationFixture['adjustOrderOperation'];
    operation = new AdjustComponentOrderLeafOperation({
      componentId: 'userInfoContainer',
      orientation: 'down',
    });
    expect(operation.do(app)).toEqual(app);
    expect(warnSpy).toHaveBeenCalledWith('the element cannot move down');
  });

  beforeAll(() => {
    warnSpy.mockClear();
  });
});
