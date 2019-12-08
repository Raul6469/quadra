import _ from 'lodash';
import { Options } from '../types/options.interface';
import { readSource } from '../files/sources';
import { DependencyMatrix } from '../types/dependency-matrix.type';
import { loadFileDependencies } from '../parsing/ast';

export async function buildDependencyMatrix(filePaths: string[], options: Options): Promise<DependencyMatrix> {
  const matrix = {};
  const promises = filePaths.map(async filePath => {
    const source = await readSource(filePath, options);
    const dependencies = loadFileDependencies(filePath, source, options);
    matrix[filePath] = dependencies;
  });
  await Promise.all(promises);
  return matrix;
}
