import Platform from "../../Common/Enums/Platform";

export default interface AddPlatformConnectionInput {
    entityId: string;
    entityName: string;
    platform: Platform;
    platformUserId: string;
    accessToken: string;
}