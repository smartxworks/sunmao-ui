// test
import TestButton from './Button';
import TestTester from './Tester';
import TestInput from './Input';
import TimeoutTrait from './TimeoutTrait';
import { SunmaoLib } from '../../src';

export const TestLib: SunmaoLib = {
  components: [TestButton, TestTester, TestInput, TimeoutTrait],
  traits: [TimeoutTrait],
};
