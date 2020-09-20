export default async function login(username, password) {
  const res = await fetch('http://localhost:3000/api/session', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  if (res.ok) {
    const { token, user } = await res.json()
    window.localStorage.setItem('meltdown/auth/token', token)
    window.localStorage.setItem('meltdown/auth/user', JSON.stringify(user))
    return true
  } else {
    const data = await res.json()
    return JSON.stringify(data)
  }

}