import { initSunmaoEditor } from '../src';
import { sunmaoChakraUILib } from '@sunmao-ui/chakra-ui-lib';
export const { registry } = initSunmaoEditor();
registry.installLib(sunmaoChakraUILib);
