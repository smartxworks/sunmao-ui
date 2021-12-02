import React from 'react';
import { ExplorerForm } from './ExplorerForm/ExplorerForm';
import { ExplorerTree } from './ExplorerTree';

export const Explorer: React.FC = () => {
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
      <ExplorerForm
        formType={formType}
        version={currentVersion}
        name={currentName}
        onBack={onBack}
      />
    );
  }
  return <ExplorerTree onEdit={onEdit} />;
};
