import { Dependency } from './dependency.interface';

export interface DependencyMatrix {
  [fileName: string]: FileDependencies;
}

export interface FileDependencies {
  [fileName: string]: Dependency;
}
