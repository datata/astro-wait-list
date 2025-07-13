import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI;
console.log(uri);

if (!uri) {
  throw new Error('MONGO_URI not defined');
}

const client = new MongoClient(uri);

let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
    if (db) {
        return db;
    }
    await client.connect();

    db = client.db('wait-list');
    await db.collection('emails').createIndex({ to: 1 }, { unique: true });

    return db;
}
