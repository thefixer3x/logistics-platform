import { User } from '@supabase/supabase-js'

export const ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  CONTRACTOR: 'contractor',
  DRIVER: 'driver',
}

type MockUser = Partial<User> & { id: string; role: string }

export const createMockUser = (role: string, overrides: Partial<User> = {}): MockUser => {
  const userId = `${role}-user-id`
  return {
    id: userId,
    email: `${role}@example.com`,
    role: role,
    ...overrides,
  }
}

export const createMockSession = (role: string, overrides: Partial<User> = {}) => {
  const user = createMockUser(role, overrides)
  return {
    session: {
      user,
      access_token: `mock-token-for-${role}`,
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
    },
    user,
  }
}

export const mockAdmin = createMockSession(ROLES.ADMIN)
export const mockSupervisor = createMockSession(ROLES.SUPERVISOR)
export const mockContractor = createMockSession(ROLES.CONTRACTOR)
export const mockDriver = createMockSession(ROLES.DRIVER)