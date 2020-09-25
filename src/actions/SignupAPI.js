// Meltdown Atomic City
// Copyright (C) 2020 Austin Burger

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>

export default async function signup(username, password) {
  const res = await fetch('http://localhost:3000/api/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  if (res.ok) {
    const { token, user } = await res.json()
    window.localStorage.setItem('meltdown/auth/token', token)
    window.localStorage.setItem('meltdown/auth/user', JSON.stringify(user))
    return user
  } else {
    const data = await res.json()
    return JSON.stringify(data.msg)
  }
}