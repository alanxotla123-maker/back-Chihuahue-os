const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5440,
  user: 'postgres',
  password: 'password',
  database: 'chihuahuenos',
});

async function main() {
  await client.connect();
  const res = await client.query('SELECT * FROM users');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
