import { registerEnumType } from 'type-graphql';

enum Platform {
  FACEBOOK = "FACEBOOK",
}
export default Platform;

registerEnumType(Platform, {
  name: 'Platform',
});
