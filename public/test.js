const PLAYER_CONNECTION = 'PLAYER_CONNECTION'
const PLAYER_DISCONNECT = 'PLAYER_DISCONNECT'
const PLAYER_POSITION = 'PLAYER_POSITION'
const PLAYER_USING = 'PLAYER_USING'
const PLAYER_IDLE = 'PLAYER_IDLE'

document.addEventListener('DOMContentLoaded', e => {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    }
    const game = new Phaser.Game(config)
    const ws = new WebSocket(`ws://localhost:3000`)
    const playerID = Math.floor(Math.random() * 11)
    const players = new Map()

    function preload() {
        this.load.spritesheet('tiles', 'assets/factory_tileset.png', {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet('scientist', 'assets/scientist_spritesheet.png', {
            frameWidth: 48,
            frameHeight: 48
        })
        this.load.tilemapTiledJSON('map', 'assets/meltdown_start_room.json')
        this.load.image('otherDude', 'assets/favicon.png')
    }

    function create() {
        const camera = this.cameras.main
        const map = this.make.tilemap({ key: "map" });
        this.anims.create({
            key: 'walking',
            frames: this.anims.generateFrameNumbers('scientist', {
                prefix: 'scientist_', start: 3, end: 2
            }),
            frameRate: 4,
            repeat: 0
        })

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'scientist', frame: 0 }],
            frameRate: 1,
        })

        this.anims.create({
            key: 'using',
            frames: [{ key: 'scientist', frame: 1 }],
            frameRate: 1,
        })

        const tileset = map.addTilesetImage("factory_tileset", "tiles")
        const floor = map.createStaticLayer('floor', tileset, 0, 0)
        floor.setScale(3)
        const walls = map.createStaticLayer('walls', tileset, 0, 0)
        walls.setScale(3)
        walls.setCollisionBetween(1, 10000)
        const desks = map.createStaticLayer('desks', tileset, 0, 0)
        desks.setScale(3)
        desks.setCollisionBetween(1, 10000)
        const computers = map.createStaticLayer('pressure_comps', tileset, 0, 0)
        computers.setScale(3)
        computers.setCollisionBetween(1, 10000)
        const usableBottoms = map.createStaticLayer('usable_bottom', tileset, 0, 0)
        usableBottoms.setScale(3)
        const usableTops = map.createStaticLayer('usable_top', tileset, 0, 0)
        usableTops.setScale(3)
        usableTops.setCollisionBetween(1, 10000)
        const pipes = map.createStaticLayer('pipes', tileset, 0, 0)
        pipes.setScale(3)
        pipes.setCollisionBetween(0, 10000)
        const accents = map.createStaticLayer('accents', tileset, 0, 0)
        accents.setScale(3)
        this.player = this.physics.add.sprite(config.width / 2, config.height / 2, 'scientist')
        usableBottoms.setTileIndexCallback(['1325', '1277'], useTile, this.player)
        this.otherPlayers = this.physics.add.group()
        this.physics.add.collider(this.player, walls)
        this.physics.add.collider(this.player, usableTops)
        this.physics.add.collider(this.player, computers)
        this.physics.add.collider(this.player, desks)
        this.physics.add.overlap(this.player, usableBottoms)
        this.physics.add.collider(this.player, pipes)
        this.cursors = this.input.keyboard.createCursorKeys()
        this.keys = this.input.keyboard.addKeys('W,S,A,D')
        camera.startFollow(this.player)

        ws.onopen = e => {
            const msg = {
                type: PLAYER_CONNECTION,
                data: {
                    player: playerID,
                    position: {
                        x: config.width / 2,
                        y: config.height / 2
                    }
                }
            }
            ws.send(JSON.stringify(msg))
        }

        ws.onmessage = e => {
            const msg = JSON.parse(e.data)

            if (msg.type === PLAYER_CONNECTION) {
                const data = msg.data
                if (!players.get(parseInt(data.player, 10))) {
                    addOtherPlayers(this, data)
                }
                console.log(`Player ${data.player} has entered the lobby`)
            }

            if (msg.type === PLAYER_DISCONNECT) {
                const data = msg.data
                players.delete(parseInt(data.player, 10))
                this.otherPlayers.getChildren().forEach(el => {
                    if (el.playerID === parseInt(data.player, 10)) {
                        el.disableBody(true, true)
                    }
                })
                console.log(`Player ${data.player} has left the lobby`)
            }

            if (msg.type === PLAYER_POSITION) {
                const data = msg.data
                if (!players.get(parseInt(data.player, 10))) {
                    addOtherPlayers(this, data)
                }
                this.otherPlayers.getChildren().forEach(otherPlayer => {
                    if (otherPlayer.playerID === parseInt(data.player, 10)) {
                        otherPlayer.x = data.position.x
                        otherPlayer.y = data.position.y
                        otherPlayer.play('walking', true)
                        otherPlayer.setFlipX(data.direction)
                    }
                })
            }

            if (msg.type === PLAYER_USING) {
                const data = msg.data
                this.otherPlayers.getChildren().forEach(player => {
                    if (player.playerID === parseInt(data.player, 10)) {
                        player.play('using', true)
                    }
                })
            }

            if (msg.type === PLAYER_IDLE) {
                const data = msg.data
                this.otherPlayers.getChildren().forEach(player => {
                    if (player.playerID === parseInt(data.player, 10)) {
                        player.play('idle', true)
                    }
                })
            }
            if (msg.type === 'players') {
                console.log(msg)
            }
        }

        ws.onclose = e => {
            const msg = {
                type: PLAYER_DISCONNECT,
                data: {
                    player: playerID
                }
            }
            ws.send(JSON.stringify(msg))

        }

    }

    function update() {
        this.player.setVelocityY(0)
        this.player.setVelocityX(0)

        let isPlayerUsing = false
        if (this.player.anims.currentAnim && this.player.anims.currentAnim.key == 'using') {
            isPlayerUsing = true
            sendUsing()
        }
        if (this.cursors.right.isDown || this.keys.D.isDown) {
            this.player.setVelocityX(200)
        }
        if (this.cursors.left.isDown || this.keys.A.isDown) {
            this.player.setVelocityX(-200)
        }
        if (this.cursors.up.isDown || this.keys.W.isDown) {
            this.player.setVelocityY(-200)
        }
        if (this.cursors.down.isDown || this.keys.S.isDown) {
            this.player.setVelocityY(200)
        }

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            this.player.setFlipX(true)
        } else if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
            if (isPlayerUsing) {
                console.log('**running minigame**')
            } else {
                sendIdle()
                this.player.play('idle', true)
            }
        }
        if (this.player.body.velocity.x != 0 || this.player.body.velocity.y != 0) {
            sendPosition(this.player)
            this.player.play('walking', true)
        }

        WebSocket.current = {
            ws,
        }

        return function cleanup() {
            if (WebSocket.current !== null) {
                WebSocket.current.ws.close()
            }
        }
    }

    const isOpen = ws => ws.readyState === ws.OPEN

    const sendIdle = _ => {
        const msg = {
            type: PLAYER_IDLE,
            data: {
                player: playerID,
            }
        }
        return isOpen(ws) ? ws.send(JSON.stringify(msg)) : null
    }

    const sendPosition = position => {
        const msg = {
            type: PLAYER_POSITION,
            data: {
                player: playerID,
                position: {
                    x: position.x,
                    y: position.y
                },
                direction: position.flipX
            }
        }
        return isOpen(ws) ? ws.send(JSON.stringify(msg)) : null
    }

    const sendUsing = _ => {
        const msg = {
            type: PLAYER_USING,
            data: {
                player: playerID
            }
        }
        return isOpen(ws) ? ws.send(JSON.stringify(msg)) : null
    }

    function addOtherPlayers(self, data) {
        players.set(parseInt(data.player, 10), data.position)
        if (parseInt(data.player, 10) != playerID) {
            const otherPlayer = self.physics.add.sprite(data.position.x, data.position.y, 'scientist')
            otherPlayer.playerID = parseInt(data.player, 10)
            self.otherPlayers.add(otherPlayer)
        }
    }
})

function useTile(player) {
    player.play('using', true)
}

