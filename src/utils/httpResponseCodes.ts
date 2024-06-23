// I created this enum for readability from a dev perspective

export enum HttpResponseCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 202,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    SERVICE_UNAVAILABLE = 503
};
