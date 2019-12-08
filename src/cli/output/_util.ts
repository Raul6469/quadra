import * as _ from 'lodash';

export function indent(times: number) {
  return _.repeat('  ', times);
}

export function jumpLine(times: number) {
  console.log(_.repeat('', times));
}
