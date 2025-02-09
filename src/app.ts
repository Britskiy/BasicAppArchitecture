import express from 'express';
import bodyParser from 'body-parser';
import { DataBase } from './helpers/db';
import config from './config';
import router from './controllers';

const app = express();
DataBase.connect(config);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(router);

app.listen(config.app_port, () => {
    console.log('Listening on port ' + config.app_port);
});

export default app;
