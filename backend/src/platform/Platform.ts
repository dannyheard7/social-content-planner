import { registerEnumType } from 'type-graphql';

enum Platform {
  Facebook = 'facebook',
}
export default Platform;

registerEnumType(Platform, {
  name: 'Platform',
});
