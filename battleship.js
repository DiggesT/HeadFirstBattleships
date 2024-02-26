var model = {
    boardSize: 7,
    numShips: 4,
    shipLenght: 3,
    shipsSunk: 0,
    guesses: 0,
    ships: [],
};
var displayMessage = function (message) {
    var messageArea = document.getElementById('messageArea');
    messageArea ? (messageArea.innerHTML = message) : alert('Cannot find element with id: "messageArea"');
    return;
};
var displayPlayerGuess = function (id, guess) {
    var cell = document.getElementById(id);
    cell ? cell.setAttribute('class', guess) : alert("Cannot find element with id: ".concat(id));
    return;
};
var generateShipLocations = function (numShips, shipLenght, boardSize) {
    var locations;
    var ships = [];
    for (var i = 0; i < numShips; i++) {
        do {
            locations = generateShip(shipLenght, boardSize);
        } while (collision(ships, locations));
        ships.push({ locations: locations, hits: [false, false, false] });
    }
    return ships;
};
var generateShip = function (shipLenght, boardSize) {
    var direction = Math.floor(Math.random() * 2);
    var newShipLocations = [];
    var row;
    var col;
    if (direction == 1) {
        row = Math.floor(Math.random() * boardSize);
        col = Math.floor(Math.random() * (boardSize - shipLenght + 1));
    }
    else {
        row = Math.floor(Math.random() * (boardSize - shipLenght + 1));
        col = Math.floor(Math.random() * boardSize);
    }
    for (var i = 0; i < shipLenght; i++) {
        if (direction === 1) {
            newShipLocations.push(row + "" + (col + i));
        }
        else {
            newShipLocations.push((row + i) + "" + col);
        }
    }
    return newShipLocations;
};
var collision = function (ships, locations) {
    var ship;
    for (var i = 0; i < ships.length; i++) {
        ship = ships[i];
        for (var j = 0; j < locations.length; j++) {
            if (ship.locations.indexOf(locations[j]) >= 0) {
                return true;
            }
        }
    }
    return false;
};
var fire = function (ships, guess) {
    for (var i = 0; i < ships.length; i++) {
        var ship = ships[i];
        var index = ship.locations.indexOf(guess);
        if (index >= 0) {
            ship.hits[index] = true;
            if (isSunk(ship)) {
                return { hit: true, sunk: true };
            }
            return { hit: true, sunk: false };
        }
    }
    return { hit: false, sunk: false };
};
var isSunk = function (ship) {
    for (var i = 0; i < ship.hits.length; i++) {
        if (ship.hits[i] == false)
            return false;
    }
    return true;
};
var parseGuess = function (guess, boardSize) {
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess.length != 2) {
        alert("Oops, please enter a letter and a number on the board.");
    }
    else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1) ? Number(guess.charAt(1)) : -1;
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        }
        else if (row < 0 || row >= boardSize || column < 0 || column >= boardSize) {
            alert("Oops, that's off the board!");
        }
        else {
            return ("".concat(row).concat(column));
        }
    }
    return undefined;
};
var processGuess = function (model, guess) {
    var location = parseGuess(guess, model.boardSize);
    if (location) {
        model.guesses++;
        var _a = fire(model.ships, location), hit = _a.hit, sunk = _a.sunk;
        if (hit) {
            displayPlayerGuess(location, 'hit');
            displayMessage("HIT!");
            if (sunk) {
                model.shipsSunk++;
                displayMessage("You sank my battleship!");
            }
            if (model.shipsSunk == model.numShips) {
                displayMessage("You sank all my battleships, in " + model.guesses + " guesses");
            }
        }
        else {
            displayPlayerGuess(location, 'miss');
            displayMessage("You missed.");
        }
    }
};
var handleFireButton = function () {
    var guessInput = document.getElementById('guessInput');
    var guess;
    if (guessInput != null) {
        guess = guessInput.value;
        processGuess(model, guess);
        guessInput.ariaValueText = '';
    }
    else {
        alert('Cannot find element with id: "guessInput"');
    }
};
var handleKeyPress = function (event) {
    var fireButton = document.getElementById('fireButton');
    if (fireButton) {
        event.preventDefault();
    }
};
var init = function () {
    var fireButton = document.getElementById('fireButton');
    fireButton ? fireButton.onclick = handleFireButton : alert('Cannot find element with id: "fireButton"');
    var inputForm = document.getElementById('inputForm');
    inputForm ? inputForm.onsubmit = handleKeyPress : alert('Cannot find element with id: "guessInput"');
    model.ships = generateShipLocations(model.numShips, model.shipLenght, model.boardSize);
};
window.onload = init;
