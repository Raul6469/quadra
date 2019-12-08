import glob from 'glob';
import * as _ from 'lodash';
import chalk from 'chalk';
import { Options } from '../types/options.interface';

/**
 * Returns a map containing files path
 * for each box
 */
export async function loadBoxesFiles(options: Options): Promise<{[name: string]: string[]}> {
  const filesMap = {};
  const boxNames = Object.keys(options.boxes);
  const promises = boxNames.map(async (boxName) => {
    const globs = options.boxes[boxName].files;
    filesMap[boxName] = await loadGlobFilesArray(globs, options);
  });
  await Promise.all(promises);
  return filesMap;
}

//
// Private functions
//

async function loadGlobFilesArray(patterns: string[], options: Options): Promise<string[]> {
  const includePatterns = patterns.filter(p => !p.startsWith('!'));
  const excludePatterns = patterns.filter(p => p.startsWith('!')).map(p => p.slice(1));

  const promises = _.map(includePatterns, async pattern =>
    globFiles(pattern, excludePatterns, options) as Promise<string[]>,
  );
  const files = await Promise.all(promises);
  return _.chain(files)
    .flatten()
    .sortedUniq()
    .value();
}

async function globFiles(pattern: string, ignoredPatterns: string[], options: Options): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, {
      nodir: true,
      cwd: options.root,
      dot: true,
      ignore: ignoredPatterns,
    }, (err, files) => {
      if (err) {
        console.log(chalk.yellow(`Invalid pattern ${pattern}`));
        resolve([]);
      }
      resolve(files);
    });
  });
}
