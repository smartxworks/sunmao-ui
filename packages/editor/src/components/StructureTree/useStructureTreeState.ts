import { ComponentSchema } from '@sunmao-ui/core';
import { CoreComponentName, CORE_VERSION } from '@sunmao-ui/shared';
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

  const { nodes, nodesMap, childrenMap } = useMemo(() => {
    const nodes: ComponentNode[] = [];
    const nodesMap: Record<string, ComponentNode> = {};
    const uiComponents = editorStore.components.filter(
      c => c.type !== `${CORE_VERSION}/${CoreComponentName.Dummy}`
    );
    const depthMap: Record<string, number> = {};
    // const parentMap: Record<string, string | null> = {};
    uiComponents.forEach(c => {
      depthMap[c.id] = 0;
    });
    const resolvedComponents = resolveApplicationComponents(uiComponents);
    const { topLevelComponents, childrenMap } = resolvedComponents;

    topLevelComponents.forEach(c => {
      const cb = (params: Required<TraverseParams>) => {
        depthMap[params.root.id] = params.depth;
        // parentMap[params.root.id] = params.parentId;
        const hasChildrenSlots = [];
        const slots = childrenMap.get(params.root.id);
        if (slots) {
          for (const slot of slots.keys()) {
            if (slots.get(slot)?.length) {
              hasChildrenSlots.push(slot);
            }
          }
        }
        const node = {
          id: params.root.id,
          component: params.root,
          depth: params.depth,
          parentId: params.parentId,
          slot: params.slot,
          hasChildrenSlots,
        };
        nodesMap[params.root.id] = node;
        nodes.push(node);
      };

      traverse({
        childrenMap,
        root: c,
        depth: 0,
        parentId: null,
        slot: null,
        cb,
      });
    });

    return { nodes, nodesMap, childrenMap };
  }, [editorStore.components]);

  const onToggleExpand = useCallback(
    (id: string) => {
      setExpandedMap(prevMap => {
        const nextExpanded = !prevMap[id];
        if (nextExpanded) {
          return { ...prevMap, [id]: nextExpanded };
        }
        // if close, close all its children
        const newExpandedMap = { ...prevMap };
        traverse({
          childrenMap,
          root: nodesMap[id].component,
          cb: params => delete newExpandedMap[params.root.id],
        });
        return newExpandedMap;
      });
    },
    [childrenMap, nodesMap]
  );

  const expandNode = useCallback(
    (id: string) => {
      setExpandedMap(prevMap => {
        if (prevMap[id]) return prevMap;
        const newExpandedMap = { ...prevMap };
        let curr: string = nodesMap[id]?.parentId || '';
        while (curr) {
          newExpandedMap[curr] = true;
          curr = nodesMap[curr]?.parentId || '';
        }
        return newExpandedMap;
      });
    },
    [nodesMap]
  );

  const shouldRender = useCallback(
    (node: ComponentNode) => {
      if (!node.parentId) return true;
      if (expandedMap[node.parentId]) return true;
      return false;
    },
    [expandedMap]
  );
  const shouldRenderNodes = useMemo(
    () => nodes.filter(shouldRender),
    [nodes, shouldRender]
  );

  const undroppableMap = useMemo(() => {
    const map: Record<string, boolean> = {};

    if (!draggingId) return map;

    traverse({
      childrenMap,
      root: nodesMap[draggingId].component,
      cb: params => {
        map[params.root.id] = true;
      },
    });
    return map;
  }, [childrenMap, draggingId, nodesMap]);

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
  cb: (params: Required<TraverseParams>) => void;
};

function traverse(params: TraverseParams) {
  const { root, depth = 0, parentId = null, slot = null, childrenMap, cb } = params;
  const safeParams = { childrenMap, root, depth, parentId, slot, cb };
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
          slot: key,
          cb,
        });
      });
    }
  }
}
