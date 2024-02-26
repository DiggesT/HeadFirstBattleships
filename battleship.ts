type Locations = string[]

interface Ship {
  locations: Locations,
  hits: boolean[]
}

interface Model {
  boardSize: number,
  numShips: number,
  shipLenght: number,
  shipsSunk: number,
  guesses: number,
  ships: Ship[]
}

const model: Model = {
  boardSize: 7,
  numShips: 4,
  shipLenght: 3,
  shipsSunk: 0,
  guesses: 0,
  ships: [],
}

const displayMessage = (message: string): void => {
  const messageArea = document.getElementById('messageArea') 
  messageArea ? (messageArea.innerHTML = message) : alert('Cannot find element with id: "messageArea"')
  return
}

const displayPlayerGuess = (id: string, guess: 'hit' | 'miss'): void => {
  const cell = document.getElementById(id)
  cell ? cell.setAttribute('class', guess) : alert(`Cannot find element with id: ${id}`)
  return
}

const generateShipLocations = (numShips: number, shipLenght: number, boardSize: number): Ship[] => {
  let locations: Locations
  let ships: Ship[] = []

  for (let i = 0; i < numShips; i++) {
    do {
      locations = generateShip(shipLenght, boardSize)
    } while (collision(ships, locations))
    ships.push({locations: locations, hits: [false, false, false]})
  }
  return ships
}

const generateShip = (shipLenght: number, boardSize: number): Locations => {
  const direction = Math.floor(Math.random() * 2);
  let newShipLocations: Locations = []

  let row: number
  let col: number

  if (direction == 1) {
    row = Math.floor(Math.random() * boardSize)
    col = Math.floor(Math.random() * (boardSize - shipLenght + 1))
  } else {
    row = Math.floor(Math.random() * (boardSize - shipLenght + 1))
    col = Math.floor(Math.random() * boardSize)
  }
  
  for (let i = 0; i < shipLenght; i++) {
    if (direction === 1) {
      newShipLocations.push(row + "" + (col + i));
    } else {
      newShipLocations.push((row + i) + "" + col);
    }
  }

  return newShipLocations
}

const collision = (ships: Ship[], locations: Locations):boolean => {
  let ship: Ship
  
  for (let i = 0; i < ships.length; i++) {
    ship = ships[i];
    for (let j = 0; j < locations.length; j++) {
      if (ship.locations.indexOf(locations[j]) >= 0) {
        return true
      }
    }
  }
  return false
}

const fire = (ships: Ship[], guess: string): {hit: boolean, sunk: boolean} => {
  for (let i = 0; i < ships.length; i++) {
    const ship = ships[i]
    const index = ship.locations.indexOf(guess)
    if (index >= 0) {
      ship.hits[index] = true
      if (isSunk(ship)){
        return {hit: true, sunk: true}
      }
      return {hit: true, sunk: false}
    }
  }
  return {hit: false, sunk: false}
}

const isSunk = (ship: Ship): boolean => {
  for (let i = 0; i < ship.hits.length; i++) {
    if (ship.hits[i] == false) return false
  }
  return true
}

const parseGuess = (guess: string, boardSize: number): string | undefined => {
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

  if (guess.length != 2) {
    alert("Oops, please enter a letter and a number on the board.")
  } else {
    const firstChar = guess.charAt(0)
    const row = alphabet.indexOf(firstChar)
    const column = guess.charAt(1) ? Number(guess.charAt(1)) : -1

    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.")
    } else if (row < 0 || row >= boardSize || column < 0 || column >= boardSize) {
      alert("Oops, that's off the board!")
    } else {
      return (`${row}${column}`)
    }
  }
  return undefined
}

const processGuess = (model: Model, guess: string): void => {
  const location = parseGuess(guess, model.boardSize)
  if (location) {
    model.guesses++
    const {hit, sunk} = fire(model.ships, location)
    if (hit) {
      displayPlayerGuess(location, 'hit')
      displayMessage("HIT!")
      if (sunk) {
        model.shipsSunk++
        displayMessage("You sank my battleship!")
      }
      if (model.shipsSunk == model.numShips) {
        displayMessage("You sank all my battleships, in " + model.guesses + " guesses");
      }
    } else {
      displayPlayerGuess(location, 'miss')
      displayMessage("You missed.")
    }
  }
}

const handleFireButton = () => {
  const guessInput = <HTMLInputElement>document.getElementById('guessInput')
  let guess: string
  if (guessInput != null) {
    guess = guessInput.value
    processGuess(model, guess)
    guessInput.ariaValueText = ''
  } else {
    alert('Cannot find element with id: "guessInput"')
  }
}

const handleKeyPress = (event: SubmitEvent) => {
  const fireButton = document.getElementById('fireButton')
  if (fireButton) {
    event.preventDefault();
  } 
}

const init = () => {
  const fireButton = document.getElementById('fireButton')
  fireButton ? fireButton.onclick = handleFireButton : alert('Cannot find element with id: "fireButton"')
  const inputForm = document.getElementById('inputForm')
  inputForm ? inputForm.onsubmit = handleKeyPress : alert('Cannot find element with id: "guessInput"')

  model.ships = generateShipLocations(model.numShips, model.shipLenght, model.boardSize)
}

window.onload = init