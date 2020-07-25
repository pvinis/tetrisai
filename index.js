const robot = require("robotjs")
const hexNameOrig = require("hex-to-color-name")
const R = require("ramda")


const hexName = (color) => hexNameOrig(color, {
	white: "ffffff",
	black: "000000",
	yellow: "e39f02",
	orange: "e35b02",
	red: "d70f37",
	cyan: "0f9bd7",
	blue: "2141c6",
  })

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const main = async () => {
	const topLeftPosition = await readTopLeftPosition()

	const grid = readGrid(topLeftPosition)
	printGrid(grid)
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

const printGrid = grid => {
	console.log("---Current Grid---")
	grid.forEach(line => {
		console.log(line.join("\t"))
	})
}

const readPoint = point => {
	// console.log(`reading point ${point.x}, ${point.y}`)
	return hexName(robot.getPixelColor(point.x, point.y))
}

main()
