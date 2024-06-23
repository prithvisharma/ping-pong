interface User {
  id?: string
  name: string
  defenseSetLength: number
  role: string
}

function initUser(userData: {
  name: string
  defenseSetLength: number
  role: string
}): User {
  const { name, defenseSetLength, role } = userData
  return {
    id: crypto.randomUUID(),
    name: name,
    defenseSetLength: defenseSetLength,
    role: role,
  }
}

export { User, initUser }
