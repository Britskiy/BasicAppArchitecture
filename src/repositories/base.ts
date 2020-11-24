import * as mongoose from 'mongoose';
import { IRead, IWrite } from '../interfaces/base';

export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

    private _model: mongoose.Model<T>;

    constructor(schemaModel: mongoose.Model<T>) {
        this._model = schemaModel;
    }

    create(item: mongoose.CreateQuery<T>, callback?: (err: any, res: T[]) => void)  {
        this._model.create(item, callback);
    }

    retrieve(callback: (error: any, result: T) => void) {
        this._model.find({}, callback);
    }

    update(_id: mongoose.Types.ObjectId, item: mongoose.UpdateQuery<T>, callback: (error: any, result: any) => void) {
        this._model.update({ _id: _id } as mongoose.FilterQuery<T>, item, callback);
    }

    delete(_id: string, callback: (error: any, result: any) => void) {
        this._model.deleteOne({ _id: this.toObjectId(_id) } as mongoose.FilterQuery<T>, (err) => callback(err, null));
    }

    findById(_id: string, callback: (error: any, result: mongoose.Model<T>) => void) {
        this._model.findById(_id, callback);
    }

    findOne(cond?: Object, callback?: (err: any, res: mongoose.Model<T>) => void): mongoose.DocumentQuery<T | null, T> {
        return this._model.findOne(cond as mongoose.FilterQuery<T>, callback);
    }

    find(cond?: any, options?: any, callback?: (err: any, res: T[]) => void): mongoose.DocumentQuery<T[],  T> {
        return this._model.find(cond as mongoose.FilterQuery<T>, options, callback);
    }

    private toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id);
    }

}