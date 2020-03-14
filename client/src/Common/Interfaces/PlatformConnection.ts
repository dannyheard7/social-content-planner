import Platform from "../Enums/Platform";

export default interface PlatformConnection {
    entityId: string;
    entityName: string;
    platform: Platform;
}