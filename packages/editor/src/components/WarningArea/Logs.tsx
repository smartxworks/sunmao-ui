import { Props, DisplayedLog } from './type';
import React, { useCallback } from 'react';
import { DebugTable } from './Table';
import { Box, Button, Tooltip } from '@chakra-ui/react';
import { css } from '@emotion/css';
import { ExplorerMenuTabs } from '../../constants/enum';
import { MERGE_STATE, MODULE_EVENT, TRIGGER_EVENT } from './const';
import { ComponentId } from '../../AppModel/IAppModel';

type LogsProps = Props & {
  logs: DisplayedLog[];
  setLogs: React.Dispatch<React.SetStateAction<DisplayedLog[]>>;
  count?: number;
};

export const Logs: React.FC<LogsProps> = ({ services, logs, setLogs, count = 5 }) => {
  const {
    setSelectedComponentId,
    setExplorerMenuTab,
    setViewStateComponentId,
    dataSourceTypeCache: isDataSourceTypeCache,
  } = services.editorStore;

  const handleClick = useCallback(
    (type: string, componentId: ComponentId) => {
      switch (type) {
        case MERGE_STATE:
          setExplorerMenuTab(ExplorerMenuTabs.STATE);
          setViewStateComponentId(componentId);
          break;
        case MODULE_EVENT: // TODO
        case TRIGGER_EVENT:
        default:
          const component =
            services.appModelManager.appModel.getComponentById(componentId);
          if (component && isDataSourceTypeCache[component.type]) {
            setExplorerMenuTab(ExplorerMenuTabs.DATA);
          } else {
            setExplorerMenuTab(ExplorerMenuTabs.UI_TREE);
          }
          setSelectedComponentId(componentId);
          break;
      }
    },
    [
      isDataSourceTypeCache,
      services.appModelManager.appModel,
      setExplorerMenuTab,
      setSelectedComponentId,
      setViewStateComponentId,
    ]
  );

  const eventColumns = [
    {
      title: 'Time',
      dataIndex: 'time',
    },
    {
      title: 'Event',
      dataIndex: 'eventType',
    },
    {
      title: 'Target',
      dataIndex: 'target',
      render: (_col: any, item: any) => {
        return (
          <Box
            cursor="pointer"
            fontWeight="bold"
            onClick={() => {
              handleClick(item.type, item.target);
            }}
          >
            {item.target}
          </Box>
        );
      },
    },
    {
      title: 'Parameters',
      dataIndex: 'parameters',
      render: (_col: any, item: any) => {
        const parameters = JSON.stringify(item.parameters);
        return (
          <Tooltip label={parameters}>
            <div
              className={css`
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              `}
            >
              {parameters}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'Method',
      dataIndex: 'methodName',
    },
    {
      title: 'TriggerId',
      dataIndex: 'triggerId',
      render: (_col: any, item: any) => {
        return (
          <Box
            cursor="pointer"
            fontWeight="bold"
            onClick={() => {
              handleClick(item.type, item.triggerId);
            }}
          >
            {item.triggerId}
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <DebugTable
        className={css`
          table-layout: fixed;
          tbody td {
            height: 40px;
          }
        `}
        columns={eventColumns}
        data={logs}
        pagination={{ hideOnSinglePage: true, pageSize: count }}
        emptyMessage="No Logs"
        footer={
          !!logs.length && (
            <Button
              onClick={() => {
                setLogs([]);
              }}
              size="sm"
            >
              clear
            </Button>
          )
        }
      />
    </Box>
  );
};
