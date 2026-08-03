import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rouhi_jewelry';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache: MongooseCache;
};

// Force reset the cache so it picks up the new dbName without restarting the dev server
globalWithMongoose.mongooseCache = { conn: null, promise: null };

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (globalWithMongoose.mongooseCache.conn) {
    return globalWithMongoose.mongooseCache.conn;
  }

  if (!globalWithMongoose.mongooseCache.promise) {
    const opts = {
      dbName: process.env.MONGODB_DB || 'rouhi-jewlery',
      bufferCommands: false,
      serverSelectionTimeoutMS: 1500, // Fast 1.5s timeout to prevent page lag when DB is offline/local
      connectTimeoutMS: 1500,
    };

    globalWithMongoose.mongooseCache.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    });
  }

  try {
    globalWithMongoose.mongooseCache.conn = await globalWithMongoose.mongooseCache.promise;
  } catch (e) {
    globalWithMongoose.mongooseCache.promise = null;
    throw e;
  }

  return globalWithMongoose.mongooseCache.conn;
}
