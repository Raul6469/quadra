import _ from 'lodash';
import chalk from 'chalk';
import { jumpLine, indent } from './_util';
import { CheckResults } from '../../types/check-result.interface';

export function displayCheckResults(results: CheckResults) {
  _.forEach(results, (boxResults, boxName) => {
    if (_.isEmpty(boxResults)) {
      console.log(
        chalk.bgGreen.black(' PASS '),
        chalk.gray.bold(boxName),
      );
    } else {
      jumpLine(1);
      if (boxResults.filter(r => r.level > 1).length === 0) {
        console.log(
          chalk.bgYellow.black(' WARN '),
          chalk.yellow.bold(boxName),
        );
        console.log(indent(3), chalk.yellow(`uses ${boxResults.length} incorrect dependencies`));
      } else {
        console.log(
          chalk.bgRed.bold(' FAIL '),
          chalk.red.bold(boxName),
          );
        console.log(indent(3), chalk.red(`uses ${boxResults.length} incorrect dependencies`));
      }
      jumpLine(1);
      boxResults.forEach(violation => {
        console.log(
          indent(1),
          violation.message,
        );

        console.log(
          indent(1),
          chalk.gray('at'),
          chalk.gray.underline(
            `${violation.source}:${violation.dependency.location.start.line}:${violation.dependency.location.start.column}`,
          ));
        jumpLine(1);
      });
      jumpLine(1);
    }
  });

  jumpLine(1);

  const failed = _.flatten(_.values(results)).length;
  const warns = _.flatten(_.values(results)).filter(r => r.level < 2).length;
  const errors = _.flatten(_.values(results)).filter(r => r.level >= 2).length;
  if (failed === 0) {
    console.log(chalk.green('All good!'));
  } else {
    if (errors) {
      console.log(chalk.red.bold(`${errors} failures.`));
    }
    if (warns) {
      console.log(chalk.yellow.bold(`${warns} warnings.`));
    }
  }

  jumpLine(1);
}
