// Usage: npm run create-admin -- "Full Name" email@example.com "a-strong-password"
import { MongoClient } from "mongodb";
import { randomBytes, scryptSync } from "crypto";

const [name, email, password] = process.argv.slice(2);
if (!name || !email || !password) {
  console.error('Usage: npm run create-admin -- "Full Name" email@example.com "password (10+ chars)"');
  process.exit(1);
}
if (password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI missing — create .env.local first (see .env.example).");
  process.exit(1);
}

const salt = randomBytes(16);
const key = scryptSync(password, salt, 64);
const passwordHash = `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;

const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const users = client.db(process.env.MONGODB_DB || "royalflow").collection("admin_users");
  await users.createIndex({ email: 1 }, { unique: true });
  const r = await users.updateOne(
    { email: email.toLowerCase() },
    { $set: { name, email: email.toLowerCase(), passwordHash, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  console.log(r.upsertedCount ? `✔ Admin created: ${email}` : `✔ Admin updated (password reset): ${email}`);
} finally {
  await client.close();
}
