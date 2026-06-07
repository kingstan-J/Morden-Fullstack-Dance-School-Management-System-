require('dotenv').config();
const mongoose = require('mongoose');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Ensure a completely clean DB on demand.
  const collections = await mongoose.connection.db.listCollections().toArray();
  if (collections?.length) {
    await Promise.all(collections.map(c => mongoose.connection.db.collection(c.name).deleteMany({})));
  }

  console.log('\n✅ Clean database initialized (no users created)');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
