BEGIN;

-- 1. Superadmin
INSERT INTO admins (username, email, mobileno, password, role)
SELECT 'NewSuperAdmin', 'new.superadmin@talentapp.test', '919111000001',
       '$2b$10$UukjtU2dbgbcOKYQVDPQYODD6KoRJNZn7d2ZP.v6JnkmyFadOq9X6', 1
WHERE NOT EXISTS (
  SELECT 1 FROM admins WHERE email = 'new.superadmin@talentapp.test'
);

-- 2. Admin
INSERT INTO admins (username, email, mobileno, password, role)
SELECT 'NewAdmin', 'new.admin@talentapp.test', '919111000002',
       '$2b$10$yGpwZpV7dU5mwcgb3xdAKuQsO3ILFGVzndS/2MGmL982zsRqKVtMO', 2
WHERE NOT EXISTS (
  SELECT 1 FROM admins WHERE email = 'new.admin@talentapp.test'
);

-- 3. Line Producer (parent admin = NewAdmin, so it/they show up under that admin's projects/auditions)
INSERT INTO assistants (username, email, mobileno, password, "userId", role)
SELECT 'NewLineProducer', 'new.lineproducer@talentapp.test', '919111000003',
       '$2b$10$e8szUeHmKeRKcH0mg.7GzOgFFlcffh83lndMHcAn1eEZam0uTW.Sm',
       (SELECT _id FROM admins WHERE email = 'new.admin@talentapp.test'), 3
WHERE NOT EXISTS (
  SELECT 1 FROM assistants WHERE email = 'new.lineproducer@talentapp.test'
);

-- 4. Director (parent admin = NewAdmin)
INSERT INTO assistants (username, email, mobileno, password, "userId", role)
SELECT 'NewDirector', 'new.director@talentapp.test', '919111000004',
       '$2b$10$SzQDKzpz46tX7eWfuPLRwuuDk.HYxuOR7hTHRim3Hl014uztwvVcy',
       (SELECT _id FROM admins WHERE email = 'new.admin@talentapp.test'), 4
WHERE NOT EXISTS (
  SELECT 1 FROM assistants WHERE email = 'new.director@talentapp.test'
);

COMMIT;

psql -h localhost -U postgres -d talentapp -f add_roles.sql

Role	Email	Password
Superadmin	new.superadmin@talentapp.test	NewSuper@2026
Admin	new.admin@talentapp.test	NewAdmin@2026
Line Producer	new.lineproducer@talentapp.test	NewLP@2026
Director	new.director@talentapp.test	NewDir@2026
