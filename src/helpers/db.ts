import mongoose from 'mongoose';
import config from '../config';

export class DataBase {
    public static connection: Promise<typeof mongoose> | null = null;

    public static async connect(config: any): Promise<void> {
        if (mongoose.connection.readyState !== 0) {
            return;
        }

        mongoose.set('debug', config.debug);

        try {
            this.connection = mongoose.connect(config.mongoDB, {
                autoCreate: true
            });

            await this.connection;
        } catch (error) {
            console.error('MongoDB Connection Error:', error);
            process.exit(1);
        }
    }

    public static debug(debug: boolean) {
        mongoose.set('debug', debug);
    }
}

DataBase.connect(config);