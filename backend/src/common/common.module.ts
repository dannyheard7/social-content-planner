import { Module } from '@nestjs/common';
import { DateScalar } from './DateScalar';

@Module({
  imports: [],
  providers: [DateScalar],
})
export class CommonModule { }
