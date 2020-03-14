import { Injectable } from '@nestjs/common';
import { Post } from '../post/Post.entity';
import { FacebookService } from './facebook.service';
import Platform from './Platform';

@Injectable()
export class PublisherService {
  constructor(
    private readonly facebookService: FacebookService,
  ) { }

  async publishPost(post: Post): Promise<boolean> {
    const postPlatforms = await post.platforms;
    const platformConnections = await Promise.all(postPlatforms.map(postPlatform => postPlatform.platformConnection));

    await Promise.all(platformConnections.map(platformConnection => {
      if (platformConnection.platform == Platform.FACEBOOK) {
        this.facebookService.publishPost(post, platformConnection);
      }
    }));

    return true;
  }
}
