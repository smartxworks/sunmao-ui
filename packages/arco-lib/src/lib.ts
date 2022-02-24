import "@arco-design/web-react/dist/css/arco.css";
import { Registry, SunmaoLib } from "@sunmao-ui/runtime";
import { Button } from "./components/Button";
import { Layout } from "./components/Layout";
import { Image } from "./components/Image";
import { Select } from "./components/Select";
import { Menu } from "./components/Menu";
import { Dropdown } from "./components/Dropdown";
import { Space } from "./components/Space";
import { Icon } from "./components/Icon";
import { Input } from "./components/Input";
import { Divider } from "./components/Divider";
import { Avatar } from "./components/Avatar";
import { Mentions } from "./components/Mentions";
import { Progress } from "./components/Progress";
import { Badge } from "./components/Badge";
import { Tooltip } from "./components/Tooltip";
import { Popover } from "./components/Popover";
import { Collapse, CollapseItem } from "./components/Collapse";
import { Cascader } from "./components/Cascader";
import { Skeleton } from "./components/Skeleton";
import { Timeline } from "./components/Timeline";
import { Tree } from "./components/Tree";
import { TreeSelect } from "./components/TreeSelect";
import { Checkbox } from "./components/Checkbox";
import { Modal } from "./components/Modal";
import { Radio } from "./components/Radio";
import { Table } from "./components/Table";
import { Pagination } from "./components/Pagination";
import { Steps } from "./components/Steps";
import { Alert } from "./components/Alert";
import { Link } from "./components/Link";
import { Switch } from "./components/Switch";
import { PasswordInput } from "./components/PasswordInput";
import { TextArea } from "./components/TextArea";

type Component = Parameters<Registry["registerComponent"]>[0];
type Trait = Parameters<Registry["registerTrait"]>[0];
type Module = Parameters<Registry["registerModule"]>[0];

export const components: Component[] = [
  Table,
  Pagination,
  Steps,
  Tree,
  TreeSelect,
  Modal,
  Button,
  Layout,
  Image,
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
  CollapseItem,
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
];
export const traits: Trait[] = [];
export const modules: Module[] = [];

export const ArcoDesignLib: SunmaoLib = {
  components,
  traits,
  modules,
};

export function install(registry: Registry) {
  components.forEach((c) => registry.registerComponent(c));
  traits.forEach((t) => registry.registerTrait(t));
  modules.forEach((m) => registry.registerModule(m));
}
