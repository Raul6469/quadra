export interface Options {
  root?: string;
  boxes?: Boxes;
}

interface Boxes {
  [name: string]: Box;
}

export interface Box {
  severity?: BoxSeverity;
  files: string[];
  rules: BoxRules;
}

export interface BoxRules {
  boxes: BoxDependenciesRules;
  modules: ModuleDependenciesRules;
}

export type BoxSeverity = 'error' | 'warning';

interface BoxDependenciesRules {
  only: string[];
}

interface ModuleDependenciesRules {
  ban: string[];
}
