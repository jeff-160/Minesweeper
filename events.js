function ClickEvent(e){
    if (Game.Ended)
        return

    const cell = e.target

    if (!Game.Mines.length)
        return Game.PopulateGrid(cell.x, cell.y)

    switch (e.which) {
        case 1:
            if (!cell.revealed)
                Game.Reveal(cell)

            break
        case 2:
            if (!cell.revealed || Game.CountFlags(cell.x, cell.y) != cell.mines)
                return

            for (const step of Game.Steps) {
                Game.Reveal(Game.Grid?.[cell.y + step[1]]?.[cell.x + step[0]])
            }

            break;
        case 3:
            if (!cell.revealed) {
                cell.flagged = !cell.flagged
                cell.flagged ? cell.classList.add('flag') : cell.classList.remove('flag')
            }

            break
    }
}