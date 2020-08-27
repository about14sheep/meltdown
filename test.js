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
        this.physics.add.collider(this.player, walls)
        this.physics.add.collider(this.player, usableTops)
        this.physics.add.collider(this.player, computers)
        this.physics.add.collider(this.player, desks)
        this.physics.add.overlap(this.player, usableBottoms)
        this.physics.add.collider(this.player, pipes)
        this.cursors = this.input.keyboard.createCursorKeys()
        camera.startFollow(this.player)
    }

    function update() {
        this.player.setVelocityY(0)
        this.player.setVelocityX(0)
        let isPlayerUsing = false
        if (this.player.anims.currentAnim && this.player.anims.currentAnim.key == 'using') {
            isPlayerUsing = true
        }
        if (this.cursors.right.isDown) {
            this.player.play('walking', true)
            this.player.setVelocityX(200)
        }
        if (this.cursors.left.isDown) {
            this.player.play('walking', true)
            this.player.setVelocityX(-200)
        }
        if (this.cursors.up.isDown) {
            this.player.play('walking', true)
            this.player.setVelocityY(-200)
        }
        if (this.cursors.down.isDown) {
            this.player.play('walking', true)
            this.player.setVelocityY(200)
        }

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            this.player.setFlipX(true)
        } else if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
            isPlayerUsing ? console.log('**running minigame**') : this.player.play('idle', true)
        }
    }
})

function useTile(player) {
    player.play('using', true)
}