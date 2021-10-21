import { useEffect, useState } from 'react';
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
import { useFormik } from 'formik';
import { EventHandlerSchema } from '@meta-ui/runtime';
import { registry } from '../../../metaUI';
import { useAppModel } from '../../../operations/useAppModel';
import { formWrapperCSS } from '../style';
import produce from 'immer';

type Props = {
  eventTypes: string[];
  handler: Static<typeof EventHandlerSchema>;
  onChange: (hanlder: Static<typeof EventHandlerSchema>) => void;
  onRemove: () => void;
};

export const EventHandlerForm: React.FC<Props> = props => {
  const { handler, eventTypes, onChange, onRemove } = props;
  const { app } = useAppModel();
  const [methods, setMethods] = useState<string[]>([]);

  function updateMethods(componentId: string) {
    const type = app.spec.components.find(c => c.id === componentId)?.type;
    if (type) {
      const componentSpec = registry.getComponentByType(type).spec;
      setMethods(componentSpec.methods.map(m => m.name));
    }
  }

  useEffect(() => {
    if (handler.componentId) {
      updateMethods(handler.componentId);
    }
  }, [handler]);

  const onTargetComponentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateMethods(e.target.value);
  };

  // because parameters is object, so it has to be converted to string to edit
  const initialValues = produce(handler, draft => {
    draft.method.parameters = JSON.stringify(draft.method.parameters);
  });

  const formik = useFormik({
    initialValues,
    onSubmit: values => {
      try {
        const newHandler = produce(values, draft => {
          draft.method.parameters = JSON.parse(draft.method.parameters);
        });
        onChange(newHandler);
      } catch (e) {
        console.error(
          `Error happened when parsing method parameters. Cannot parse ${values.method.parameters} as JSON.`
        );
        return;
      }
    },
  });

  const typeField = (
    <FormControl>
      <FormLabel>Event Type</FormLabel>
      <Select
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
        {app.spec.components.map(c => (
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
      <Input
        name="method.parameters"
        onChange={formik.handleChange}
        onBlur={() => formik.submitForm()}
        value={formik.values.method.parameters}
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
    <Box position="relative">
      <VStack css={formWrapperCSS}>
        {typeField}
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
};
