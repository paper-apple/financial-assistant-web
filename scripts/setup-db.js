// setup-db.js
require("dotenv").config();
const { execSync } = require("child_process");

const DB_NAME = process.env.DB_NAME || "financial_assistant_db";
const PGPASSWORD = process.env.PGPASSWORD;
const PGUSER = process.env.PGUSER || "postgres";

if (!PGPASSWORD) {
  console.error("Ошибка: PGPASSWORD не указан в .env");
  process.exit(1);
}

function run(cmd) {
  execSync(cmd, {
    stdio: "inherit",
    env: {
      ...process.env,
      PGPASSWORD,
    },
  });
}

console.log(`Создание базы данных: ${DB_NAME}`);
run(`psql -U ${PGUSER} -c "CREATE DATABASE ${DB_NAME};"`);

console.log("Создание роли cloud_admin");
run(
  `psql -U ${PGUSER} -tAc "SELECT 1 FROM pg_roles WHERE rolname='cloud_admin'" || psql -U ${PGUSER} -c "CREATE ROLE cloud_admin;"`
);

console.log("Создание роли neon_superuser");
run(
  `psql -U ${PGUSER} -tAc "SELECT 1 FROM pg_roles WHERE rolname='neon_superuser'" || psql -U ${PGUSER} -c "CREATE ROLE neon_superuser;"`
);

console.log("Восстановление дампа");
run(
  `pg_restore -U ${PGUSER} -d ${DB_NAME} --no-owner --role=${PGUSER} db/neon_dump.dump`
);

console.log("Завершено");
