const { Pool } = require('pg');
require('dotenv').config();

/**
 * Production Database Setup Script
 * Run this script to set up your production database
 */

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up production database...');

    // Read the schema file
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await pool.query(schema);
    console.log('✅ Database schema created successfully');

    // Test the connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection test successful:', result.rows[0]);

    console.log('🎉 Production database setup complete!');
    console.log('📝 Next steps:');
    console.log('   1. Deploy to Vercel using: vercel --prod');
    console.log('   2. Set environment variables in Vercel dashboard');
    console.log('   3. Test your API endpoints');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run the setup
setupDatabase();
