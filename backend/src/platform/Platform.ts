import { registerEnumType } from 'type-graphql';

enum Platform {
  FACEBOOK = "FACEBOOK",
  TWITTER = "TWITTER"
}
export default Platform;

registerEnumType(Platform, {
  name: 'Platform',
});
