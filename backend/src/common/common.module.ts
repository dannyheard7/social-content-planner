import { Module } from '@nestjs/common';
import { DateScalar } from './DateScalar';
import { FeedbackResolver } from './feedback.resolver';

@Module({
  imports: [],
  providers: [DateScalar, FeedbackResolver],
})
export class CommonModule { }
