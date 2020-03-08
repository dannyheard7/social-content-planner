import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import * as path from 'path';
import { Post } from '../post/Post.entity';
import { PlatformConnection } from './PlatformConnection.entity';
import PlatformService from './PlatformService';

@Injectable()
export class FacebookService implements PlatformService {
  constructor(private readonly configService: ConfigService) {}

  async publishPost(
    post: Post,
    platformConnection: PlatformConnection,
  ): Promise<string> {
    const fakeImagePath =
      'https://as.ftcdn.net/r/v1/pics/7b11b8176a3611dbfb25406156a6ef50cd3a5009/home/discover_collections/optimized/image-2019-10-11-11-36-27-681.jpg';

    const host = this.configService.get<string | undefined>('HOST');
    let attachedMedia = [];

    if ((await post.images).length > 0) {
      const imageUploadRequests = (await post.images).map(image => {
        // Use fake images when running locally as fb cannot access local images
        const imageUrl = host ? path.join(host, image.image_id) : fakeImagePath;
        return fetch(
          `https://graph.facebook.com/${platformConnection.entityId}/photos?url=${imageUrl}&published=false&access_token=${platformConnection.accessToken}`,
        )
          .then(response => response.json())
          .catch(e => {
            throw new Error(e.message);
          });
      });
      const data = await Promise.all(imageUploadRequests);
      attachedMedia = data.map(d => ({
        media_fbid: d.data[0].id,
      }));
    }

    const body = {
      access_token: platformConnection.accessToken,
      message: post.text,
      published: true,
      attached_media: attachedMedia,
    };

    const postData = await fetch(
      `https://graph.facebook.com/v6.0/${platformConnection.entityId}/feed`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    return postData.id;
  }

  async getFacebookPageAccessToken(
    userId: string,
    userAccessToken: string,
    pageId: string,
  ): Promise<string> {
    const clientId = this.configService.get<string | undefined>(
      'FACEBOOK_APP_ID',
    );
    const clientSecret = this.configService.get<string | undefined>(
      'FACEBOOK_APP_SECRET',
    );

    if (!clientId || !clientSecret)
      throw new Error('Facebook app details not setup');

    const data = await fetch(
      `https://graph.facebook.com/v6.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${userAccessToken}`,
    )
      .then(response => response.json())
      .catch(e => {
        throw new Error(e.message);
      });

    const pages = await fetch(
      `https://graph.facebook.com/v6.0/${userId}/accounts?access_token=${data.access_token}`,
    )
      .then(response => response.json())
      .catch(e => {
        throw new Error(e.message);
      });
    return pages.data.find(p => p.id === pageId).access_token;
  }
}
