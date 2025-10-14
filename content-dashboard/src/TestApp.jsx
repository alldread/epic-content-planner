import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

function TestApp() {
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Testing Supabase connection...');

        // Test a simple query
        const { data: testData, error: testError } = await supabase
          .from('posts')
          .select('*')
          .limit(1);

        if (testError) {
          setError(`Supabase error: ${testError.message}`);
          setStatus('Failed');
        } else {
          setStatus('Connected successfully!');
          setData(testData);
        }
      } catch (err) {
        setError(`Unexpected error: ${err.message}`);
        setStatus('Failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Epic Content Planner - Debug Mode</h1>
      <p>Status: {status}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && <p>Data: {JSON.stringify(data)}</p>}
      <hr />
      <p>Environment Variables:</p>
      <ul>
        <li>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✓ Loaded' : '✗ Missing'}</li>
        <li>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Loaded' : '✗ Missing'}</li>
        <li>VITE_APP_PASSWORD: {import.meta.env.VITE_APP_PASSWORD ? '✓ Loaded' : '✗ Missing'}</li>
      </ul>
    </div>
  );
}

export default TestApp;