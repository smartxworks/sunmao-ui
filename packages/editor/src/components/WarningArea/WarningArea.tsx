import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
  HStack,
  IconButton,
  Tabs,
  TabPanel,
  TabPanels,
  TabList,
  Tab,
  Box,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo, useState } from 'react';
import { Logs } from './Logs';
import { ErrorLogs } from './ErrorLogs';
import type { Props, Log, DisplayedLog } from './type';
import produce from 'immer';
import { Resizable } from 're-resizable';
import { MERGE_STATE, MODULE_EVENT, paginationHeight, TRIGGER_EVENT } from './const';

const WARNING_AREA_COLLAPSED__MIN_HEIGHT = 48;
const WARNING_AREA_EXPANDED_MIN_HEIGHT = 320;
const WARNING_AREA_MAX_HEIGHT = 800;
const getMinHeight = (isCollapsed: boolean) => {
  return isCollapsed
    ? WARNING_AREA_COLLAPSED__MIN_HEIGHT
    : WARNING_AREA_EXPANDED_MIN_HEIGHT;
};

export const WarningArea: React.FC<Props> = observer(({ services }) => {
  const { editorStore } = services;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [height, setHeight] = useState(WARNING_AREA_COLLAPSED__MIN_HEIGHT);
  const [logs, setLogs] = useState<DisplayedLog[]>([]);

  useEffect(() => {
    const handler = (params: unknown) => {
      setLogs(cur => {
        return produce(cur, draft => {
          const { name, triggerId, componentId, parameters, eventType, type, id } =
            params as Log;
          draft.unshift({
            time: new Date().toLocaleTimeString(),
            type,
            eventType: eventType || type,
            target: componentId || id,
            parameters,
            methodName: name,
            triggerId: triggerId,
          });
        });
      });
    };
    services.apiService.on('mergeState', params => {
      handler({
        ...params,
        eventType: 'mergeState',
        type: MERGE_STATE,
      });
    });
    services.apiService.on('uiMethod', params => {
      handler({
        type: TRIGGER_EVENT,
        ...params,
      });
    });
    services.apiService.on('moduleEvent', params => {
      handler({
        ...params,
        type: MODULE_EVENT,
        eventType: 'moduleEvent',
        triggerId: params.fromId,
        componentId: params.fromId,
      });
    });
    return () => {
      services.apiService.off('mergeState');
      services.apiService.off('uiMethod');
      services.apiService.off('moduleEvent');
    };
  }, [services.apiService]);

  const savedBadge = useMemo(() => {
    return <Badge colorScheme="green">Saved</Badge>;
  }, []);

  const unsaveBadge = useMemo(() => {
    return (
      <HStack>
        <Button
          colorScheme="red"
          variant="ghost"
          size="sm"
          onClick={() => editorStore.saveCurrentComponents()}
        >
          Save anyway
        </Button>
        <Badge colorScheme="red">Unsave</Badge>
      </HStack>
    );
  }, [editorStore]);
  const tabListHeight = 40;

  const logsCount = useMemo(() => {
    const tableHeaderHeight = 40;
    const tableCeilHight = 45;
    const padding = 16;
    return (
      Math.floor(
        (height - padding - tabListHeight - paginationHeight - tableHeaderHeight) /
          tableCeilHight
      ) || 1
    );
  }, [height]);

  return (
    <Resizable
      size={{
        width: '100%',
        height: height,
      }}
      enable={{ top: true }}
      maxHeight={WARNING_AREA_MAX_HEIGHT}
      minHeight={WARNING_AREA_COLLAPSED__MIN_HEIGHT}
      snap={{ y: [WARNING_AREA_COLLAPSED__MIN_HEIGHT] }}
      snapGap={WARNING_AREA_COLLAPSED__MIN_HEIGHT}
      onResizeStop={(_e, _direction, _ref, d) => {
        setHeight(prevH => prevH + d.height);
        if (height + d.height === WARNING_AREA_COLLAPSED__MIN_HEIGHT) {
          setIsCollapsed(true);
        } else {
          setIsCollapsed(false);
        }
      }}
    >
      <Box
        h="full"
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        paddingY="2"
        paddingX="4"
        boxShadow="0 0 4px rgba(0, 0, 0, 0.1)"
        background="white"
        width="full"
      >
        <Tabs h="full" w="full" variant="soft-rounded" colorScheme="gray">
          <TabList>
            <Tab>Logs</Tab>
            <HStack w="full" justify="end">
              {editorStore.isSaved ? savedBadge : unsaveBadge}
              <IconButton
                aria-label="show errors"
                size="sm"
                variant="ghost"
                icon={isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
                onClick={() => {
                  setIsCollapsed(prev => !prev);
                  setHeight(getMinHeight(!isCollapsed));
                }}
              />
            </HStack>
          </TabList>
          {!isCollapsed && (
            <TabPanels h={height - tabListHeight}>
              <TabPanel h="full" overflow="auto">
                <ErrorLogs services={services} />
              </TabPanel>
              <TabPanel h="full" overflow="auto">
                <Logs
                  setLogs={setLogs}
                  services={services}
                  logs={logs}
                  count={logsCount}
                />
              </TabPanel>
            </TabPanels>
          )}
        </Tabs>
      </Box>
    </Resizable>
  );
});
