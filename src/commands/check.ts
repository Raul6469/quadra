import _ from 'lodash';
import { Options } from '../types/options.interface';
import { CheckResult, CheckResults } from '../types/check-result.interface';
import { loadBoxesFiles } from '../files/globs';
import { buildDependencyMatrix } from '../matrix';
import { Dependency } from '../types/dependency.interface';

/**
 * Loads all files contained in a least
 * one box and returns a dependency matrix
 * containing incorrect dependencies
 */
export async function check(options: Options): Promise<CheckResults> {
  const boxFiles = await loadBoxesFiles(options);
  const filesToParse = _.flatten(_.values(boxFiles));
  const matrix = await buildDependencyMatrix(filesToParse, options);

  const results = {};

  _.forEach(boxFiles, (files, boxName) => {
    const boxResult: CheckResult[] = [];

    files.forEach(file => {
      const dependencies = matrix[file];
      _.forEach(dependencies, dependency => {
        if (dependency.type === 'module') {
          const result = validateModuleDependency(boxName, file, dependency, options);
          if (result) boxResult.push(result);
        }

        if (dependency.type === 'file') {
          const result = validateFileDependency(boxFiles, boxName, file, dependency, options);
          if (result) boxResult.push(result);
        }
      });
    });

    results[boxName] = boxResult;
  });

  return results;
}

function validateFileDependency(
  boxFiles: {[name: string]: string[]},
  boxName: string,
  currentFile: string,
  dependency: Dependency,
  options: Options,
): CheckResult {
  const importedBoxes = getBoxesContainingFile(dependency.imported, boxFiles);

  if (_.isEmpty(importedBoxes)) {
    // Imported does not belong to any
    // of the boxes, so we ignore it
    return;
  }

  const allowedDependencies = _.intersection(options.boxes[boxName].rules.boxes.only, importedBoxes);
  if (allowedDependencies.length === 0) {
    return {
      message: `Dependency from ${boxName} ---> ${importedBoxes.join(', ')}`,
      dependency,
      source: currentFile,
      level: options.boxes[boxName].severity === 'warning' ? 1 : 2,
    };
  }
}

function validateModuleDependency(
  boxName: string,
  currentFile: string,
  dependency: Dependency,
  options: Options,
): CheckResult {
  if (options.boxes[boxName].rules.modules.ban.includes(dependency.imported)) {
    return {
      message: `Unauthorized import of ${dependency.imported} in ${boxName}`,
      dependency,
      source: currentFile,
      level: options.boxes[boxName].severity === 'warning' ? 1 : 2,
    };
  }
}

function getBoxesContainingFile(file: string, boxFiles: {[name: string]: string[]}) {
  const boxes = [];
  _.forEach(boxFiles, (files, name) => {
    if (files.includes(file)) {
      boxes.push(name);
    }
  });
  return boxes;
}
