#!/usr/bin/env tsx

/**
 * Setup script for Cloudflare Hyperdrive configuration
 * This script helps automate the Hyperdrive setup process
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function setupHyperdrive() {
  console.log('🚀 Cloudflare Hyperdrive Setup for Neon Database\n');

  try {
    // Step 1: Check if user has wrangler installed
    try {
      execSync('pnpm exec wrangler --version', { stdio: 'pipe' });
    } catch {
      console.error('❌ Wrangler is not installed. Please run: pnpm add -D wrangler');
      process.exit(1);
    }

    // Step 2: Check if user is logged into Cloudflare
    try {
      execSync('pnpm exec wrangler whoami', { stdio: 'pipe' });
    } catch {
      console.log('📝 Please log in to Cloudflare:');
      execSync('pnpm exec wrangler login', { stdio: 'inherit' });
    }

    // Step 3: Get database connection details
    console.log('\n📋 Please provide your Neon database connection details:');
    console.log('(You can find these in your Neon dashboard)\n');

    const host = await question('Database host (e.g., ep-example.us-east-1.neon.tech): ');
    const database = await question('Database name (default: neondb): ') || 'neondb';
    const username = await question('Database username (e.g., hyperdrive-user): ');
    const password = await question('Database password: ');
    const port = await question('Database port (default: 5432): ') || '5432';

    const connectionString = `postgresql://${username}:${password}@${host}:${port}/${database}?sslmode=require`;

    // Step 4: Create Hyperdrive configuration
    console.log('\n🔧 Creating Hyperdrive configuration...');

    const configName = `neon-${database}-${Date.now()}`;

    try {
      const output = execSync(
        `pnpm exec wrangler hyperdrive create ${configName} --connection-string="${connectionString}"`,
        { encoding: 'utf-8' }
      );

      console.log('✅ Hyperdrive configuration created successfully!');

      // Extract the configuration ID from the output
      const idMatch = output.match(/id:\s+([a-f0-9-]+)/i);
      const hyperdriveId = idMatch ? idMatch[1] : null;

      if (!hyperdriveId) {
        console.error('⚠️  Could not extract Hyperdrive ID. Please check the output above and update wrangler.jsonc manually.');
        console.log(output);
        return;
      }

      // Step 5: Update wrangler.jsonc
      console.log('\n📝 Updating wrangler.jsonc...');

      const wranglerPath = join(process.cwd(), 'wrangler.jsonc');
      const wranglerContent = readFileSync(wranglerPath, 'utf-8');

      // Parse and update the configuration
      const wranglerConfig = JSON.parse(wranglerContent.replace(/\/\/.*$/gm, '')); // Remove comments

      if (!wranglerConfig.hyperdrive) {
        wranglerConfig.hyperdrive = [];
      }

      // Update or add the Hyperdrive configuration
      const existingIndex = wranglerConfig.hyperdrive.findIndex((h: any) => h.binding === 'HYPERDRIVE');
      if (existingIndex >= 0) {
        wranglerConfig.hyperdrive[existingIndex].id = hyperdriveId;
        console.log('✅ Updated existing Hyperdrive binding');
      } else {
        wranglerConfig.hyperdrive.push({
          binding: 'HYPERDRIVE',
          id: hyperdriveId,
          localConnectionString: connectionString,
        });
        console.log('✅ Added new Hyperdrive binding');
      }

      // Write back the configuration
      writeFileSync(wranglerPath, JSON.stringify(wranglerConfig, null, 2));

      // Step 6: Regenerate types
      console.log('\n🔄 Regenerating TypeScript types...');
      execSync('pnpm cf-typegen', { stdio: 'inherit' });

      // Step 7: Create or update .dev.vars
      console.log('\n📝 Setting up local development variables...');

      const devVarsPath = join(process.cwd(), '.dev.vars');
      const devVarsContent = `# Local development variables
DATABASE_URL=${connectionString}
`;

      writeFileSync(devVarsPath, devVarsContent);
      console.log('✅ Created .dev.vars file for local development');

      // Success!
      console.log('\n✨ Hyperdrive setup complete!\n');
      console.log('Next steps:');
      console.log('1. Test locally: pnpm exec wrangler dev --local=false');
      console.log('2. Deploy to production: pnpm deploy');
      console.log('\nHyperdrive Configuration:');
      console.log(`  ID: ${hyperdriveId}`);
      console.log(`  Name: ${configName}`);
      console.log(`  Binding: HYPERDRIVE`);

    } catch (error: any) {
      console.error('\n❌ Failed to create Hyperdrive configuration:');
      console.error(error.message);
      console.log('\nPlease check your connection string and try again.');
    }

  } catch (error: any) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run the setup
setupHyperdrive().catch(console.error);