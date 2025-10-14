import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://nqbetmhexfyvmrhorpgt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xYmV0bWhleGZ5dm1yaG9ycGd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM3NzUxMSwiZXhwIjoyMDc1OTUzNTExfQ.WdFk0z26GPZpZCR3FgiRwhrPSLgx4lghG-emufUJWZA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

console.log('\n' + '='.repeat(60));
console.log('  SUPABASE MCP SERVER CONNECTION TEST');
console.log('='.repeat(60));
console.log('\n📍 Project:', SUPABASE_URL);
console.log('🔑 Auth: Service Role Key\n');

async function runTests() {
  const results = {
    connection: false,
    tableCreation: false,
    dataInsertion: false,
    dataQuery: false,
    cleanup: false
  };

  try {
    // Test 1: Verify connection by attempting to create table via SQL
    console.log('🧪 TEST 1: Verifying Connection & Creating Test Table');
    console.log('─'.repeat(60));

    // Use Supabase client to execute raw SQL
    const { error: sqlError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS mcp_connection_test (
          id BIGSERIAL PRIMARY KEY,
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (sqlError && sqlError.code === '42883') {
      console.log('⚠️  RPC function "exec_sql" not available');
      console.log('ℹ️  This is expected - Supabase requires table creation via:');
      console.log('   • Supabase Dashboard SQL Editor');
      console.log('   • Supabase Migration files');
      console.log('   • Database management tools\n');

      console.log('📝 Please manually create the table with this SQL:');
      console.log('─'.repeat(60));
      console.log(`
CREATE TABLE IF NOT EXISTS mcp_connection_test (
  id BIGSERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
      `);
      console.log('─'.repeat(60));
      console.log('\n✅ Connection verified (error code indicates server is reachable)\n');
      results.connection = true;
    } else if (sqlError) {
      console.log('❌ Unexpected error:', sqlError.message, '\n');
    } else {
      console.log('✅ Table created successfully!\n');
      results.connection = true;
      results.tableCreation = true;
    }

    // Test 2: Try to insert data
    console.log('🧪 TEST 2: Inserting Test Data');
    console.log('─'.repeat(60));

    const testMessage = 'MCP connection successful! ' + new Date().toISOString();
    const { data: insertData, error: insertError } = await supabase
      .from('mcp_connection_test')
      .insert([{ message: testMessage }])
      .select();

    if (insertError) {
      if (insertError.code === 'PGRST205') {
        console.log('⚠️  Table does not exist yet');
        console.log('📌 Action Required: Create the table manually (see SQL above)');
        console.log('   Then run this test again with: node test-supabase-final.js\n');
      } else if (insertError.code === '42501') {
        console.log('⚠️  Permission denied');
        console.log('📌 Check Row Level Security (RLS) policies');
        console.log('   Service role should bypass RLS by default\n');
      } else {
        console.log('❌ Insert error:', insertError.message);
        console.log('   Code:', insertError.code);
        console.log('   Details:', insertError, '\n');
      }
    } else {
      console.log('✅ Data inserted successfully!');
      console.log('📊 Inserted record:', insertData[0]);
      console.log('');
      results.dataInsertion = true;
    }

    // Test 3: Query data
    if (results.dataInsertion) {
      console.log('🧪 TEST 3: Querying Test Data');
      console.log('─'.repeat(60));

      const { data: queryData, error: queryError } = await supabase
        .from('mcp_connection_test')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) {
        console.log('❌ Query error:', queryError.message, '\n');
      } else {
        console.log('✅ Query successful!');
        console.log('📊 Total records:', queryData.length);
        if (queryData.length > 0) {
          console.log('📝 Latest records:');
          queryData.slice(0, 3).forEach((record, i) => {
            console.log(`   ${i + 1}. ID: ${record.id}, Message: "${record.message}"`);
          });
        }
        console.log('');
        results.dataQuery = true;
      }

      // Test 4: Cleanup
      console.log('🧪 TEST 4: Cleaning Up Test Data');
      console.log('─'.repeat(60));

      const { data: deleteData, error: deleteError } = await supabase
        .from('mcp_connection_test')
        .delete()
        .eq('message', testMessage)
        .select();

      if (deleteError) {
        console.log('⚠️  Delete error:', deleteError.message, '\n');
      } else {
        console.log('✅ Test record deleted successfully!');
        console.log('📊 Deleted:', deleteData.length, 'record(s)\n');
        results.cleanup = true;
      }
    }

    // Final Summary
    console.log('\n' + '='.repeat(60));
    console.log('  TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log('');
    console.log('Connection Test:    ', results.connection ? '✅ PASS' : '❌ FAIL');
    console.log('Table Creation:     ', results.tableCreation ? '✅ PASS' : '⚠️  MANUAL REQUIRED');
    console.log('Data Insertion:     ', results.dataInsertion ? '✅ PASS' : '⚠️  PENDING TABLE');
    console.log('Data Query:         ', results.dataQuery ? '✅ PASS' : '⚠️  PENDING TABLE');
    console.log('Cleanup:            ', results.cleanup ? '✅ PASS' : '⚠️  PENDING TABLE');
    console.log('');
    console.log('='.repeat(60));
    console.log('  MCP SERVER STATUS');
    console.log('='.repeat(60));
    console.log('');
    console.log('Connection Status:  ', results.connection ? '✅ WORKING' : '❌ NOT WORKING');
    console.log('MCP Tools Available:', 'Need to check Claude Code session');
    console.log('');
    console.log('🔍 TO CHECK MCP TOOLS:');
    console.log('   • MCP tools appear with prefix "mcp__" in Claude Code');
    console.log('   • Check .mcp.json configuration is valid');
    console.log('   • Restart Claude Code if MCP server was just configured');
    console.log('   • Check MCP server logs for initialization errors');
    console.log('');
    console.log('📚 NEXT STEPS:');
    if (!results.tableCreation) {
      console.log('   1. Create test table in Supabase Dashboard SQL Editor');
      console.log('   2. Run this test again: node test-supabase-final.js');
      console.log('   3. Verify all CRUD operations work');
    } else {
      console.log('   1. ✅ Basic operations confirmed working');
      console.log('   2. Ready for MCP server usage');
      console.log('   3. Create your application tables as needed');
    }
    console.log('');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ CRITICAL ERROR');
    console.error('─'.repeat(60));
    console.error('Message:', error.message);
    console.error('Code:', error.code || 'N/A');
    console.error('Stack:', error.stack);
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Verify SUPABASE_URL is correct');
    console.log('2. Verify SERVICE_ROLE_KEY is valid and not expired');
    console.log('3. Check Supabase project status at supabase.com');
    console.log('4. Verify network connectivity');
    console.log('5. Check firewall/proxy settings\n');
    process.exit(1);
  }
}

runTests();
