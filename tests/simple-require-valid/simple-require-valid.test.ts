import * as quadra from '../../src/index';

describe('simple case with ES6 modules and valid imports', () => {
  it('should find no errors', async () => {
    const result = await quadra.check({
      root: __dirname,
      boxes: {
        entry: {
          files: ['src/entry.js'],
          rules: {
            boxes: {
              only: ['lib'],
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
    expect(result.lib.length).toBe(0);
  });
});
