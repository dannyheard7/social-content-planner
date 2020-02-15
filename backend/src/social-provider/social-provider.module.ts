import { Module } from '@nestjs/common';
import { SocialProviderResolver } from './social-provider.resolver';

@Module({
  imports: [],
  providers: [SocialProviderResolver],
})
export class SocialProviderModule {}
