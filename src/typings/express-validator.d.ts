import 'express-validator';

declare module 'express-validator' {
    export interface Validator {
        isObjectId: () => boolean;
    }
}