// test
import TestButton from './Button';
import TestTester from './Tester';
import TestInput from './Input';
import TestTabs from './Tabs';
import TestList from './TestList';
import TimeoutTrait from './TimeoutTrait';
import CountTrait from './CountTrait';
import { SunmaoLib } from '../../src';

export const TestLib: SunmaoLib = {
  components: [TestButton, TestTester, TestInput, TestTabs, TestList],
  traits: [TimeoutTrait, CountTrait],
};
