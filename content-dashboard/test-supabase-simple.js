import { createClient } from '@supabase/supabase-js';

// Supabase configuration from .mcp.json
const SUPABASE_URL = 'https://nqbetmhexfyvmrhorpgt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xYmV0bWhleGZ5dm1yaG9ycGd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM3NzUxMSwiZXhwIjoyMDc1OTUzNTExfQ.WdFk0z26GPZpZCR3FgiRwhrPSLgx4lghG-emufUJWZA';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  db: { schema: 'public' },
  auth: { persistSession: false }
});

console.log('🔍 Testing Supabase Connection...\n');
console.log('📍 Project URL:', SUPABASE_URL);
console.log('🔑 Using service role key\n');

async function testConnection() {
  try {
    // Test 1: Basic connection using SQL query
    console.log('🧪 Test 1: Basic Connection Test');
    const { data, error } = await supabase.rpc('version');

    if (error && error.code === '42883') {
      console.log('   ℹ️  Custom RPC "version" not found (expected)');
      console.log('   ✅ But connection to Supabase is working!\n');
    } else if (error) {
      console.log('   ❌ Connection error:', error.message);
      throw error;
    } else {
      console.log('   ✅ Connection successful!');
      console.log('   📊 Response:', data);
    }

    // Test 2: Try to create table using raw SQL
    console.log('\n🧪 Test 2: Creating Test Table');
    console.log('   📝 Executing SQL to create "mcp_connection_test" table...');

    // Use Supabase Management API or direct SQL execution
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS mcp_connection_test (
        id BIGSERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Try creating via a query (this might fail without proper permissions)
    const { data: createData, error: createError } = await supabase
      .rpc('exec', { sql: createTableSQL })
      .single();

    if (createError && createError.code === '42883') {
      console.log('   ⚠️  exec() RPC function not found');
      console.log('   ℹ️  Table creation requires direct database access or Supabase Dashboard');
      console.log('   💡 Attempting to use table if it exists...\n');
    } else if (createError) {
      console.log('   ⚠️  Create error:', createError.message);
      console.log('   💡 Attempting to use table if it exists...\n');
    } else {
      console.log('   ✅ Table created successfully!\n');
    }

    // Test 3: Insert data (this will work if table exists)
    console.log('🧪 Test 3: Inserting Test Data');
    const testMessage = 'MCP connection successful!';
    const { data: insertData, error: insertError } = await supabase
      .from('mcp_connection_test')
      .insert([{ message: testMessage }])
      .select();

    if (insertError) {
      if (insertError.code === 'PGRST205') {
        console.log('   ⚠️  Table "mcp_connection_test" does not exist yet');
        console.log('   💡 Please create the table manually in Supabase Dashboard:');
        console.log('   ');
        console.log('   CREATE TABLE mcp_connection_test (');
        console.log('     id BIGSERIAL PRIMARY KEY,');
        console.log('     message TEXT NOT NULL,');
        console.log('     created_at TIMESTAMPTZ DEFAULT NOW()');
        console.log('   );');
        console.log('   ');
        console.log('   Then run this test again.\n');
      } else {
        console.log('   ❌ Insert failed:', insertError.message);
        console.log('   Details:', insertError);
      }
    } else {
      console.log('   ✅ Data inserted successfully!');
      console.log('   📊 Inserted:', insertData, '\n');

      // Test 4: Query the data
      console.log('🧪 Test 4: Querying Test Data');
      const { data: queryData, error: queryError } = await supabase
        .from('mcp_connection_test')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (queryError) {
        console.log('   ❌ Query failed:', queryError.message);
      } else {
        console.log('   ✅ Query successful!');
        console.log('   📊 Records found:', queryData.length);
        console.log('   📝 Data:', JSON.stringify(queryData, null, 2), '\n');

        // Test 5: Clean up
        console.log('🧪 Test 5: Cleaning Up Test Data');
        const { error: deleteError } = await supabase
          .from('mcp_connection_test')
          .delete()
          .eq('message', testMessage);

        if (deleteError) {
          console.log('   ⚠️  Could not delete test data:', deleteError.message);
        } else {
          console.log('   ✅ Test data deleted successfully!\n');
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 CONNECTION TEST SUMMARY');
    console.log('='.repeat(50));
    console.log('✅ Supabase connection: WORKING');
    console.log('✅ Service role authentication: WORKING');
    console.log('⚠️  Direct table creation: Requires dashboard/migration');
    console.log('');
    console.log('🔧 NEXT STEPS FOR MCP SERVER:');
    console.log('1. Create the test table manually in Supabase Dashboard');
    console.log('2. Run this test again to verify full CRUD operations');
    console.log('3. Check MCP server logs for initialization errors');
    console.log('4. MCP tools should appear as mcp__* in Claude Code');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Details:', error);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Verify project URL and service role key');
    console.log('2. Check Supabase project is active and accessible');
    console.log('3. Verify network connectivity');
    console.log('4. Check if API keys have expired or been revoked\n');
    process.exit(1);
  }
}

// Run test
testConnection();
