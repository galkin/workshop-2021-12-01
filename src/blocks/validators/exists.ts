import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { getRepository } from 'typeorm';

interface Entity {
  new (): unknown;
}

interface ExistsData {
  entity: Entity;
}

@ValidatorConstraint({ async: true })
class ExistsConstraint implements ValidatorConstraintInterface {
  async validate(currentValue: unknown, args: ValidationArguments): Promise<boolean> {
    const data: ExistsData = args.constraints[0];
    const entity = await getRepository(data.entity).findOne({
      where: {
        id: currentValue
      }
    });

    return !!entity;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const data: ExistsData = validationArguments.constraints[0];
    return `${data.entity.name}#${validationArguments.value} is not found.`;
  }
}

export function Exists(data: ExistsData, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [data],
      validator: ExistsConstraint
    });
}

/**
 export class ExampleDTO {
  @IsString()
  @IsNotEmpty()
  @Exists({ entity: User, field: 'id' }, { message: ({ value }) => `User with id: "${value}" is not found` })
  user_id: User['id'];
}
 */