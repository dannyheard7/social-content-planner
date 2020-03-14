import Platform, { PlatformType } from "../Enums/Platform";

export default interface PlatformConnection {
    id: string;
    entityId: string;
    entityName: string;
    platform: Platform | PlatformType;
}