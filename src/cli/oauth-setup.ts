#!/usr/bin/env node
/**
 * OAuth Setup - Run the OAuth flow to get tokens
 */

import { config } from 'dotenv';
import * as http from 'node:http';
import { getAuthUrl, exchangeCodeForTokens, loadOAuthConfig } from '../lib/oauth-auth.js';

config();

const PORT = 3000;

async function runOAuthFlow() {
  const authUrl = getAuthUrl();

  console.log('\n=== Google OAuth Setup ===\n');
  console.log('1. Open this URL in your browser:\n');
  console.log(`   ${authUrl}\n`);
  console.log('2. Authorize the application');
  console.log('3. You will be redirected back\n');

  // Start a simple server to handle the callback
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url!, `http://localhost:${PORT}`);

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');

      if (!code) {
        const error = url.searchParams.get('error');
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`Authorization failed: ${error || 'Unknown error'}`);
        return;
      }

      try {
        const tokens = await exchangeCodeForTokens(code);

        const response = `
<!DOCTYPE html>
<html>
<head>
  <title>Authorization Successful</title>
  <style>
    body { font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px; }
    h1 { color: #0f9d58; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 8px; overflow-x: auto; }
    code { font-size: 12px; }
    .copy-btn { margin-top: 10px; padding: 10px 20px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .copy-btn:hover { background: #3367d6; }
  </style>
</head>
<body>
  <h1>✓ Authorization Successful</h1>
  <p>Add these secrets to Doppler:</p>
  <pre><code>GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}
GOOGLE_OAUTH_ACCESS_TOKEN=${tokens.access_token || ''}${tokens.expiry_date ? `
GOOGLE_OAUTH_TOKEN_EXPIRY=${tokens.expiry_date}` : ''}</code></pre>
  <p>Run these commands:</p>
  <pre><code>doppler secrets set GOOGLE_OAUTH_REFRESH_TOKEN "${tokens.refresh_token}" -c prd
doppler secrets set GOOGLE_OAUTH_ACCESS_TOKEN "${tokens.access_token || ''}" -c prd${tokens.expiry_date ? `
doppler secrets set GOOGLE_OAUTH_TOKEN_EXPIRY "${tokens.expiry_date}" -c prd` : ''}</code></pre>
  <button class="copy-btn" onclick="window.close()">Close</button>
</body>
</html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(response);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`Error exchanging code: ${(error as Error).message}`);
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Waiting for authorization callback...\n');
  });
}

try {
  await runOAuthFlow();
} catch (error) {
  console.error('Error:', (error as Error).message);
  process.exit(1);
}
