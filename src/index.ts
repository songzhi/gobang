enum PieceColor {
  BLACK = 1,
  WHITE = 2,
}

var pieceBox: number[][] = []
var IS_END = false
var PLAYING_COLOR = PieceColor.BLACK
var board: HTMLCanvasElement
var context: CanvasRenderingContext2D

function initPieceBox() {
  for (let i = 0; i < 15; i++) {
    pieceBox[i] = []
    for (let j = 0; j < 15; j++) {
      pieceBox[i][j] = 0
    }
  }
}

function drawOnePiece(i: number, j: number, color: PieceColor) {
  context.beginPath()
  context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI) //绘制棋子
  var g = context.createRadialGradient(
    15 + i * 30,
    15 + j * 30,
    13,
    15 + i * 30,
    15 + j * 30,
    0
  ) // 设置渐变
  if (color == PieceColor.BLACK) {
    g.addColorStop(0, '#0A0A0A') // 黑棋
    g.addColorStop(1, '#636766')
  } else {
    g.addColorStop(0, '#D1D1D1') // 白棋
    g.addColorStop(1, '#F9F9F9')
  }
  context.fillStyle = g
  context.fill()
  context.closePath()
  pieceBox[i][j] = color
  PLAYING_COLOR =
    PLAYING_COLOR == PieceColor.BLACK ? PieceColor.WHITE : PieceColor.BLACK
}

function drawChessBoard() {
  for (var i = 0; i < 15; i++) {
    context.strokeStyle = '#bdbdbd'
    context.moveTo(15 + i * 30, 15) // 垂直方向画15根线，相距30px;
    context.lineTo(15 + i * 30, 435)
    context.stroke()
    context.moveTo(15, 15 + i * 30) // 水平方向画15根线，相距30px;棋盘为14*14；
    context.lineTo(435, 15 + i * 30)
    context.stroke()
  }
}

function onBoardClick(e) {
  if (IS_END) return
  var x = e.offsetX // 相对于棋盘左上角的x坐标
  var y = e.offsetY // 相对于棋盘左上角的y坐标
  var i = Math.floor(x / 30)
  var j = Math.floor(y / 30)
  if (pieceBox[i][j] == 0) {
    drawOnePiece(i, j, PLAYING_COLOR)
    if (isEndOfGame(i, j)) {
      if (PLAYING_COLOR == PieceColor.BLACK) alert('白棋赢了')
      else alert('黑棋赢了')
      IS_END = true
    }
  }
}

function isEndOfGame(xIndex: number, yIndex: number) {
  var tempXIndex = xIndex
  var tempYIndex = yIndex
  var dir = [
    [
      [-1, 0],
      [1, 0],
    ],
    [
      [0, -1],
      [0, 1],
    ],
    [
      [-1, -1],
      [1, 1],
    ],
    [
      [1, 1],
      [-1, 1],
    ],
  ]
  var count: number
  for (let i = 0; i < 4; i++) {
    count = 1
    // j为0,1分别为棋子的两边方向，比如对于横向的时候，j=0,表示下棋位子的左边，j=1的时候表示右边
    for (let j = 0; j < 2; j++) {
      let flag = true
      // while语句中为一直向某一个方向遍历; 有相同颜色的棋子的时候，count++
      // 否则置flag为false，结束该该方向的遍历
      while (flag) {
        tempXIndex += dir[i][j][0]
        tempYIndex += dir[i][j][1]
        if (
          !(
            tempXIndex >= 0 &&
            tempXIndex < 15 &&
            tempYIndex >= 0 &&
            tempYIndex < 15
          )
        )
          break
        if (pieceBox[tempXIndex][tempYIndex] == pieceBox[xIndex][yIndex]) {
          count++
        } else flag = false
      }
      tempXIndex = xIndex
      tempYIndex = yIndex
    }
    if (count >= 5) {
      return true
    }
  }
  return false
}

function clearBoard() {
  context.beginPath()
  context.clearRect(0, 0, board.width, board.height)
  drawChessBoard()
  initPieceBox()
  IS_END = false
}

window.onload = () => {
  board = <HTMLCanvasElement>document.getElementById('board')
  context = board.getContext('2d')
  board.onclick = onBoardClick
  document.getElementById('clear-board').onclick = clearBoard
  initPieceBox()
  drawChessBoard()
}
