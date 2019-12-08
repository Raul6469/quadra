import { SourceLocation } from '@babel/types';

export interface Dependency {
  /**
   * Can be file path or module name
   */
  imported: string;

  /**
   * Import or require location
   * in source code
   */
  location: SourceLocation;

  type: DependencyType;
}

type DependencyType = 'file' | 'module';
