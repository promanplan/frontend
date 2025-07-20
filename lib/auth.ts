// Disabled authentication system

// Mock session that returns no user
export const authOptions = {
  // This is a placeholder to maintain compatibility with existing code
}

// Return null for authentication session
export const getAuthSession = () => {
  return Promise.resolve(null)
}

// Return null for current user
export const getCurrentUser = () => {
  return Promise.resolve(null)
}
