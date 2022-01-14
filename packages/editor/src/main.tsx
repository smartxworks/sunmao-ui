import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Registry } from '@sunmao-ui/runtime';
import { initSunmaoEditor } from './init';
import { sunmaoChakraUILib } from '@sunmao-ui/chakra-ui-lib';

import './styles.css';


type Options = Partial<{
  components: Parameters<Registry['registerComponent']>[0][];
  traits: Parameters<Registry['registerTrait']>[0][];
  modules: Parameters<Registry['registerModule']>[0][];
  container: Element;
}>;

const { Editor, registry } = initSunmaoEditor();

export default function renderApp(options: Options = {}) {
  const {
    components = [],
    traits = [],
    modules = [],
    container = document.getElementById('root'),
  } = options;
  components.forEach(c => registry.registerComponent(c));
  traits.forEach(t => registry.registerTrait(t));
  modules.forEach(m => registry.registerModule(m));
  registry.installLib(sunmaoChakraUILib);

  ReactDOM.render(
    <StrictMode>
      <Editor />
    </StrictMode>,
    container
  );
}
