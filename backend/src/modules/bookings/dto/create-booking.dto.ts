import {
  IsString, IsEmail, IsNotEmpty, IsOptional, IsBoolean,
  IsIn, IsArray, IsInt, IsNumber, Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const toNumberOrUndefined = ({ value }: { value: unknown }) => {
  if (value === '' || value === null || value === undefined) return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
};

export class CreateBookingDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsEmail() @IsNotEmpty() email: string;

  @IsIn(['house', 'condo', 'apartment', 'office'])
  propertyType: string;

  @IsOptional() @IsInt() @Min(0) @Transform(toNumberOrUndefined)
  bedrooms?: number;

  @IsOptional() @IsNumber() @Min(0) @Transform(toNumberOrUndefined)
  bathrooms?: number;

  @IsOptional() @IsString()
  squareFootage?: string;

  @IsIn(['regular', 'deep', 'move-in-out'])
  cleaningType: string;

  @IsOptional() @IsString()
  preferredDate?: string;

  @IsOptional() @IsString()
  calgaryArea?: string;

  @IsOptional() @IsArray() @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  extraServices?: string[];

  @IsOptional() @IsBoolean() @Transform(({ value }) => value === 'true' || value === true)
  hasPets?: boolean;

  @IsOptional() @IsString()
  message?: string;

  @IsOptional() @IsArray() @IsString({ each: true })
  photos?: string[];
}
