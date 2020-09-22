async function getLobbies() {
  const res = await fetch('http://localhost:3000/api/lobbies')
  if (res.ok) {
    const { lobbies } = await res.json()
    return lobbies
  } else {
    const error = await res.json()
    console.error('An error occured getting all lobbies: ', error)
  }
}

async function checkLobby(id) {
  const res = await fetch(`http://localhost:3000/api/lobby/${id}`)
  if (res.ok) {
    const { player_max, player_count } = await res.json()
    return player_count === player_max
  } else {
    const error = await res.json()
    console.error(`An error occured checking lobby ${id}: `, error)
    return true
  }
}

async function joinLobby(lobbyId, user) {
  const res = await fetch(`http://localhost:3000/api/lobby/${lobbyId}`, {
    methos: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  if (res.ok) {
    const data = await res.json()
    return data
  } else {
    const error = await res.json()
    console.error(`An error occured joining lobby ${lobbyId}: `, error)
    return false
  }
}

module.exports = {
  getLobbies,
  checkLobby,
  joinLobby,
}