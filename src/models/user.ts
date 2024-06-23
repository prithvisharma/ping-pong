interface User {
  id?: string
  name: string
  userId: string
  password?: string
  defenseSetLength: number
  role: string
}

function initUser(userData: {
  name: string
  userId: string
  password: string
  defenseSetLength: number
  role: string
}): User {
  const { name, defenseSetLength, role, userId, password } = userData
  return {
    id: crypto.randomUUID(),
    name: name,
    userId: userId,
    password: password,
    defenseSetLength: defenseSetLength,
    role: role,
  }
}

export { User, initUser }
