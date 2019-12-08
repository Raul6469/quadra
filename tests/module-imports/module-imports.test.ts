import _ from 'lodash';
import * as quadra from '../../src/index';

describe('Module imports rules', () => {
  it('should report module if it is banned modules list', async () => {
    const result = await quadra.check({
      root: __dirname,
      boxes: {
        index: {
          files: ['src/index.js'],
          rules: {
            boxes: { only: [] },
            modules: {
              ban: ['lodash'],
            },
          },
        },
      },
    });

    expect(result.index.length).toBe(1);

    const dependency = result.index[0];

    expect(dependency).toMatchObject({
      message: 'Unauthorized import of lodash in index',
      source: 'src/index.js',
      dependency: {
        location: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 23 },
        },
        imported: 'lodash',
        type: 'module',
      },
    });
  });

  it('should not report module if it is not banned modules list', async () => {
    const result = await quadra.check({
      root: __dirname,
      boxes: {
        index: {
          files: ['src/index.js'],
          rules: {
            boxes: { only: [] },
            modules: { ban: [] },
          },
        },
      },
    });

    expect(result.index.length).toBe(0);
  });
});
