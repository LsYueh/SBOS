
/**------+---------+---------+---------+---------+---------+---------+----------
 * Dummy Users
---------+---------+---------+---------+---------+---------+---------+--------*/

let users = [
  {
    id: 1,
    username: 'admin',
    name: '管理員',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  }
]

let nextId = 2

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {object} input 
 * @param {Number} input.page 
 * @param {Number} input.size 
 * @param {String} input.sortField 
 * @param {String} input.sortDir asc/dsc
 * @returns 
 */
export function getUsers(input) {
  const { page, size, sortField, sortDir } = input;

  let TLB = users;

  // 排序
  TLB = TLB.sort((a, b) => {
    const valA = a[sortField]
    const valB = b[sortField]
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  // 分頁
  const start = (page - 1) * size
  const end = start + size
  const paginated = TLB.slice(start, end)
  const lastPage = Math.ceil(TLB.length / size)

  return {
    data: paginated,
    last_page: lastPage
  }
}

/**
 * 
 * @param {String} id 
 * @returns 
 */
export function getUserById(id) {
  return users.find(u => u.id === Number(id)) || null
}

/**
 * 
 * @param {Object} data 
 * @returns 
 */
export function createUser(data) {
  const newUser = {
    id: nextId++,
    username: data.username,
    name: data.name,
    email: data.email,
    role: data.role || 'user',
    status: data.status || 'active',
    avatar: data.avatar || '',
    note: data.note || '',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  }
  users.push(newUser)
  return newUser
}

/**
 * 
 * @param {Number} id 
 * @param {Object} data 
 * @returns 
 */
export function updateUser(id, data) {
  const idx = users.findIndex(u => u.id === Number(id))
  if (idx === -1) return null

  users[idx] = {
    ...users[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return users[idx]
}

/**
 * 
 * @param {Number} id 
 * @returns 
 */
export function deleteUser(id) {
  const idx = users.findIndex(u => u.id === Number(id))
  if (idx === -1) return false

  users.splice(idx, 1)
  return true
}
