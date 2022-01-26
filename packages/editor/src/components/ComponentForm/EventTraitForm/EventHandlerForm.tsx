import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  Switch,
  VStack,
} from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import { CloseIcon } from '@chakra-ui/icons';
import { observer } from 'mobx-react-lite';
import { useFormik } from 'formik';
import { EventHandlerSchema } from '@sunmao-ui/runtime';
import { formWrapperCSS } from '../style';
import { KeyValueEditor } from '../../KeyValueEditor';
import { EditorServices } from '../../../types';
import { ComponentModel } from '../../../AppModel/ComponentModel';
import { AppModel } from '../../../AppModel/AppModel';

type Props = {
  eventTypes: readonly string[];
  handler: Static<typeof EventHandlerSchema>;
  onChange: (hanlder: Static<typeof EventHandlerSchema>) => void;
  onRemove: () => void;
  hideEventType?: boolean;
  services: EditorServices;
};

export const EventHandlerForm: React.FC<Props> = observer(props => {
  const { handler, eventTypes, onChange, onRemove, hideEventType, services } = props;
  const { registry, editorStore } = services;
  const { components } = editorStore;
  const [methods, setMethods] = useState<string[]>([]);

  const updateMethods = useCallback(
    (componentId: string) => {
      const component = components.find(c => c.id === componentId);
      if (component) {
        const componentModel = new ComponentModel(
          new AppModel([], registry),
          component,
          registry
        );

        setMethods(componentModel.methods.map(m => m.name));
      }
    },
    [components, registry]
  );

  useEffect(() => {
    if (handler.componentId) {
      updateMethods(handler.componentId);
    }
  }, [handler, updateMethods]);

  const onTargetComponentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateMethods(e.target.value);
  };

  const formik = useFormik({
    initialValues: handler,
    onSubmit: values => {
      onChange(values);
    },
  });

  const typeField = (
    <FormControl>
      <FormLabel>Event Type</FormLabel>
      <Select
        name="type"
        placeholder="Select Event Type"
        onChange={formik.handleChange}
        onBlur={() => formik.submitForm()}
        value={formik.values.type}
      >
        {eventTypes.map(e => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </Select>
    </FormControl>
  );
  const targetField = (
    <FormControl>
      <FormLabel>Target Component</FormLabel>
      <Select
        name="componentId"
        placeholder="Select Target Component"
        onChange={e => {
          onTargetComponentChange(e);
          formik.handleChange(e);
        }}
        onBlur={() => formik.submitForm()}
        value={formik.values.componentId}
      >
        {components.map(c => (
          <option key={c.id} value={c.id}>
            {c.id}
          </option>
        ))}
      </Select>
    </FormControl>
  );
  const methodField = (
    <FormControl>
      <FormLabel>Method</FormLabel>
      <Select
        name="method.name"
        placeholder="Select Method"
        onChange={formik.handleChange}
        onBlur={() => formik.submitForm()}
        value={formik.values.method.name}
      >
        {methods.map(m => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </Select>
    </FormControl>
  );

  const parametersField = (
    <FormControl>
      <FormLabel>Parameters</FormLabel>
      <KeyValueEditor
        initValue={formik.values.method.parameters}
        onChange={json => {
          formik.setFieldValue('method.parameters', json);
          formik.submitForm();
        }}
      />
    </FormControl>
  );

  const waitTypeField = (
    <FormControl>
      <FormLabel>Wait Type</FormLabel>
      <Select
        name="wait.type"
        onChange={formik.handleChange}
        onBlur={() => formik.submitForm()}
        value={formik.values.wait?.type}
      >
        <option value="delay">delay</option>
        <option value="debounce">debounce</option>
        <option value="throttle">throttle</option>
      </Select>
    </FormControl>
  );

  const waitTimeField = (
    <FormControl>
      <FormLabel>Wait Time</FormLabel>
      <Input
        name="wait.time"
        onChange={formik.handleChange}
        onBlur={() => formik.submitForm()}
        value={formik.values.wait?.time}
      />
    </FormControl>
  );

  const disabledField = (
    <FormControl>
      <FormLabel>Disabled</FormLabel>
      <Switch
        name="disabled"
        isChecked={formik.values.disabled}
        onChange={formik.handleChange}
        onBlur={() => formik.submitForm()}
      />
    </FormControl>
  );

  return (
    <Box position="relative" width="100%">
      <VStack className={formWrapperCSS}>
        {hideEventType ? null : typeField}
        {targetField}
        {methodField}
        {parametersField}
        {waitTypeField}
        {waitTimeField}
        {disabledField}
      </VStack>
      <IconButton
        position="absolute"
        right="4"
        top="4"
        aria-label="remove event handler"
        variant="ghost"
        colorScheme="red"
        size="xs"
        icon={<CloseIcon />}
        onClick={onRemove}
      />
    </Box>
  );
});
