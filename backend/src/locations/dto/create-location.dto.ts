// create-location.dto.ts
import { IsString, MaxLength } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @MaxLength(30)
  name: string;
}