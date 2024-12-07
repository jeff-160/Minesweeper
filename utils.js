function RandInt(min, max) {
    return ~~(Math.random() * (max - min + 1) + min)
}

function RandElem(arr) {
    return arr[RandInt(0, arr.length - 1)]
}

function IsOut(x, y) {
    return (
        x < 0 ||
        x > Game.GridWidth - 1 ||
        y < 0 ||
        y > Game.GridWidth - 1
    )
}