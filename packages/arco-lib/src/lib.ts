import { SunmaoLib } from '@sunmao-ui/runtime';
import { Button } from './components/Button';
import { Layout } from './components/Layout';
import { Image, ImageGroup } from './components/Image';
import { Select } from './components/Select';
import { Menu } from './components/Menu';
import { Dropdown } from './components/Dropdown';
import { Space } from './components/Space';
import { Icon } from './components/Icon';
import { Input } from './components/Input';
import { Divider } from './components/Divider';
import { Avatar } from './components/Avatar';
import { Mentions } from './components/Mentions';
import { Progress } from './components/Progress';
import { Badge } from './components/Badge';
import { Tooltip } from './components/Tooltip';
import { Popover } from './components/Popover';
import { Collapse } from './components/Collapse';
import { Cascader } from './components/Cascader';
import { Skeleton } from './components/Skeleton';
import { Timeline } from './components/Timeline';
import { Tree } from './components/Tree';
import { TreeSelect } from './components/TreeSelect';
import { Checkbox } from './components/Checkbox';
import { Modal } from './components/Modal';
import { Radio } from './components/Radio';
import { Table } from './components/Table/Table';
import { Pagination } from './components/Pagination';
import { Steps } from './components/Steps';
import { Alert } from './components/Alert';
import { Link } from './components/Link';
import { Switch } from './components/Switch';
import { PasswordInput } from './components/PasswordInput';
import { NumberInput } from './components/NumberInput';
import { TextArea } from './components/TextArea';
import { Tabs } from './components/Tabs';
import { FormControl } from './components/Form/FormControl';
import { Descriptions } from './components/Descriptions';
import { Row, Col } from './components/Grid';
import { Slider } from './components/Slider';
import { DatePicker } from './components/DatePicker';
import { TimePicker } from './components/TimePicker';
import { Carousel } from './components/Carousel';
import { Tag } from './components/Tag';

import './style.css';
import { MessageUtilMethodFactory } from './methods/Message';

export const components: SunmaoLib['components'] = [
  Tag,
  Table,
  Pagination,
  Steps,
  Tree,
  TreeSelect,
  Modal,
  Button,
  Layout,
  Image,
  ImageGroup,
  Select,
  Menu,
  Dropdown,
  Space,
  Icon,
  Input,
  Divider,
  Avatar,
  Mentions,
  Progress,
  Badge,
  Tooltip,
  Popover,
  Collapse,
  Cascader,
  Skeleton,
  Timeline,
  Radio,
  Checkbox,
  Alert,
  Link,
  Switch,
  PasswordInput,
  TextArea,
  Tabs,
  FormControl,
  Descriptions,
  Row,
  Col,
  Slider,
  DatePicker,
  TimePicker,
  NumberInput,
  Carousel,
];
export const traits: SunmaoLib['traits'] = [];
export const modules: SunmaoLib['modules'] = [];
export const utilMethods: SunmaoLib['utilMethods'] = [MessageUtilMethodFactory];

export const ArcoDesignLib: SunmaoLib = {
  components,
  traits,
  modules,
  utilMethods,
};
