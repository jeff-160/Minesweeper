function ClickEvent(e){
    if (Game.Ended)
        return

    const cell = e.target

    switch (e.which) {
        case 1:
            if (!cell.revealed && !cell.flagged) {
                Game.Mines.length > 0 ? Game.Reveal(cell) : Game.PopulateGrid(cell.x, cell.y)
            }

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