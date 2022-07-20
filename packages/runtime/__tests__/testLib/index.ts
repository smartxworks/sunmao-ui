// test
import TestButton from './Button';
import TestTester from './Tester';
import TestInput from './Input';
import TestTabs from './Tabs';
import TimeoutTrait from './TimeoutTrait';
import { SunmaoLib } from '../../src';

export const TestLib: SunmaoLib = {
  components: [TestButton, TestTester, TestInput, TestTabs],
  traits: [TimeoutTrait],
};
