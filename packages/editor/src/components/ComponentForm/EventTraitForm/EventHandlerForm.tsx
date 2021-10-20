import { FormControl, FormLabel, Input, Select, VStack } from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { EventHandlerSchema } from '@meta-ui/runtime';
import { registry } from '../../../metaUI';
import { useAppModel } from '../../../operations/useAppModel';
import { formWrapperCSS } from '../style';

type Props = {
  eventTypes: string[];
  handler: Static<typeof EventHandlerSchema>;
  onChange: (hanlder: Static<typeof EventHandlerSchema>) => void;
};

export const EventHandlerForm: React.FC<Props> = props => {
  const { handler, eventTypes, onChange } = props;
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

  return (
    <VStack css={formWrapperCSS}>
      {typeField}
      {targetField}
      {methodField}
      {parametersField}
    </VStack>
  );
};
