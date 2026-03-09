$secure = Read-Host "Введите пароль Postgres" -AsSecureString
$env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
)

Copy-Item .env.example .env

psql -U postgres -c "CREATE DATABASE web_assistant_db;"

if (-not (psql -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='cloud_admin'")) {
    psql -U postgres -c "CREATE ROLE cloud_admin;"
}

if (-not (psql -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='neon_superuser'")) {
    psql -U postgres -c "CREATE ROLE neon_superuser;"
}

pg_restore -U postgres -d web_assistant_db --no-owner --role=postgres db/neon_dump.dump
Set-Location backend; npm install
Set-Location ../frontend; npm install
