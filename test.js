const PLAYER_POSITION = 'PLAYER_POSITION'
const PLAYER_CONNECTION = 'PLAYER_CONNECTION'

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
            repeat: -1
        })

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'scientist', frame: 0 }],
            frameRate: 10,
        })

        this.anims.create({
            key: 'using',
            frames: [{ key: 'scientist', frame: 1 }],
            frameRate: 10,
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

        ws.onmessage = e => {
            const msg = JSON.parse(e.data)
            if (msg.type === PLAYER_POSITION) {
                data = msg.data

                if (!players.get(parseInt(data.player, 10))) {
                    addOtherPlayers(this, data)
                }
                this.otherPlayers.getChildren().forEach(otherPlayer => {
                    if (otherPlayer.playerID === data.player) {
                        otherPlayer.x = data.position.x
                        otherPlayer.y = data.position.y
                    }
                })

            }
            if (msg.type === 'players') {
                console.log(msg)
            }
        }
        WebSocket.current = {
            ws,
        }
        function cleanup() {
            if (WebSocket.current !== null) {
                WebSocket.current.ws.close()
            }
        }
    }

    function update() {
        this.player.setVelocityY(0)
        this.player.setVelocityX(0)
        if (this.player.oldPosition && (this.player.x != this.player.oldPosition.x || this.player.y != this.player.oldPosition.y)) {
            sendPosition(this.player)
        }
        this.player.oldPosition = {
            x: this.player.x,
            y: this.player.y
        }

        let isPlayerUsing = false
        if (this.player.anims.currentAnim && this.player.anims.currentAnim.key == 'using') {
            isPlayerUsing = true
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
            isPlayerUsing ? console.log('**running minigame**') : this.player.play('idle', true)
        }
        if (this.player.body.velocity.x != 0 || this.player.body.velocity.y != 0) {
            this.player.play('walking', true)
        }
    }

    const sendPosition = (position) => {
        const msg = {
            type: PLAYER_POSITION,
            data: {
                player: playerID,
                position: {
                    x: position.x,
                    y: position.y
                }
            }
        }
        return isOpen(ws) ? ws.send(JSON.stringify(msg)) : null
    }
    const isOpen = ws => ws.readyState === ws.OPEN

    function addOtherPlayers(self, data) {
        players.set(parseInt(data.player, 10), data.position)
        if (parseInt(data.player, 10) != playerID) {
            const otherPlayer = self.add.sprite(data.position.x, data.position.y, 'otherDude')
            otherPlayer.playerID = parseInt(data.player, 10)
            self.otherPlayers.add(otherPlayer)
        }
    }
})

function useTile(player) {
    player.play('using', true)
}

