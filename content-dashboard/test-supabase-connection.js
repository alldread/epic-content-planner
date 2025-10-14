import { createClient } from '@supabase/supabase-js';

// Supabase configuration from .mcp.json
const SUPABASE_URL = 'https://nqbetmhexfyvmrhorpgt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xYmV0bWhleGZ5dm1yaG9ycGd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM3NzUxMSwiZXhwIjoyMDc1OTUzNTExfQ.WdFk0z26GPZpZCR3FgiRwhrPSLgx4lghG-emufUJWZA';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

console.log('🔍 Testing Supabase MCP Connection...\n');

async function testSupabaseConnection() {
  try {
    // Step 1: List existing tables
    console.log('📋 Step 1: Listing existing tables...');
    const { data: tables, error: listError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (listError) {
      console.log('   ⚠️  Cannot query information_schema directly. Trying alternative method...');
      // Alternative: Try to query a non-existent table to verify connection
      const { error: connectionError } = await supabase
        .from('_connection_test')
        .select('*')
        .limit(1);

      if (connectionError && connectionError.code === 'PGRST116') {
        console.log('   ✅ Connection successful! (Table not found error expected)');
      } else if (connectionError) {
        throw connectionError;
      }
    } else {
      console.log(`   ✅ Found ${tables?.length || 0} existing tables:`, tables?.map(t => t.table_name).join(', '));
    }

    // Step 2: Create test table
    console.log('\n🔨 Step 2: Creating test table "mcp_connection_test"...');
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS mcp_connection_test (
        id BIGSERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createTableQuery
    });

    if (createError) {
      // Try using REST API to create table (alternative approach)
      console.log('   ⚠️  RPC method not available. Using direct SQL execution...');
      const { error: altCreateError } = await supabase
        .from('mcp_connection_test')
        .select('*')
        .limit(0);

      if (altCreateError && altCreateError.code === 'PGRST116') {
        console.log('   ℹ️  Table does not exist. Creating via schema editor needed.');
        console.log('   💡 Using workaround: Will insert data (table may auto-create with RLS)');
      }
    } else {
      console.log('   ✅ Test table created successfully');
    }

    // Step 3: Insert test record
    console.log('\n📝 Step 3: Inserting test record...');
    const { data: insertData, error: insertError } = await supabase
      .from('mcp_connection_test')
      .insert({ message: 'MCP connection successful!' })
      .select();

    if (insertError) {
      console.log('   ❌ Insert failed:', insertError.message);
      console.log('   Details:', insertError);
      throw insertError;
    }
    console.log('   ✅ Test record inserted:', insertData);

    // Step 4: Query the test table
    console.log('\n🔎 Step 4: Querying test table...');
    const { data: queryData, error: queryError } = await supabase
      .from('mcp_connection_test')
      .select('*');

    if (queryError) {
      console.log('   ❌ Query failed:', queryError.message);
      throw queryError;
    }
    console.log('   ✅ Query successful! Records found:', queryData);

    // Step 5: Clean up - delete test table
    console.log('\n🧹 Step 5: Cleaning up test table...');
    const dropTableQuery = `DROP TABLE IF EXISTS mcp_connection_test;`;

    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: dropTableQuery
    });

    if (dropError) {
      console.log('   ⚠️  Cannot drop table via RPC. Manual cleanup needed.');
      console.log('   💡 You can delete the table manually from Supabase dashboard');
    } else {
      console.log('   ✅ Test table deleted successfully');
    }

    console.log('\n✅ OVERALL: Supabase connection test completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Connection: ✅ Working');
    console.log('   - Table Creation: ⚠️  May require direct SQL access');
    console.log('   - Data Insertion: ✅ Working');
    console.log('   - Data Querying: ✅ Working');
    console.log('   - Table Deletion: ⚠️  May require direct SQL access');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('Details:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Verify SUPABASE_URL and SERVICE_ROLE_KEY are correct');
    console.log('   2. Check if RLS (Row Level Security) policies allow operations');
    console.log('   3. Ensure service role key has admin privileges');
    console.log('   4. MCP server may need additional SQL execution permissions');
  }
}

// Run the test
testSupabaseConnection();
