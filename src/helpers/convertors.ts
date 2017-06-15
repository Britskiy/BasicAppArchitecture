const config = require('../config');
import { ISimpleResponse } from "../interfaces/convertors";

export let simpleResponse = (err: any = null, text: string = "OK"): ISimpleResponse => {
    let obj = JSON.parse(JSON.stringify(config.resposne));
    if (err) {
        obj.isError = true
        obj.text = err
    }
    if (text)
        obj.text = text

    return obj;
}