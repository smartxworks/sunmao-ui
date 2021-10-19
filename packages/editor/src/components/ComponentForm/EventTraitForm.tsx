import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import { Static } from '@sinclair/typebox';
import { ChangeEvent, useMemo, useState } from 'react';
import { ApplicationComponent } from '../../../../core/lib';
import { eventBus } from '../../eventBus';
import { registry } from '../../metaUI';
import {
  AddTraitOperation,
  ModifyTraitPropertyOperation,
} from '../../operations/Operations';
import { useAppModel } from '../../operations/useAppModel';

const EventHandlerSchema = Type.Object({
  type: Type.String(),
  componentId: Type.String(),
  method: Type.Object({
    name: Type.String(),
    parameters: Type.Any(),
  }),
  wait: Type.Optional(
    Type.Object({
      type: Type.KeyOf(
        Type.Object({
          debounce: Type.String(),
          throttle: Type.String(),
          delay: Type.String(),
        })
      ),
      time: Type.Number(),
    })
  ),
  disabled: Type.Optional(Type.Boolean()),
});

type EventHandler = Static<typeof EventHandlerSchema>;

type Props = {
  component: ApplicationComponent;
  handlers: EventHandler[];
};

const EventHandlerForm: React.FC<{ eventTypes: string[]; handler: EventHandler }> =
  props => {
    const { handler, eventTypes } = props;
    const { app } = useAppModel();
    const [methods, setMethods] = useState<string[]>([]);
    const onComponentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const type = app.spec.components.find(c => c.id === e.target.value)?.type;
      console.log('type', type);
      const componentSpec = registry.getComponentByType(type!).spec;
      setMethods(componentSpec.methods.map(m => m.name));
    };
    return (
      <form>
        <FormControl>
          <FormLabel>Event Type</FormLabel>
          <Select defaultValue={handler.type}>
            {eventTypes.map(e => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Target Component</FormLabel>
          <Select defaultValue={handler.componentId} onChange={onComponentChange}>
            {app.spec.components.map(c => (
              <option key={c.id} value={c.id}>
                {c.id}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Method</FormLabel>
          <Select defaultValue={handler.componentId}>
            {methods.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Parameters</FormLabel>
          <Input />
        </FormControl>
      </form>
    );
  };

export const EventTraitForm: React.FC<Props> = props => {
  const { component, handlers } = props;

  const eventTypes = useMemo(() => {
    return registry.getComponentByType(component.type).spec.events;
  }, [component]);

  if (!eventTypes.length) return null;

  const handlerForms = handlers.map((h, i) => {
    return <EventHandlerForm key={i} handler={h} eventTypes={eventTypes} />;
  });

  const onClickAddHandler = () => {
    const newHandler: EventHandler = {
      type: eventTypes[0],
      componentId: '',
      method: {
        name: '',
        parameters: undefined,
      },
    };

    if (handlers.length === 0) {
      eventBus.send(
        'operation',
        new AddTraitOperation(component.id, 'core/v1/event', { handlers: [newHandler] })
      );
    } else {
      eventBus.send(
        'operation',
        new ModifyTraitPropertyOperation(component.id, 'core/v1/event', 'handlers', [
          ...handlers,
          newHandler,
        ])
      );
    }
  };

  return (
    <VStack width="full">
      <HStack width="full" justify="space-between">
        <strong>Events</strong>
        <IconButton
          aria-label="add event"
          size="sm"
          variant="ghost"
          icon={<AddIcon />}
          onClick={onClickAddHandler}
        />
      </HStack>
      <Box width="full">{handlerForms}</Box>
    </VStack>
  );
};
