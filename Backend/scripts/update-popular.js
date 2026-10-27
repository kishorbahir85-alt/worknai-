import mongoose from 'mongoose';

async function update() {
  await mongoose.connect('mongodb://127.0.0.1:27017/worknai_v2');
  const col = mongoose.connection.collection('products');
  
  // 1. Ensure Online Go title is 'Online Go'
  const r1 = await col.updateOne(
    { url: 'https://onlinego.in/' },
    { $set: { title: 'Online Go' } }
  );
  console.log('Online Go title updated:', r1.modifiedCount);

  // Check the 4 items
  const popular = await col.find({
    $or: [
      { title: /pg\s*info/i },
      { title: /online\s*go/i },
      { title: /aitourism/i },
      { title: /logistics/i }
    ]
  }).toArray();

  console.log('Found popular items:');
  popular.forEach(p => console.log(`- ${p.title} (${p.url})`));

  await mongoose.disconnect();
}

update().catch(console.error);
