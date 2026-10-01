import { MongoClient, GridFSBucket, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "royalflow";

// Reuse one client across hot reloads (dev) and warm serverless invocations (prod).
const g = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoIndexes?: Promise<void>;
};

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");
  }
  if (!g._mongoClientPromise) {
    g._mongoClientPromise = new MongoClient(uri, { maxPoolSize: 10 }).connect();
  }
  return g._mongoClientPromise;
}

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection("posts").createIndex({ slug: 1 }, { unique: true }),
    db.collection("posts").createIndex({ status: 1, publishedAt: -1 }),
    db.collection("subscribers").createIndex({ email: 1 }, { unique: true }),
    db.collection("admin_users").createIndex({ email: 1 }, { unique: true }),
    db.collection("contact_messages").createIndex({ createdAt: -1 }),
    db.collection("team_members").createIndex({ order: 1 }),
  ]);
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  const db = client.db(dbName);
  if (!g._mongoIndexes) g._mongoIndexes = ensureIndexes(db).catch((e) => {
    g._mongoIndexes = undefined;
    console.error("[mongodb] index creation failed", e);
  });
  await g._mongoIndexes;
  return db;
}

export async function getImageBucket(): Promise<GridFSBucket> {
  return new GridFSBucket(await getDb(), { bucketName: "images" });
}
