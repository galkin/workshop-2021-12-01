import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsTimezone(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isTimezone',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: never) {
          try {
            Intl.DateTimeFormat(undefined, { timeZone: value });
            return true;
          } catch (ex) {
            return false;
          }
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return `${validationArguments?.value} is wrong value for ${validationArguments?.property}`;
        }
      }
    });
  };
}
