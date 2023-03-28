import { ComponentSchema } from '@sunmao-ui/core';
import { useCallback, useMemo, useState } from 'react';
import { EditorStore } from '../../services/EditorStore';
import {
  ChildrenMap,
  resolveApplicationComponents,
} from '../../utils/resolveApplicationComponents';
import { ComponentNode } from './type';

export function useStructureTreeState(editorStore: EditorStore) {
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const [draggingId, setDraggingId] = useState('');

  // format components schema to ComponentNode
  const { nodes, nodesMapCache, childrenMap } = useMemo(() => {
    const nodes: ComponentNode[] = [];
    const nodesMapCache: Record<string, ComponentNode> = {};
    const depthMap: Record<string, number> = {};
    const resolvedComponents = resolveApplicationComponents(editorStore.uiComponents);
    const { topLevelComponents, childrenMap } = resolvedComponents;

    topLevelComponents.forEach(c => {
      const cb = (params: Required<TraverseParams>) => {
        const notEmptySlots = [];
        const slots = childrenMap.get(params.root.id);
        if (slots) {
          for (const slot of slots.keys()) {
            if (slots.get(slot)?.length) {
              notEmptySlots.push(slot);
            }
          }
        }
        const node = {
          id: params.root.id,
          component: params.root,
          depth: params.depth,
          parentId: params.parentId,
          slot: params.slot,
          parentSlots: params.parentSlots,
          notEmptySlots,
        };
        nodesMapCache[params.root.id] = node;
        depthMap[params.root.id] = params.depth;
        nodes.push(node);
      };

      traverse({
        childrenMap,
        root: c,
        depth: 0,
        parentId: null,
        slot: null,
        parentSlots: [],
        cb,
      });
    });

    return { nodes, nodesMapCache, childrenMap };
  }, [editorStore.components]);

  const onToggleExpand = useCallback(
    (id: string) => {
      setExpandedMap(prevMap => {
        const nextExpanded = !prevMap[id];
        if (nextExpanded) {
          return { ...prevMap, [id]: nextExpanded };
        }
        // if collapse, collapse all its children
        const newExpandedMap = { ...prevMap };
        traverse({
          childrenMap,
          root: nodesMapCache[id].component,
          cb: params => delete newExpandedMap[params.root.id],
        });
        return newExpandedMap;
      });
    },
    [childrenMap, nodesMapCache]
  );

  // expand all the ancestors of a node
  const expandNode = useCallback(
    (id: string) => {
      setExpandedMap(prevMap => {
        if (prevMap[id]) return prevMap;
        const newExpandedMap = { ...prevMap };
        // don't expand its self
        let curr: string = nodesMapCache[id]?.parentId || '';
        while (curr) {
          newExpandedMap[curr] = true;
          curr = nodesMapCache[curr]?.parentId || '';
        }
        return newExpandedMap;
      });
    },
    [nodesMapCache]
  );

  // nodes whose parent is expanded
  const shouldRenderNodes = useMemo(
    () =>
      nodes.filter((node: ComponentNode) => {
        if (!node.parentId) return true;
        if (expandedMap[node.parentId]) return true;
        return false;
      }),
    [expandedMap, nodes]
  );

  // nodes that is being dragged or its ancestor is being dragged
  const undroppableMap = useMemo(() => {
    const map: Record<string, boolean> = {};

    if (!draggingId) return map;

    traverse({
      childrenMap,
      root: nodesMapCache[draggingId].component,
      cb: params => {
        map[params.root.id] = true;
      },
    });
    return map;
  }, [childrenMap, draggingId, nodesMapCache]);

  return {
    nodes,
    shouldRenderNodes,
    expandedMap,
    onToggleExpand,
    expandNode,
    undroppableMap,
    setDraggingId,
  };
}

type TraverseParams = {
  childrenMap: ChildrenMap;
  root: ComponentSchema;
  depth?: number;
  parentId?: string | null;
  slot?: string | null;
  parentSlots?: string[];
  cb: (params: Required<TraverseParams>) => void;
};

function traverse(params: TraverseParams) {
  const {
    root,
    depth = 0,
    parentId = null,
    slot = null,
    childrenMap,
    cb,
    parentSlots = [],
  } = params;
  const safeParams = { childrenMap, root, depth, parentId, slot, cb, parentSlots };
  cb(safeParams);
  const slots = childrenMap.get(root.id);
  if (slots) {
    for (const key of slots.keys()) {
      const children = slots.get(key)!;
      children.forEach(child => {
        traverse({
          childrenMap,
          root: child,
          depth: depth + 1,
          parentId: root.id,
          parentSlots: Array.from(slots.keys()),
          slot: key,
          cb,
        });
      });
    }
  }
}
