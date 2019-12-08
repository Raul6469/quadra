import * as parser from '@babel/parser';
import * as t from '@babel/types';
import traverse, { Visitor } from '@babel/traverse';

import { Options } from '../types/options.interface';
import { resolveFileDependencyPath } from './resolvers';
import { FileDependencies } from '../types/dependency-matrix.type';

const DependencyVisitor: Visitor<VisitorContext> = {
  ImportDeclaration(path) {
    const importedFile = resolveFileDependencyPath(path.node.source.value, this.path, this.options);
    this.dependencies[importedFile] = {
      location: path.node.loc,
      imported: importedFile,
      type: path.node.source.value.startsWith('.') ? 'file' : 'module',
    };
  },
  CallExpression(path) {
    if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'require') {
      const argument = path.node.arguments[0];
      if (t.isStringLiteral(argument)) {
        const importedFile = resolveFileDependencyPath(argument.value, this.path, this.options);
        (this as VisitorContext).dependencies[importedFile] = {
          location: path.node.loc,
          imported: importedFile,
          type: argument.value.startsWith('.') ? 'file' : 'module',
        };
      }
    }
  },
};

export function loadFileDependencies(path: string, source: string, options: Options): FileDependencies {
  const ast = parser.parse(source, {
    sourceType: 'unambiguous',
    plugins: [
      'typescript',
      'throwExpressions',
    ],
  });

  const dependencies = {};

  traverse(ast, DependencyVisitor, undefined, { dependencies, path, options } as VisitorContext);

  return dependencies;
}

interface VisitorContext {
  dependencies: FileDependencies;
  path: string;
  options: Options;
}
