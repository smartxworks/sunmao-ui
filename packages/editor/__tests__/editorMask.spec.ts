import {whereIsMouse} from '../src/components/EditorMaskWrapper'

const mockRects = JSON.parse(
  '{"button19":{"x":307,"y":85,"width":45.046875,"height":40,"top":85,"right":352.046875,"bottom":125,"left":307},"button15":{"x":393.046875,"y":102,"width":40,"height":40,"top":102,"right":433.046875,"bottom":142,"left":393.046875},"input18":{"x":457.046875,"y":102,"width":34,"height":40,"top":102,"right":491.046875,"bottom":142,"left":457.046875},"vstack20":{"x":515.046875,"y":102,"width":55.359375,"height":40,"top":102,"right":570.40625,"bottom":142,"left":515.046875},"hstack14":{"x":376.046875,"y":85,"width":211.359375,"height":74,"top":85,"right":587.40625,"bottom":159,"left":376.046875},"input16":{"x":376.046875,"y":199,"width":211.359375,"height":40,"top":199,"right":587.40625,"bottom":239,"left":376.046875},"stack13":{"x":376.046875,"y":85,"width":211.359375,"height":154,"top":85,"right":587.40625,"bottom":239,"left":376.046875},"button17":{"x":611.40625,"y":85,"width":45.046875,"height":40,"top":85,"right":656.453125,"bottom":125,"left":611.40625},"button23":{"x":714.453125,"y":119,"width":61.359375,"height":40,"top":119,"right":775.8125,"bottom":159,"left":714.453125},"button24":{"x":799.8125,"y":119,"width":61.359375,"height":40,"top":119,"right":861.171875,"bottom":159,"left":799.8125},"hstack22":{"x":697.453125,"y":102,"width":298.546875,"height":74,"top":102,"right":996,"bottom":176,"left":697.453125},"vstack21":{"x":680.453125,"y":85,"width":332.546875,"height":108,"top":85,"right":1013,"bottom":193,"left":680.453125},"hstack12":{"x":290,"y":68,"width":740,"height":188,"top":68,"right":1030,"bottom":256,"left":290}}'
);

it('detect mouse position', () => {
  expect(whereIsMouse(-1, -1, mockRects)).toBe('')
  expect(whereIsMouse(10000, 10000, mockRects)).toBe('')
  expect(whereIsMouse(668, 166, mockRects)).toBe('hstack12')
  expect(whereIsMouse(957, 127, mockRects)).toBe('hstack22')
  expect(whereIsMouse(409, 126, mockRects)).toBe('button15')
})
