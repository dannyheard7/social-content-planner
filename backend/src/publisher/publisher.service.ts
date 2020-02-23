import { Injectable } from '@nestjs/common';
import { Post } from '../post/Post.entity';
import fetch from 'node-fetch';

@Injectable()
export class PublisherService {
  constructor() {}

  async publishToFacebook(post: Post): Promise<boolean> {
    // curl -i -X POST \
    // -d "url=https://www.facebook.com/images/fb_icon_325x325.png" \
    // -d "caption=test photo upload" \
    // -d "published=false" \
    // -d "access_token=<access_token>" \
    // "https://graph.facebook.com/v2.11/me/photos"

    // curl -i -X "POST https://graph.facebook.com/546349135390552/photos
    // ?url={path-to-photo}
    // &access_token={page-access-token}"

    const pageId = '104703471133712';
    const imagePath =
      'https://as.ftcdn.net/r/v1/pics/7b11b8176a3611dbfb25406156a6ef50cd3a5009/home/discover_collections/optimized/image-2019-10-11-11-36-27-681.jpg';
    const accessToken = 'xxx';
    // const data = await Promise.all(
    //   (await post.images).map(image => {
    //     fetch(
    //       `https://graph.facebook.com/${pageId}/photos?url=${imagePath}&published=false&access_token=${accessToken}`,
    //     )
    //       .then(res => res.json())
    //       .catch(e => console.log(e.message));
    //   }),
    // );

    const data = await fetch(
      `https://graph.facebook.com/${pageId}/photos?url=${imagePath}&published=false&access_token=${accessToken}`,
      { method: 'POST' },
    )
      .then(res => res.json())
      .catch(e => console.log(e.message));

    console.log(data);

    const body = {
      access_token: accessToken,
      message: post.text,
      published: true,
      attached_media: [
        {
          media_fbid: data.id,
        },
      ],
    };

    console.log(JSON.stringify(body));

    const postData = await fetch(
      `https://graph.facebook.com/v6.0/${pageId}/feed`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    )
      .then(res => res.json())
      .catch(e => console.log(e.message));

    console.log(postData);

    // $params = array( "message" => $caption );
    //   foreach($photoIdArray as $k => $photoId) {
    //       $params["attached_media"][$k] = '{"media_fbid":"' . $photoId . '"}';
    //   }
    //   try {
    //       $postResponse = $this->fb->post("/{user-id}/feed", $params, $this->accessToken);
    //   } catch (FacebookResponseException $e) {
    //       // display error message
    //       print $e->getMessage();
    //       exit();
    //   } catch (FacebookSDKException $e) {
    //       print $e->getMessage();
    //       exit();
    //   }

    return true;
  }
}
