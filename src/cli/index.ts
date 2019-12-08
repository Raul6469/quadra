import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import _ from 'lodash';
import { check } from '../index';
import { Options, Box } from '../types/options.interface';
import { displayCheckResults } from './output/check';
import { validateConfig } from './config-validator';

const DEFAULT_BOX_OPTIONS: Box = {
  files: [],
  severity: 'error',
  rules: {
    boxes: { only: [] },
    modules: { ban: [] },
  },
};

export async function loadCLI() {
  const configFile = loadConfigFile();

  validateConfig(configFile);

  const options: Options = {
    root: process.cwd(),
    ...configFile,
  };

  // Assign default values for each box setting
  _.forEach(options.boxes, (box, name) => {
    options.boxes[name] = _.defaultsDeep(box, DEFAULT_BOX_OPTIONS);
  });

  // Here merge options with CLI arguments
  const results = await check(options);
  displayCheckResults(results);
  const errors = _.flatten(_.values(results)).filter(r => r.level >= 2).length;
  process.exitCode = errors ? 2 : 0;
}

function loadConfigFile(): Options {
  try {
    const configFile = fs.readFileSync(path.resolve(process.cwd(), '.quadra.yml'));
    return yaml.safeLoad(configFile.toString());
  } catch (e) {
    throw new Error('Could not read .quadra.yml file');
  }
}
