import { action, computed, makeObservable, observable } from 'mobx';
import React from 'react';
import { EditorServices } from '../../types';

export class EditorMaskManager {
  // observable: current mouse position
  mousePosition: [number, number] = [0, 0];
  // observable: rects of all foreground components
  rects: Record<string, DOMRect> = {};
  // observable: rect of mask container
  maskContainerRect: DOMRect | null = null;
  // observable: the coordinate system offset, it is almost equal to the scroll value of maskWrapper
  systemOffset: [number, number] = [0, 0];
  modalContainerEle: HTMLElement | null = null;
  // visible status of all components.
  private visibleMap = new Map<Element, boolean>();
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private MaskPadding = 4;

  get hoverComponentId() {
    const where = whereIsMouse(
      this.mousePosition[0] - this.systemOffset[0],
      this.mousePosition[1] - this.systemOffset[1],
      this.rects
    );
    return where;
  }

  get hoverMaskPosition() {
    return this.getMaskPosition(this.hoverComponentId);
  }

  get selectedMaskPosition() {
    return this.getMaskPosition(this.services.editorStore.selectedComponentId);
  }

  constructor(
    public services: EditorServices,
    public wrapperRef: React.MutableRefObject<HTMLDivElement | null>,
    public maskContainerRef: React.MutableRefObject<HTMLDivElement | null>,
    public hoverComponentIdRef: React.MutableRefObject<string>
  ) {
    makeObservable(this, {
      rects: observable.shallow,
      mousePosition: observable.ref,
      maskContainerRect: observable.ref,
      systemOffset: observable.ref,
      setRects: action,
      setMousePosition: action,
      setMaskContainerRect: action,
      setSystemOffset: action,
      hoverComponentId: computed,
      hoverMaskPosition: computed,
      selectedMaskPosition: computed,
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.refreshSystem();
    });

    this.intersectionObserver = this.initIntersectionObserver();

    this.observeIntersection();
    this.observeResize();
    this.observeEvents();
  }

  private initIntersectionObserver(): IntersectionObserver {
    const options = {
      root: document.getElementById('editor-mask-wrapper'),
      rootMargin: '0px',
      threshold: buildThresholdList(),
    };

    return new IntersectionObserver(entries => {
      // Update visibleMap.
      // Every time intersection observer is triggered, some components' visibility must have changed.
      entries.forEach(e => {
        this.visibleMap.set(e.target, e.isIntersecting);
      });
      // the coordinate system need to be refresh
      this.refreshSystem();
    }, options);
  }

  // listen resize events of dom elements
  private observeResize() {
    this.resizeObserver.disconnect();
    this.eleMap.forEach(ele => {
      this.resizeObserver.observe(ele);
    });
  }

  private observeIntersection() {
    this.intersectionObserver.disconnect();
    this.eleMap.forEach(ele => {
      this.intersectionObserver.observe(ele);
    });
  }

  private observeEvents() {
    // listen to the DOM elements' mount and unmount events
    // TODO: This is not very accurate, because sunmao runtime 'didDOMUpdate' hook is not accurate.
    // We will refactor the 'didDOMUpdate' hook with components' life cycle in the future.
    this.services.eventBus.on('HTMLElementsUpdated', () => {
      this.refreshSystem();
      this.observeIntersection();
      this.observeResize();
    });
  }

  // Refresh the whole coordinate system.
  // Coordinate system is made up of: reacts, maskContainerRect and systemOffset.
  private refreshSystem() {
    this.updateEleRects();
    if (this.maskContainerEle) {
      this.setMaskContainerRect(this.maskContainerEle.getBoundingClientRect());
    }
    if (this.wrapperEle) {
      this.setSystemOffset([this.wrapperEle.scrollLeft, this.wrapperEle.scrollTop]);
    }
  }

  private updateEleRects() {
    const _rects: Record<string, DOMRect> = {};
    const modalEleMap = new Map<string, HTMLElement>();
    // detect if there are components in modal
    for (const id of this.eleMap.keys()) {
      const ele = this.eleMap.get(id)!;
      if (this.isChild(ele, this.modalContainerEle!)) {
        modalEleMap.set(id, ele);
      }
    }

    const foregroundEleMap = modalEleMap.size > 0 ? modalEleMap : this.eleMap;

    foregroundEleMap.forEach((ele, id) => {
      if (this.visibleMap.get(ele)) {
        const rect = ele.getBoundingClientRect();
        _rects[id] = rect;
      }
    });
    this.setRects(_rects);
  }

  private isChild(child: HTMLElement, parent: HTMLElement) {
    let curr = child;
    while (curr.parentElement && !curr.parentElement.isSameNode(this.wrapperEle)) {
      if (curr.parentElement.isSameNode(parent)) {
        return true;
      }
      curr = curr.parentElement;
    }
    return false;
  }

  private getMaskPosition(id: string) {
    const rect = this.rects[id];
    if (!this.maskContainerRect || !rect) return null;
    return {
      id,
      style: {
        top: rect.top - this.maskContainerRect.top - this.MaskPadding,
        left: rect.left - this.maskContainerRect.left - this.MaskPadding,
        height: rect.height + this.MaskPadding * 2,
        width: rect.width + this.MaskPadding * 2,
      },
    };
  }

  setMousePosition(val: [number, number]) {
    this.mousePosition = val;
  }

  setSystemOffset(systemOffset: [number, number]) {
    this.systemOffset = systemOffset;
  }

  setRects(rects: Record<string, DOMRect>) {
    this.rects = rects;
  }

  setMaskContainerRect(maskContainerRect: DOMRect) {
    this.maskContainerRect = maskContainerRect;
  }

  private get eleMap() {
    return this.services.editorStore.eleMap;
  }

  private get wrapperEle() {
    return this.wrapperRef.current;
  }

  private get maskContainerEle() {
    return this.maskContainerRef.current;
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

export function whereIsMouse(
  left: number,
  top: number,
  rects: Record<string, DOMRect>
): string {
  let nearest = {
    id: '',
    sum: Infinity,
  };
  for (const id in rects) {
    const rect = rects[id];
    if (
      top < rect.top ||
      left < rect.left ||
      top > rect.top + rect.height ||
      left > rect.left + rect.width
    ) {
      continue;
    }
    const sum = top - rect.top + (left - rect.left);
    if (sum < nearest.sum) {
      nearest = { id, sum };
    }
  }
  return nearest.id;
}
