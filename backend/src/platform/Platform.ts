import { registerEnumType } from '@nestjs/graphql';

enum Platform {
  FACEBOOK = "FACEBOOK",
  TWITTER = "TWITTER"
}
export default Platform;

registerEnumType(Platform, {
  name: 'Platform',
});
