import { mergeApplication } from '../src/mergeApplication';
import { BaseSchema, Schema1, Schema2 } from '../src/mock/mock';

describe('detect create component tests', () => {
  it('works', () => {
    const result = [
      { ok: ['text11', 'iframe14', 'stack12', 'fileInput13'] },
      {
        conflict: {
          a: ['new_text16', 'iframe14'],
          aIndex: 3,
          o: ['iframe14'],
          oIndex: 3,
          b: ['text5'],
          bIndex: 4,
        },
      },
      { ok: ['moduleContainer15'] },
    ];
    const { diffBlocks: mergeRegion } = mergeApplication(BaseSchema, Schema1, Schema2);
    expect(mergeRegion).toEqual(result);
  });
});
