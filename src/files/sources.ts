import * as fs from 'fs';
import * as path from 'path';
import _ from 'lodash';
import { parseComponent } from 'vue-sfc-parser';
import { Options } from '../types/options.interface';

export async function readSource(file: string, options: Options): Promise<string> {
  const content = await readFile(file, options);
  if (file.endsWith('.vue')) {
    // Vue single file component
    // We extract <script> content
    return parseVueSFC(content);
  }
  return content;
}

//
// Private functions
//

async function parseVueSFC(content: string) {
  const descriptor = parseComponent(content);
  const lines = content.substring(0, descriptor.script.calcGlobalOffset(0)).split('\n');

  return _.repeat('\n', lines.length - 1) + descriptor.script.content;
}

async function readFile(file: string, options: Options): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(options.root, file), (err, data) => {
      if (err) return reject(err);
      resolve(data.toString());
    });
  });
}
