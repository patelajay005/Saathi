// Test script to verify MongoDB connection and data storage
const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saathi', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully!\n');

    // Get database stats
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Database Statistics:');
    console.log('━'.repeat(50));
    console.log(`Database Name: ${db.databaseName}`);
    console.log(`Total Collections: ${collections.length}\n`);

    // Count documents in each collection
    console.log('📁 Collections and Document Counts:');
    console.log('━'.repeat(50));
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      const icon = getIcon(collection.name);
      console.log(`${icon} ${collection.name.padEnd(20)} : ${count} documents`);
    }

    console.log('\n' + '━'.repeat(50));

    // Sample data from users collection
    const userCount = await db.collection('users').countDocuments();
    if (userCount > 0) {
      console.log('\n👤 Sample User Data (latest):');
      console.log('━'.repeat(50));
      const user = await db.collection('users').findOne({}, { 
        projection: { password: 0 },
        sort: { createdAt: -1 }
      });
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('\n⚠️  No users found. Register a user to see data here.');
    }

    // Sample data from moods collection
    const moodCount = await db.collection('moods').countDocuments();
    if (moodCount > 0) {
      console.log('\n💭 Sample Mood Data (latest):');
      console.log('━'.repeat(50));
      const mood = await db.collection('moods').findOne({}, { 
        sort: { date: -1 }
      });
      console.log(JSON.stringify(mood, null, 2));
    } else {
      console.log('\n⚠️  No moods logged yet. Log a mood to see data here.');
    }

    // Check indexes
    console.log('\n🔍 Database Health:');
    console.log('━'.repeat(50));
    console.log('✅ Connection: Active');
    console.log(`✅ Collections: ${collections.length} found`);
    console.log(`✅ Total Documents: ${await getTotalDocuments(db, collections)}`);
    
    console.log('\n' + '='.repeat(50));
    console.log('✨ Database is working correctly!');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Database Connection Error:');
    console.error('━'.repeat(50));
    console.error(error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MongoDB is running: net start MongoDB');
    console.error('   2. Check your .env file has correct MONGODB_URI');
    console.error('   3. Verify MongoDB is installed\n');
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

const getTotalDocuments = async (db, collections) => {
  let total = 0;
  for (const collection of collections) {
    total += await db.collection(collection.name).countDocuments();
  }
  return total;
};

const getIcon = (collectionName) => {
  const icons = {
    'users': '👤',
    'moods': '💭',
    'habits': '✅',
    'dailyscores': '📊',
    'chatmessages': '💬',
    'chatsessions': '🗨️',
    'exercises': '🧘',
    'userexerciselogs': '📝',
    'quizzes': '📋',
    'quizresults': '✍️',
    'books': '📚',
    'userbooks': '📖'
  };
  return icons[collectionName] || '📄';
};

// Run the test
console.log('\n' + '='.repeat(50));
console.log('🤝 Saathi - Testing MongoDB Connection and Data Storage');
console.log('='.repeat(50) + '\n');

testConnection();

