import { Document, FilterQuery, UpdateQuery, Types } from 'mongoose';

export interface IRead<T extends Document> {
    findById(id: Types.ObjectId): Promise<T | null>;
    findOne(cond?: FilterQuery<T>): Promise<T | null>;
    find(cond?: FilterQuery<T>): Promise<T[]>;
}

export interface IWrite<T extends Document> {
    create(item: T): Promise<T>;
    update(id: Types.ObjectId, item: UpdateQuery<T>): Promise<T | null>;
    delete(id: Types.ObjectId): Promise<boolean>;
}