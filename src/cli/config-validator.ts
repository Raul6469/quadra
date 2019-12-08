import _ from 'lodash';
import chalk from 'chalk';
import Joi from '@hapi/joi';

const configSchema = Joi.object().keys({
  boxes: Joi.object().required(),
}).required();

const boxSchema = Joi.object({
  severity: Joi.string().allow('error', 'warning').only().optional(),
  files: Joi.array().items(Joi.string().required()).optional(),
  folders: Joi.array().items(Joi.string().required()).optional(),
  rules: Joi.object().keys({
    boxes: Joi.object().keys({
      only: Joi.array().items(Joi.string().optional()).unique().optional(),
    }).optional(),
    modules: Joi.object().keys({
      ban: Joi.array().items(Joi.string().optional()).unique().optional(),
    }).optional(),
  }).optional(),
});

export function validateConfig(config: any) {
  const { error: configError } = configSchema.validate(config);
  if (configError) {
    console.log(chalk.red(configError.message), '\n');
    throw new Error('Invalid .quadra.yml file');
  }

  let errorCount = 0;

  _.forEach(config.boxes, (box, name) => {
    const { error: boxError } = boxSchema.validate(box);
    if (boxError) {
      console.log(
        chalk.bold.red(name),
        chalk.gray(boxError.message),
      );
      errorCount++;
    }
  });

  if (errorCount > 0) {
    console.log();
    throw new Error('Invalid .quadra.yml file');
  }
}
