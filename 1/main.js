/*
 *  Copyright © (c) 2014 Alexander Selzer <aselzer3@gmail.com>
 */

var canvas = document.getElementById("canvas")
var c = canvas.getContext("2d")

var WIDTH = 1000,
    HEIGHT = 600

canvas.width = WIDTH, canvas.height = HEIGHT

var cells = [
  {
    "id": 4245535,
    pos: [210, 327],
    signal: -68
  },
  {
    "id": 4324241,
    pos: [300, 512],
    signal: -64
  },
  {
    "id": 43225542,
    pos: [200, 467],
    signal: -72
  },
  {
    "id": 13216467,
    pos: [256, 346],
    signal: -61
  }
]

function random_cell() {
  return {
    id: Math.round(Math.random() * 10000),
    pos: [Math.round(Math.random() * WIDTH / 2) + WIDTH / 4, Math.round(Math.random() * HEIGHT / 2) + HEIGHT / 4],
    signal: -100 + Math.round(Math.random() * 35),
    speed: [0, 0],
  }
}

var cells = [
  random_cell(),
  random_cell(),
  random_cell(),
  random_cell(),
  random_cell()
]

function move_cells(cells) {
  cells.forEach(function(cell) {
    cell.pos[0] = cell.pos[0] + cell.speed[0]
    cell.pos[1] = cell.pos[1] + cell.speed[1]
    cell.signal -= 0.02
  })
}

function get_centroid(cells) {
  var cells = cells.map(function(cell) {
    return {
      signal: cell.signal + 120,
      id: cell.id,
      pos: cell.pos
    }
  })

  var signalStrengthSum = cells.map(function(cell) {
    return cell.signal
  }).reduce(function(a, b) { return a + b })

  var cellSignalRatios = cells.map(function(cell) {
    cell.signalRatio = cell.signal / signalStrengthSum
    return cell
  })

  var lat = cellSignalRatios.map(function(cell) {
    return cell.pos[0] * cell.signalRatio
  }).reduce(function(a, b) { return a + b })

  var lon = cellSignalRatios.map(function(cell) {
    return cell.pos[1] * cell.signalRatio
  }).reduce(function(a, b) { return a + b })

  return [lat, lon]
}

function visualize(cells, c) {
  c.clearRect(0,0, WIDTH, HEIGHT)
  c.strokeRect(0, 0, WIDTH, HEIGHT)

  var cells = cells.map(function(cell) {
    return {
      signal: cell.signal + 120,
      id: cell.id,
      pos: cell.pos
    }
  })

  cells.forEach(function(cell) {
    c.beginPath()
    c.arc(Math.round(cell.pos[0]), Math.round(cell.pos[1]), 6, 0, 2 * Math.PI)
    c.fill()
    c.fillText("cid: " + cell.id, cell.pos[0] + 8, cell.pos[1] + 8)
    c.fillText("dBm: " + (cell.signal - 120).toFixed(2), cell.pos[0] + 8, cell.pos[1] + 18)
  })

  var signalStrengthSum = cells.map(function(cell) {
    return cell.signal
  }).reduce(function(a, b) { return a + b })

  var cellSignalRatios = cells.map(function(cell) {
    cell.signalRatio = cell.signal / signalStrengthSum
    return cell
  })

  var lat = cellSignalRatios.map(function(cell) {
    return cell.pos[0] * cell.signalRatio
  }).reduce(function(a, b) { return a + b })

  var lon = cellSignalRatios.map(function(cell) {
    return cell.pos[1] * cell.signalRatio
  }).reduce(function(a, b) { return a + b })

  cellSignalRatios.forEach(function(cell) {
    c.strokeStyle = "rgb(45, 213, 89)"
    c.beginPath()
    c.arc(cell.pos[0], cell.pos[1], cell.signalRatio * signalStrengthSum, 0, Math.PI * 2)
    c.stroke()
  })

  c.fillStyle = "rgb(211, 68, 102)"
  c.beginPath()
  c.arc(lat, lon, 6, 0, Math.PI * 2)
  c.fill()
}

var centroid = get_centroid(cells)

var selectedCell = null

canvas.onmousedown = function(e) {
  var x = e.pageX - canvas.offsetLeft,
      y = e.pageY - canvas.offsetTop

  cells.forEach(function(cell) {
    var d = Math.sqrt(Math.pow(cell.pos[0] - x, 2) + Math.pow(cell.pos[1] - y, 2))
    if (d < 6) {
      selectedCell = cell
    }
  })
}

canvas.onmouseup = function() {
  selectedCell = null
}

canvas.onmousemove = function(e) {
  if (selectedCell) {
    selectedCell.pos = [e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop]
  }
}

setInterval(function() {
  visualize(cells, c)
}, 1000 / 30)


