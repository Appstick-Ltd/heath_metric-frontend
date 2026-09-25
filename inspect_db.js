const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.ejzyqswhgbknunqmvofq',
  password: 'ELOWpqY5FtwL14Pj',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  const cols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';");
  console.log('COLUMNS IN PROFILES:');
  console.log(cols.rows);

  const res = await client.query('SELECT * FROM public.profiles;');
  console.log('ALL PROFILES:');
  console.log(JSON.stringify(res.rows, null, 2));

  const authRes = await client.query('SELECT id, email, raw_user_meta_data FROM auth.users;');
  console.log('AUTH USERS:');
  console.log(JSON.stringify(authRes.rows, null, 2));

  await client.end();
}

main().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
