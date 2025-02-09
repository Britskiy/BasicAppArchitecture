import { Model, FilterQuery, UpdateQuery, Document, Types } from 'mongoose';
import { IRead, IWrite } from '../interfaces/base';

export class RepositoryBase<T extends Document> implements IRead<T>, IWrite<T> {
    protected _model: Model<T>;

    constructor(model: Model<T>) {
        this._model = model;
    }

    async create(item: Partial<T>): Promise<T> {
        return this._model.create(item);
    }

    async update(id: Types.ObjectId, item: UpdateQuery<T>): Promise<T | null> {
        return this._model.findByIdAndUpdate(id, item, { new: true }).exec();
    }

    async delete(id: Types.ObjectId): Promise<boolean> {
        const result = await this._model.deleteOne({ _id: id }).exec();
        return result.deletedCount === 1;
    }

    async findById(id: Types.ObjectId): Promise<T | null> {
        return this._model.findById(id).exec();
    }

    async findOne(cond: FilterQuery<T> = {}): Promise<T | null> {
        return this._model.findOne(cond).exec();
    }

    async find(cond: FilterQuery<T> = {}): Promise<T[]> {
        return this._model.find(cond).exec();
    }
}