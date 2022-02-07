import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { ExplorerForm } from './ExplorerForm/ExplorerForm';
import { ExplorerTree } from './ExplorerTree';
import { EditorServices } from '../../types';

type Props = {
  services: EditorServices;
};

export const Explorer: React.FC<Props> = ({ services }) => {
  const [isEditingMode, setIsEditingMode] = React.useState(false);
  const [formType, setFormType] = React.useState<'app' | 'module'>('app');
  const [currentVersion, setCurrentVersion] = React.useState<string>('');
  const [currentName, setCurrentName] = React.useState<string>('');
  const onEdit = (type: 'app' | 'module', version: string, name: string) => {
    setFormType(type);
    setCurrentVersion(version);
    setCurrentName(name);
    setIsEditingMode(true);
  };
  const onBack = () => {
    setIsEditingMode(false);
  };
  if (isEditingMode) {
    return (
      <ErrorBoundary>
        <ExplorerForm
          formType={formType}
          version={currentVersion}
          name={currentName}
          setCurrentVersion={setCurrentVersion}
          setCurrentName={setCurrentName}
          onBack={onBack}
          services={services}
        />
      </ErrorBoundary>
    );
  }
  return (
    <ErrorBoundary>
      <ExplorerTree onEdit={onEdit} services={services} />
    </ErrorBoundary>
  );
};
