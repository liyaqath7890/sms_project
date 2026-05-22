-- Enterprise auth, RBAC, audit, and notification upgrade.
-- Safe to run after the existing schema.sql.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'users' AND column_name = 'role' AND constraint_name = 'users_role_check'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_role_check;
  END IF;
END $$;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('super_admin', 'admin', 'principal', 'teacher', 'student', 'parent', 'staff'));

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  hierarchy_level INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  module VARCHAR(80) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS login_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255),
  status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed')),
  failure_reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  priority VARCHAR(20) DEFAULT 'normal',
  target_roles TEXT[] DEFAULT ARRAY['all'],
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  action_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS notification_reads (
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (notification_id, user_id)
);

INSERT INTO roles (name, slug, hierarchy_level) VALUES
  ('Super Admin', 'super_admin', 100),
  ('Admin', 'admin', 80),
  ('Principal', 'principal', 70),
  ('Teacher', 'teacher', 50),
  ('Staff', 'staff', 40),
  ('Parent', 'parent', 20),
  ('Student', 'student', 10)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  hierarchy_level = EXCLUDED.hierarchy_level,
  updated_at = NOW();

INSERT INTO permissions (name, slug, module) VALUES
  ('View Dashboard', 'dashboard:view', 'dashboard'),
  ('Manage Users', 'users:manage', 'users'),
  ('Read Students', 'students:read', 'students'),
  ('Write Students', 'students:write', 'students'),
  ('Read Teachers', 'teachers:read', 'teachers'),
  ('Write Teachers', 'teachers:write', 'teachers'),
  ('Manage Classes', 'classes:manage', 'classes'),
  ('Read Attendance', 'attendance:read', 'attendance'),
  ('Write Attendance', 'attendance:write', 'attendance'),
  ('Read Grades', 'grades:read', 'grades'),
  ('Write Grades', 'grades:write', 'grades'),
  ('Read Reports', 'reports:read', 'reports'),
  ('Read Notifications', 'notifications:read', 'notifications'),
  ('Write Notifications', 'notifications:write', 'notifications'),
  ('Read Audit Logs', 'audit:read', 'audit'),
  ('Manage Settings', 'settings:manage', 'settings')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  module = EXCLUDED.module;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.slug = u.role
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_login_activities_user ON login_activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_target_user ON notifications(target_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
