const robot = require("robotjs")
const hexNameOrig = require("hex-to-color-name")
const R = require("ramda")


const hexName = (color) => hexNameOrig(color, {
	// background
	"black": "000000",

	// pieces
	yellow: "e39f02", // square
	cyan: "0f9bd7",   // line
	red: "d70f37",    // Z
	green: "59b101",  // S
	orange: "e35b02", // L
	blue: "2141c6",   // J

	// wall
	grey: "999999",

	// piece shadows, while falling
	syellow: "e39f02",
	scyan: "0f9bd7",
	sred: "d70f37",
	sgreen: "2c5800",
	sorange: "e35b02",
	sblue: "2141c6",

  })

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const main = async () => {
	const topLeftPosition = await readTopLeftPosition()

	let prevGrid
	let grid
	while (true) {
		prevGrid = grid
		grid = readGrid(topLeftPosition)
		grid = processGrid(grid)

		if (R.equals(prevGrid, grid)) {
			// console.log("Skipping..")
			continue
		}

		printGrid(grid)
	}
}


const readTopLeftPosition = async () => {
	console.log("Position the mouse on the top left corner of the board!") // we will use https://jstris.jezevec10.com
	await sleep(1000)
	console.log("3..")
	await sleep(1000)
	console.log("2..")
	await sleep(1000)
	console.log("1..")
	await sleep(1000)
	console.log("Position acquired!")
	return robot.getMousePos()
}

const readGrid = (topLeftPoint) => {
	const squareSize = 24
	const topLeftSquareMiddle = {
		x: topLeftPoint.x + squareSize / 2,
		y: topLeftPoint.y + squareSize / 2,
	}

	const grid = []
	R.forEach(irow => {
		const row = []
		R.forEach(icol => {
			const point = {
				x: topLeftSquareMiddle.x + icol * squareSize,
				y: topLeftSquareMiddle.y + irow * squareSize,
			}
			const color = readPoint(point)
			row.push(color)
		}, R.range(0, 10))
		grid.push(row)
	}, R.range(0, 20))
	return grid
}

const processGrid = grid => {
	R.map((row, irow) => {
		R.map((square, icol) => {
			if (square === 'black') {
				console.log({irow, icol, grid})
				// grid[irow][icol] = "wow"
			}
			console.log({square})
		}, row)
	}, grid)
}

const printGrid = grid => {
	console.log("---Current Grid---")
	grid.forEach(row => {
		console.log(row.join("\t"))
	})
}

const readPoint = point => {
	// console.log(`reading point ${point.x}, ${point.y}`)
	return hexName(robot.getPixelColor(point.x, point.y))
}

main()
