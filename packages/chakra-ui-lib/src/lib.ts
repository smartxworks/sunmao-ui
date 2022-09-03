import { SunmaoLib } from '@sunmao-ui/runtime';
import ChakraUIRoot from './components/Root';
import ChakraUIButton from './components/Button';
import ChakraUITabs from './components/Tabs';
import ChakraUITable from './components/Table';
import ChakraUIInput from './components/Input';
import ChakraUIBox from './components/Box';
import ChakraUIDivider from './components/Divider';
import ChakraUIFormControl from './components/Form/FormControl';
import ChakraUIForm from './components/Form/Form';
import ChakraUIKbd from './components/Kbd';
import ChakraUIList from './components/List';
import ChakraUILink from './components/Link';
import ChakraUINumberInput from './components/NumberInput';
import ChakraUIMultiSelect from './components/MultiSelect';
import ChakraUICheckboxGroup from './components/CheckboxGroup';
import ChakraUICheckbox from './components/Checkbox';
import ChakraUIStack from './components/Stack';
import ChakraUISwitch from './components/Switch';
import ChakraUITooltip from './components/Tooltip';
import ChakraUIHStack from './components/HStack';
import ChakraUIVStack from './components/VStack';
import ChakraUIImage from './components/Image';
import ChakraUIDialog from './components/Dialog';
import ChakraUISelect from './components/Select';
import ChakraUIRadioGroup from './components/RadioGroup';
import ChakraUIRadio from './components/Radio';
import {
  ToastOpenUtilMethodFactory,
  ToastCloseUtilMethodFactory,
} from './components/Types/Toast';

export const sunmaoChakraUILib: SunmaoLib = {
  components: [
    ChakraUIRoot,
    ChakraUIButton,
    ChakraUITabs,
    ChakraUITable,
    ChakraUIInput,
    ChakraUIBox,
    ChakraUIDivider,
    ChakraUIFormControl,
    ChakraUIForm,
    ChakraUIKbd,
    ChakraUIList,
    ChakraUILink,
    ChakraUIMultiSelect,
    ChakraUINumberInput,
    ChakraUICheckbox,
    ChakraUICheckboxGroup,
    ChakraUIStack,
    ChakraUISwitch,
    ChakraUITooltip,
    ChakraUIHStack,
    ChakraUIVStack,
    ChakraUIImage,
    ChakraUIDialog,
    ChakraUISelect,
    ChakraUIRadioGroup,
    ChakraUIRadio,
  ],
  traits: [],
  modules: [],
  utilMethods: [ToastOpenUtilMethodFactory, ToastCloseUtilMethodFactory],
};
