import { Injectable } from '@nestjs/common';
import { Post } from '../post/Post.entity';
import { PlatformConnectionService } from './PlatformConnection.service';
import { FacebookService } from './Facebook.service';

@Injectable()
export class PublisherService {
  constructor(
    private readonly facebookService: FacebookService,
    private readonly platformConnectionService: PlatformConnectionService,
  ) { }

  async publishToFacebook(post: Post, user: User): Promise<string> {
    const platformConnection = await this.platformConnectionService.getByNetworkForUser(
      'facebook',
      user,
    );

    return await this.facebookService.publishPost(post, platformConnection);
  }
}
