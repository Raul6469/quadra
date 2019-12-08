import _ from 'lodash';
import * as quadra from '../../src/index';

describe('simple case with ES6 modules and invalid imports', () => {
  it('should detect error', async () => {
    const result = await quadra.check({
      root: __dirname,
      boxes: {
        entry: {
          files: ['src/entry.js'],
          rules: {
            boxes: {
              only: [],
            },
            modules: { ban: [] },
          },
        },
        lib: {
          files: ['src/lib.js'],
          rules: {
            boxes: {
              only: [],
            },
            modules: { ban: [] },
          },
        },
      },
    });

    expect(result.lib.length).toBe(0);
    expect(result.entry.length).toBe(1);

    const dependency = result.entry[0];

    expect(dependency).toMatchObject({
      message: 'Dependency from entry ---> lib',
      source: 'src/entry.js',
      dependency: {
        location: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 40 },
        },
        imported: 'src/lib.js',
        type: 'file',
      },
    });
  });
});
