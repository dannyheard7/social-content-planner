import Platform, { PlatformType } from "../Enums/Platform";

export default interface PlatformConnection {
    entityId: string;
    entityName: string;
    platform: Platform | PlatformType;
}