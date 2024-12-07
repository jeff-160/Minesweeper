window.onload = ()=> {
    Game.Init()
}

const Game = {
    Screen: null,
    Grid: [],
    GridWidth: 7,
    CellWidth: null,
    MineCount: 0,
    Mines: [],
    Revealed: 0,

    Ended: false,

    Colors: {
        1: "blue",
        2: "darkgreen",
        3: "red",
        4: "purple",
        5: "darkyellow",
        6: "lightblue",
        7: "darkgray",
        8: "lightgrey"
    },

    Steps: [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0], [1, 0],
        [-1, 1], [0, 1], [1, 1]
    ],

    Init() {
        this.Screen = document.querySelector("#screen")
        this.Screen.style.width = this.Screen.style.height = `${~~(document.documentElement.clientHeight * 0.9)}px`
        this.CellWidth = ~~(this.Screen.clientWidth / this.GridWidth)

        this.MineCount = ~~((this.GridWidth ** 2) / 6)

        this.CreateCells()
    },

    CreateCells() {
        for (let i = 0 ; i < this.GridWidth; i++) {
            this.Grid.push([])
            const row = this.Grid.slice(-1)[0]

            for (let j = 0 ; j < this.GridWidth ; j++) {
                const cell = document.createElement('div')
                
                ;[cell.style.left, cell.style.top] = [j, i].map(e => `${e * this.CellWidth}px`)
                cell.style.width = cell.style.height = `${this.CellWidth}px`
                cell.style.backgroundColor = (i + j) % 2 ? "green" : "lime"

                cell.id = "cell"
                cell.x = j
                cell.y = i
                cell.flagged = false
                cell.revealed = false

                cell.onmousedown = ClickEvent

                this.Screen.appendChild(cell)
                row.push(cell)
            }
        }
    },

    PopulateGrid(safeX, safeY) {
        const pos = {}

        for (let i = 0 ; i < this.GridWidth ; i++) {
            pos[i] = []

            for (let j = 0 ; j < this.GridWidth ; j++)  {
                if (i == safeY && j == safeX)
                    continue

                pos[i].push(j)
            }
        }

        for (let i = 0 ; i < this.MineCount ; i++) {
            const y = RandElem(Object.keys(pos))
            const index = RandInt(0, pos[y].length - 1)
            const x = pos[y][index]
            
            pos[y].splice(index, 1)

            if (!pos[y])
                delete pos[y]
    
            this.Mines.push(this.Grid[y][x])
        }

        for (let i = 0 ; i < this.GridWidth ; i++) {
            for (let j = 0 ; j < this.GridWidth ; j++) {
                if (this.Mines.includes(this.Grid[j][i]))
                    continue

                this.Grid[j][i].mines = this.CountMines(i, j)
            }
        }

        this.RevealStart(safeX, safeY)
    },

    RevealStart(startX, startY) {
        this.Reveal(this.Grid[startY][startX])

        for (const step of this.Steps) {
            const cell = this.Grid[startY + step[1]][startX + step[0]]

            if (!this.Mines.includes(cell))
                this.Reveal(cell)
        }
    },

    CountMines(x, y) {
        let count = 0

        for (const step of this.Steps) {
            const posX = x + step[0], posY = y + step[1]

            if (IsOut(posX, posY)) 
                continue

            if (this.Mines.includes(this.Grid[posY][posX]))
                count++
        }

        return count
    },

    CountFlags(x, y) {
        let count = 0

        for (const step of this.Steps) {
            const posX = x + step[0], posY = y + step[1]

            if (IsOut(posX, posY)) 
                continue

            if (this.Grid[posY][posX].flagged)
                count++
        }

        return count
    },

    Reveal(cell, recursive = true){
        if (!cell || cell.flagged)
            return

        if (this.Mines.includes(cell)) {
            if (recursive) {
                this.Ended = true
                this.Mines.forEach(mine => this.Reveal(mine, 0))
            }

            cell.classList.add("mine")
        }

        else {
            if (!cell.revealed)
                this.Revealed++

            cell.revealed = true

            if (cell.mines) {
                cell.style.fontSize = `${cell.clientHeight}px`
                cell.style.color = this.Colors[cell.mines]
                
                cell.innerHTML = cell.mines
            }
            else {
                this.RevealEmpty(cell)
            }
    
            cell.style.backgroundColor = (cell.x + cell.y) % 2 ? "#B87333" : "#C4A484"

            if (!this.Ended && (this.Revealed == (this.GridWidth ** 2 - this.MineCount))) {
                this.Ended = true
                return alert("YOU WIN!")
            }
        }
    },

    RevealEmpty(cell){
        for (const step of this.Steps) {
            const nextX = cell.x + step[0], nextY = cell.y + step[1]

            if (IsOut(nextX, nextY))
                continue
            
            const next = this.Grid[nextY][nextX]
            
            if (this.Mines.includes(next))
                continue

            if (!next.revealed)
                this.Reveal(next)
        }
    },
}