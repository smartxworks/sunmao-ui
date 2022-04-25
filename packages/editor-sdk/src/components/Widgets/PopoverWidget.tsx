import React, { useState, useEffect, useCallback, useImperativeHandle } from 'react';
import {
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  IconButton,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import mitt from 'mitt';
import { SpecWidget } from './SpecWidget';
import { implementWidget } from '../../utils/widget';
import { WidgetProps } from '../../types/widget';
import { CORE_VERSION, POPOVER_WIDGET_NAME } from '@sunmao-ui/shared';

type EvenType = {
  'sub-popover-close': string[];
  'other-popover-close': string[];
};

type PopoverWidgetHandler = {
  open: () => void;
  close: () => void;
};

type Children = {
  trigger?: React.ReactElement;
  body?: React.ReactElement;
};

const emitter = mitt<EvenType>();

export const PopoverWidget = React.forwardRef<
  PopoverWidgetHandler,
  React.ComponentPropsWithoutRef<React.ComponentType> & WidgetProps
>((props, ref) => {
  const { spec, path, children } = props;
  const isObjectChildren = children && typeof children === 'object';
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    emitter.emit('other-popover-close', path);
  }, [path]);
  const handleClickTrigger = useCallback(event => {
    event.stopPropagation();
  }, []);
  const handleClickContent = useCallback(
    event => {
      event.stopPropagation();
      emitter.emit('sub-popover-close', path);
    },
    [path]
  );
  const handlerCloseByParent = useCallback(
    (fromPath: string[]) => {
      const fromPathString = fromPath.join('.');
      const pathString = path.join('.');
      const isParent =
        pathString !== fromPathString && pathString.startsWith(fromPathString);

      if (isParent) {
        setIsOpen(false);
      }
    },
    [path]
  );
  const handlerCloseByOther = useCallback(
    (fromPath: string[]) => {
      const fromPathString = fromPath.join('.');
      const pathString = path.join('.');
      const isRelated =
        pathString.startsWith(fromPathString) || fromPathString.startsWith(pathString);

      if (!isRelated) {
        setIsOpen(false);
      }
    },
    [path]
  );

  useEffect(() => {
    emitter.on('sub-popover-close', handlerCloseByParent);
    emitter.on('other-popover-close', handlerCloseByOther);

    return () => {
      emitter.off('sub-popover-close', handlerCloseByParent);
      emitter.off('other-popover-close', handlerCloseByOther);
    };
  }, [handlerCloseByParent, handlerCloseByOther]);
  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true);
      emitter.emit('other-popover-close', path);
    },
    close() {
      setIsOpen(false);
      emitter.emit('sub-popover-close', path);
    },
  }));

  return (
    <Popover placement="left" closeOnBlur={false} isOpen={isOpen} onOpen={handleOpen}>
      <PopoverTrigger>
        {isObjectChildren && 'trigger' in children ? (
          (children as Children).trigger
        ) : (
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Setting"
            icon={<SettingsIcon />}
            onClick={handleClickTrigger}
          />
        )}
      </PopoverTrigger>
      <Portal>
        <PopoverContent onClick={handleClickContent}>
          <PopoverArrow />
          <PopoverBody maxHeight="400px" overflow="auto">
            {isObjectChildren && 'body' in children ? (
              (children as Children).body
            ) : (
              <SpecWidget
                {...props}
                spec={{
                  ...spec,
                  widget: spec.widget === `${CORE_VERSION}/${POPOVER_WIDGET_NAME}` ? '' : spec.widget,
                }}
              />
            )}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
});

export default implementWidget({
  version: CORE_VERSION,
  metadata: {
    name: POPOVER_WIDGET_NAME,
  },
})(PopoverWidget);
