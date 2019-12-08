import * as quadra from '../../src/index';

describe('Parse .vue files', () => {
  it('should find invalid imports', async () => {
    const result = await quadra.check({
      root: __dirname,
      boxes: {
        entry: {
          files: ['src/entry.vue'],
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
      source: 'src/entry.vue',
      message: 'Dependency from entry ---> lib',
      dependency: {
        location: {
          start: { line: 9, column: 2 },
          end: { line: 9, column: 29 },
        },
        imported: 'src/lib.js',
        type: 'file',
      },
    });
  });
});
