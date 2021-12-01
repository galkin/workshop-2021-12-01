import { BadRequestException, ValidationError } from '@nestjs/common';

export function exceptionFactory(errors: ValidationError[]): BadRequestException {
  const desc = 'Wrong payload format';
  const body = Object.assign({ __error__: desc }, errorsToDescription(errors));
  return new BadRequestException(body, desc);
}

function errorsToDescription(errors: ValidationError[]): Record<string, string[] | string> {
  const result: Record<string, string[] | string> = {};
  for (const error of errors) {
    if (error.constraints) result[error.property] = Object.values(error.constraints);
    if (error.children) {
      const childrenDesc = errorsToDescription(error.children);
      for (const [property, desc] of Object.entries(childrenDesc)) {
        result[`${error.property}.${property}`] = desc;
      }
    }
  }
  return result;
}
