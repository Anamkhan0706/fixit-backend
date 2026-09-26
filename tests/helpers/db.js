const mongoose = require("mongoose");

function resolveTestUri() {
  if (process.env.MONGO_URI_TEST) return process.env.MONGO_URI_TEST;

  const base = process.env.MONGO_URI || "";
  if (!base) {
    throw new Error(
      "MONGO_URI is not set. Add MONGO_URI (and ideally MONGO_URI_TEST) to your .env file before running tests."
    );
  }

  const match = base.match(/\/([^/?]+)(\?.*)?$/);
  if (match) {
    const dbName = match[1];
    return base.replace(`/${dbName}`, `/${dbName}_test`);
  }
  return base + "_test";
}

async function connectTestDB() {
  const uri = resolveTestUri();
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
}

async function clearTestDB() {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

async function closeTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}

module.exports = { connectTestDB, clearTestDB, closeTestDB };