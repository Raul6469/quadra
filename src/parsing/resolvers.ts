import * as path from 'path';
import { Options } from '../types/options.interface';

export function resolveFileDependencyPath(dependency: string, file: string, options: Options) {
  if (!dependency.startsWith('.')) return dependency; // Module dependency
  try {
    // Try native module resolution
    // Will work for JavaScript modules
    const resolved = path.relative(
      options.root,
      require.resolve(dependency, {
        paths: [path.dirname(path.resolve(options.root, file))],
      }),
    );
    return toUnixPath(resolved);
  } catch (e) {
    if (file.endsWith('.ts')) {
      // If current file is a TypeScript file,
      // we try to resolve dependency by specifying
      // the extension
      try {
        return resolveTSFileDependencyPath(dependency, file, options);
      } catch (e) {
        // We didn't find anything... :(
      }
    }
    console.log(`Unable to resolve dependency: ${dependency}`);
    return dependency;
  }
}

//
// Private functions
//

function resolveTSFileDependencyPath(dependency: string, file: string, options: Options): string {
  const possibleModuleSuffixes = [
    '.ts',
    '.tsx',
    '.d.ts',
    '/index.ts',
    '/index.tsx',
    '/index.d.ts',
  ];
  for (const i in possibleModuleSuffixes) {
    try {
      const resolved = path.relative(
        options.root,
        require.resolve(
          `${dependency}${possibleModuleSuffixes[i]}`,
          { paths: [path.dirname(path.resolve(options.root, file))] },
        ),
      );
      return toUnixPath(resolved);
    } catch (e) {
      // Ignore and continue to resolve
    }
  }
  throw new Error('Could not find matching TypeScript module');
}

function toUnixPath(filePath: string) {
  return filePath.replace(/\\/g, '/');
}
