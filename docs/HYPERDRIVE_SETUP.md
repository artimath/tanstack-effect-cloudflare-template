# Hyperdrive Setup for Neon Database

This project is configured to use Cloudflare Hyperdrive for optimized database connections with Neon in production. The implementation automatically detects and uses Hyperdrive when available, falling back to direct Neon connections in development.

## What is Hyperdrive?

Hyperdrive is Cloudflare's connection pooling service that:
- Maintains persistent database connections
- Reduces connection latency from edge locations
- Manages connection pools efficiently
- Provides automatic retries and failover

## Quick Setup

Run the automated setup script:

```bash
pnpm setup:hyperdrive
```

This script will guide you through creating and configuring Hyperdrive for your Neon database.

## Manual Setup Instructions

### 1. Prepare Your Neon Database

First, create a dedicated user for Hyperdrive in your Neon database:

1. Go to the [Neon dashboard](https://console.neon.tech)
2. Select your project and go to **Roles**
3. Click **New Role** and create a user named `hyperdrive-user`
4. Copy and save the generated password (you won't see it again)
5. Go to **Dashboard** > **Connection Details**
6. Select your branch, database, and the `hyperdrive-user` role
7. Select `psql` and **uncheck** the connection pooling checkbox
8. Copy the connection string (starting with `postgres://hyperdrive-user@...`)

### 2. Create a Hyperdrive Configuration

Create a Hyperdrive configuration using the connection string from step 1:

```bash
pnpm exec wrangler hyperdrive create my-neon-db \
  --connection-string="postgresql://hyperdrive-user:PASSWORD@host.neon.tech:5432/database?sslmode=require"
```

Replace `PASSWORD` with the password you copied in step 1.

### 3. Get the Hyperdrive Configuration ID

After creation, you'll receive a configuration ID. Note this ID for the next step.

```bash
pnpm exec wrangler hyperdrive list
```

### 4. Update wrangler.jsonc

Replace `your-hyperdrive-config-id` in `wrangler.jsonc` with your actual Hyperdrive configuration ID:

```json
{
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "YOUR_ACTUAL_HYPERDRIVE_ID_HERE"
    }
  ]
}
```

### 5. Update Types

After updating the configuration, regenerate the types:

```bash
pnpm cf-typegen
```

## How It Works

The database connection in `src/lib/db/index.ts` uses the Neon serverless driver, which works seamlessly with Hyperdrive:

- **In Production**: When deployed to Cloudflare Workers with Hyperdrive configured, the connection is automatically optimized through Hyperdrive's pooling layer
- **In Development**: Direct connection to Neon database using the standard connection string

## Local Development

### Option 1: Direct Database Connection (Default)

By default, local development connects directly to your Neon database without Hyperdrive. Ensure your `.env` file has the correct `DATABASE_URL`:

```env
DATABASE_URL=postgresql://username:password@host.neon.tech:5432/database
```

### Option 2: Test with Hyperdrive Locally

To test Hyperdrive in local development, you can use `wrangler dev` with the `--local` flag set to `false`:

```bash
# This runs your Worker on Cloudflare's network, allowing Hyperdrive access
pnpm exec wrangler dev --local=false
```

**Note:** When using `--local=false`:
- Your code runs on Cloudflare's edge network (not your local machine)
- You have access to Hyperdrive and other Cloudflare bindings
- Changes are slightly slower to reflect due to network round-trips
- You'll need to be logged into your Cloudflare account

### Option 3: Mock Hyperdrive Locally

For faster local development while still testing Hyperdrive code paths, you can mock the Hyperdrive binding:

1. Create a `.dev.vars` file for local environment variables:

```env
# .dev.vars
DATABASE_URL=postgresql://username:password@host.neon.tech:5432/database
```

2. Update your `wrangler.jsonc` to include local development configuration:

```json
{
  // ... existing config ...
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "your-hyperdrive-config-id",
      "localConnectionString": "postgresql://username:password@host.neon.tech:5432/database"
    }
  ]
}
```

3. Run with local Hyperdrive simulation:

```bash
pnpm exec wrangler dev --local --persist
```

The `localConnectionString` allows you to override the Hyperdrive connection string in local development, using your direct database connection instead.

## Benefits

- **Reduced Latency**: Connection pooling eliminates the overhead of establishing new connections
- **Better Performance**: Persistent connections improve query response times
- **Automatic Failover**: Built-in resilience and retry mechanisms
- **Edge Optimization**: Connections are managed closer to your users
- **Cost Efficiency**: Fewer database connections means lower costs

## Monitoring

You can monitor your Hyperdrive performance in the Cloudflare dashboard:

1. Go to your Cloudflare dashboard
2. Navigate to Workers & Pages
3. Select Hyperdrive
4. View metrics and connection details

## Troubleshooting

### Connection Issues

If you experience connection issues:

1. Verify your Hyperdrive configuration:
   ```bash
   pnpm exec wrangler hyperdrive get YOUR_HYPERDRIVE_ID
   ```

2. Check that your Neon database allows connections from Cloudflare IPs

3. Ensure SSL mode is set correctly in your connection string (`sslmode=require`)

### Type Errors

If you see TypeScript errors related to Hyperdrive:

1. Regenerate types after configuration changes:
   ```bash
   pnpm cf-typegen
   ```

2. Ensure your `worker-configuration.d.ts` includes the Hyperdrive binding

### Local Development Issues

If Hyperdrive isn't working locally:

1. Use `--local=false` to test on Cloudflare's network
2. Check that you're logged into Cloudflare: `pnpm exec wrangler whoami`
3. Verify your `.dev.vars` file has the correct DATABASE_URL

## References

- [Cloudflare Hyperdrive Documentation](https://developers.cloudflare.com/hyperdrive/)
- [Neon + Cloudflare Integration Guide](https://developers.cloudflare.com/workers/databases/third-party-integrations/neon/)
- [Cloudflare Workers Database Connections](https://developers.cloudflare.com/workers/databases/)
- [Hyperdrive Local Development](https://developers.cloudflare.com/hyperdrive/configuration/local-development/)