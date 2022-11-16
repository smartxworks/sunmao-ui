import { debounce } from 'lodash';
import { action, autorun, makeObservable, observable } from 'mobx';
import React from 'react';
import { traverse as traverseFiber } from 'react-fiber-traverse';
import { EditorServices } from '../../types';

type MaskPosition = {
  id: string;
  style: {
    top: number;
    left: number;
    height: number;
    width: number;
  };
};
export class EditorMaskManager {
  hoverMaskPosition: MaskPosition | null = null;
  selectedMaskPosition: MaskPosition | null = null;
  mousePosition: [number, number] = [0, 0];
  // the elements get by fiber
  private fiberEleMap = new Map<string, Element>();
  private elementIdMap = new Map<Element, string>();
  // rect of mask container
  private maskContainerRect: DOMRect | null = null;
  private resizeObserver: ResizeObserver;
  private containerResizeObserver: ResizeObserver | null = null;
  private visibleMap = new Map<Element, boolean>();
  private intersectionObserver: IntersectionObserver;
  private MaskPadding = 4;
  private lastHoverElement: Element | null = null;

  get hoverComponentId() {
    return this.services.editorStore.hoverComponentId;
  }

  constructor(
    public services: EditorServices,
    public wrapperRef: React.MutableRefObject<HTMLDivElement | null>,
    public maskContainerRef: React.MutableRefObject<HTMLDivElement | null>
  ) {
    makeObservable(this, {
      mousePosition: observable,
      hoverMaskPosition: observable.ref,
      selectedMaskPosition: observable.ref,
      setMousePosition: action,
      setHoverMaskPosition: action,
      setSelectedMaskPosition: action,
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.refreshHoverElement();
    });

    this.intersectionObserver = this.initIntersectionObserver();
    // listen to the DOM elements' mount and unmount events
    // TODO: This is not very accurate, because sunmao runtime 'didDOMUpdate' hook is not accurate.
    // We will refactor the 'didDOMUpdate' hook with components' life cycle in the future.
    this.services.eventBus.on('HTMLElementsUpdated', this.onHTMLElementsUpdated);

    // listen scroll events
    // scroll events' timing is similar to intersection events, but they are different. Both of them are necessary.
    this.services.eventBus.on('MaskWrapperScrollCapture', this.onScroll);
  }

  init() {
    this.unsafeAutoFindNoRefElement();
    this.updateElementIdMap();
    this.observeContainerResize();
    this.observeIntersection();
    this.observeResize();

    // when hoverComponentId & selectedComponentId change, refresh mask position
    autorun(() => {
      this.refreshMaskPosition();
    });

    // listen mousePosition change to refreshHoverElement
    autorun(() => {
      this.refreshHoverElement();
    });
  }

  destroy() {
    this.intersectionObserver.disconnect();
    this.resizeObserver.disconnect();
    this.containerResizeObserver?.disconnect();
    this.services.eventBus.off('HTMLElementsUpdated', this.onHTMLElementsUpdated);

    // listen scroll events
    // scroll events' timing is similar to intersection events, but they are different. Both of them are necessary.
    this.services.eventBus.off('MaskWrapperScrollCapture', this.onScroll);
  }

  private initIntersectionObserver(): IntersectionObserver {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: buildThresholdList(),
    };

    return new IntersectionObserver(entries => {
      // Update visibleMap.
      // Every time intersection observer is triggered, some components' visibility must have changed.
      entries.forEach(e => {
        this.visibleMap.set(e.target, e.isIntersecting);
      });
      // Refresh the mask, because the component visibility changed,
      this.refreshMaskPosition();
    }, options);
  }

  // listen resize events of dom elements
  private observeResize() {
    this.resizeObserver.disconnect();
    this.eleMap.forEach(ele => {
      this.resizeObserver.observe(ele);
    });
    this.fiberEleMap.forEach(ele => {
      this.intersectionObserver.observe(ele);
    });
  }

  private observeContainerResize() {
    this.containerResizeObserver = new ResizeObserver(() => {
      this.maskContainerRect =
        this.maskContainerRef.current?.getBoundingClientRect() || null;
    });

    this.containerResizeObserver.observe(this.maskContainerRef.current!);
  }

  private observeIntersection() {
    this.intersectionObserver.disconnect();
    this.eleMap.forEach(ele => {
      this.intersectionObserver.observe(ele);
    });
    this.fiberEleMap.forEach(ele => {
      this.intersectionObserver.observe(ele);
    });
  }

  private onHTMLElementsUpdated = debounce(() => {
    this.unsafeAutoFindNoRefElement();
    this.updateElementIdMap();
    this.observeIntersection();
    this.observeResize();
    this.refreshHoverElement();
    this.refreshMaskPosition();
  }, 16);

  private onScroll = () => {
    this.refreshHoverElement();
    this.refreshMaskPosition();
  };

  private getHTMLElement(id: string) {
    return this.eleMap.get(id) || this.fiberEleMap.get(id);
  }

  private getMaskPosition(id: string) {
    if (!id) return null;
    const rect = this.getHTMLElement(id)?.getBoundingClientRect();
    if (!this.maskContainerRect || !rect) return null;
    return {
      id,
      style: {
        top:
          rect.top -
          this.maskContainerRect.top -
          this.MaskPadding +
          this.wrapperScrollTop,
        left:
          rect.left -
          this.maskContainerRect.left -
          this.MaskPadding +
          this.wrapperScrollLeft,
        height: rect.height + this.MaskPadding * 2,
        width: rect.width + this.MaskPadding * 2,
      },
    };
  }

  private updateElementIdMap() {
    // generate elementIdMap, this only aim to improving the  performance of refreshHoverElement method
    this.eleMap.forEach((ele, id) => {
      this.elementIdMap.set(ele, id);
    });
    this.fiberEleMap.forEach((ele, id) => {
      this.elementIdMap.set(ele, id);
    });
  }

  private getElementsByFiber(ids: string[]): Record<string, HTMLElement | undefined> {
    const map: Record<string, HTMLElement | undefined> = {};
    const rootFiberNode = (document.getElementById('root') as any)._reactRootContainer
      ._internalRoot.current;
    traverseFiber(rootFiberNode, (fiber: any) => {
      if (!fiber.memoizedProps) {
        return;
      }
      const componentId = fiber.memoizedProps['data-sunmao-id'];
      const i = ids.indexOf(componentId);
      if (i === -1) {
        return;
      }
      ids.splice(i, 1);
      // find the nearest child HTMLElement
      let curr = fiber;
      while (!curr.stateNode && curr.child) {
        curr = curr.child;
      }
      if (curr.stateNode instanceof HTMLElement) {
        map[componentId] = curr.stateNode;
      }
    });
    return map;
  }

  // Auto find the components that does not have ref by React Fiber
  // This function is a fallback.
  // And because it uses React Fiber, it is not stable.
  private unsafeAutoFindNoRefElement() {
    try {
      const noEleComponentIds: string[] = [];
      this.services.appModelManager.appModel.allComponents.forEach(c => {
        if (!this.eleMap.has(c.id)) {
          const eleFromFiber = this.fiberEleMap.get(c.id);
          if (!eleFromFiber || !eleFromFiber.isConnected) {
            noEleComponentIds.push(c.id);
          }
        }
      });
      if (noEleComponentIds.length === 0) return;
      const fiberElements = this.getElementsByFiber(noEleComponentIds);
      for (const key in fiberElements) {
        const ele = fiberElements[key];
        if (ele) this.fiberEleMap.set(key, ele);
      }
    } catch {}
  }

  private refreshHoverElement() {
    const hoverElement = document.elementFromPoint(
      this.mousePosition[0] - this.wrapperScrollLeft,
      this.mousePosition[1] - this.wrapperScrollTop
    );
    if (!hoverElement) return;
    if (hoverElement === this.lastHoverElement) return;
    const root = this.wrapperRef.current;

    // check all the parents of hoverElement, until find a sunmao component's element
    let curr = hoverElement;
    while (!this.elementIdMap.has(curr)) {
      if (curr !== root && curr.parentElement) {
        curr = curr.parentElement;
      } else {
        break;
      }
    }

    this.lastHoverElement = hoverElement;
    this.services.editorStore.setHoverComponentId(this.elementIdMap.get(curr) || '');
  }

  private refreshMaskPosition() {
    this.setHoverMaskPosition(this.getMaskPosition(this.hoverComponentId));
    const selectedComponentId = this.services.editorStore.selectedComponentId;
    const selectedComponentEle = this.getHTMLElement(selectedComponentId);
    if (selectedComponentEle && this.visibleMap.get(selectedComponentEle)) {
      this.setSelectedMaskPosition(this.getMaskPosition(selectedComponentId));
    } else {
      this.setSelectedMaskPosition(null);
    }
  }

  setMousePosition(mousePosition: [number, number]) {
    this.mousePosition = mousePosition;
  }

  setHoverMaskPosition(hoverMaskPosition: MaskPosition | null) {
    this.hoverMaskPosition = hoverMaskPosition;
  }

  setSelectedMaskPosition(selectedMaskPosition: MaskPosition | null) {
    this.selectedMaskPosition = selectedMaskPosition;
  }

  private get eleMap() {
    return this.services.editorStore.eleMap;
  }

  private get wrapperScrollTop() {
    return this.wrapperRef.current?.scrollTop || 0;
  }

  private get wrapperScrollLeft() {
    return this.wrapperRef.current?.scrollLeft || 0;
  }
}

function buildThresholdList() {
  const thresholds: number[] = [];
  const numSteps = 20;

  for (let i = 1.0; i <= numSteps; i++) {
    const ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}
