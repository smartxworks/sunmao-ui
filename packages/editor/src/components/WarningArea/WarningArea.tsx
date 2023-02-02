import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
  HStack,
  IconButton,
  Tabs,
  Text,
  TabPanel,
  TabPanels,
  TabList,
  VStack,
  Tab,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo, useState } from 'react';
import { EventLogs } from './EventLogs';
import { ErrorLogs } from './ErrorLogs';
import type { Props, Event, EventLog } from './type';
import produce from 'immer';

export const WarningArea: React.FC<Props> = observer(({ services }) => {
  const { editorStore } = services;
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);

  useEffect(() => {
    const handler = (type: string, event: unknown) => {
      setEventLogs(cur => {
        return produce(cur, draft => {
          draft.unshift({
            type,
            methodName: (event as Event).name,
            triggered: (event as Event).triggerId || '',
            time: new Date().toLocaleTimeString(),
            target: (event as Event).componentId,
          });
        });
      });
    };
    services.apiService.on('*', handler);
    return () => services.apiService.off('*', handler);
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

  return (
    <VStack
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      paddingY="2"
      paddingX="4"
      boxShadow="0 0 4px rgba(0, 0, 0, 0.1)"
      background="white"
      zIndex="1"
    >
      <HStack width="full" justifyContent="space-between">
        <Tabs
          minH={isCollapsed ? '' : '300px'}
          w="full"
          variant="soft-rounded"
          colorScheme="gray"
        >
          <TabList>
            <Tab alignItems="baseline">
              <Text fontSize="md" fontWeight="bold">
                Errors
              </Text>
              <Badge ml="1" fontSize="0.8em" colorScheme="red">
                {editorStore.validateResult.length}
              </Badge>
            </Tab>
            <Tab>Logs</Tab>
            <HStack w="full" justify="end">
              {editorStore.isSaved ? savedBadge : unsaveBadge}
              <IconButton
                aria-label="show errors"
                size="sm"
                variant="ghost"
                icon={isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
                onClick={() => setIsCollapsed(prev => !prev)}
              />
            </HStack>
          </TabList>
          {!isCollapsed && (
            <TabPanels>
              <TabPanel>
                <ErrorLogs services={services} />
              </TabPanel>
              <TabPanel>
                <EventLogs
                  setEventLogs={setEventLogs}
                  services={services}
                  events={eventLogs}
                />
              </TabPanel>
            </TabPanels>
          )}
        </Tabs>
      </HStack>
    </VStack>
  );
});
