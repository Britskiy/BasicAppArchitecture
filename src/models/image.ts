import * as mongoose from 'mongoose';
import { IUser } from "../interfaces/user";
var Schema = mongoose.Schema;

var Image = new Schema({
    id: { type: Number, default: 1000, min: 1000 },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: false, null: true, default: null },
});

//DEEEP populate
let autoPopulate = function(next) {
    /*
    this
        //Candidate
        .populate('candidate.section','name')
    next();
    */
};
/*
export interface UserDocument extends IUser, mongoose.Document {
   _id: string;
}
export var userSchema = User;
*/