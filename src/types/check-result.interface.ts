import { Dependency } from './dependency.interface';

export interface CheckResult {
  /**
   * File name containing
   * violation
   */
  source: string;

  /**
   * Dependency data
   */
  dependency: Dependency;

  /**
   * Message to display
   */
  message: string;

  /**
   * `1`: warning
   * `2`: error
   */
  level: resultLevel;
}

export interface CheckResults {
  [boxName: string]: CheckResult[];
}

export type resultLevel = 0 | 1 | 2;
