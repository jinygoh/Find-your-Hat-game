const prompt = require('prompt-sync')({sigint: true});

/* 1. Set up constants game elements  */
const HAT = '^';
const HOLE = 'O';
const GRASS = '░';
const PLAYER = '*';

/* 2. set up constants game scenarios (messages) */
const WIN = "Congratulations! You win!";        //win
const LOSE = "You lose!";                       //lose
const OUT_BOUNDS = "You are out of the field!"; //out-of-bounds
const INTO_HOLE = "You fell into a hole!";      //fallen into hole
const WELCOME = "Welcome to Find Your Hat game!";    //start of game welcome message
const DIRECTION = "Which direction: up(u), down(d), left(l) or right(r)?"; //keyboard directions
const QUIT = "Press q or Q to quit."; //keyboard to quit the game
const ENDGAME = "Thanks for playing!"; //end game message
const NOT_RECOGNISED = "input not recognised."; //input not recognised

class Field {
    constructor(rows,cols) {
        this.rows = rows; //property that represents the number of rows in the field
        this.cols = cols;   //property that represents the number of columns in the field
        this.field=new Array([]);// property that represents the field for the game
        this.gameplay= false;// property to setup the game play
        this.playerX = 0; // player's x position
        this.playerY = 0; // player's y position
    }

    //methods
    //static method to welcome the player
    static welcomeMsg(msg) {
        console.log(
            "\n*************************\n" +   
            msg
            + "\n*************************\n"
        );
    }

    // * TODO the number of holes created should provide sufficient challenge for the player (not a must)
    // * TODO the holes should not block the player from moving at the start of the game (not a must)
    /* 4. method to generate the field */
    generateField() {
        for (let i = 0; i < this.rows; i++) {
            this.field[i] = new Array([]); //generate field rows

            for (let j = 0; j < this.cols; j++) {
                this.field[i][j] = GRASS; //generate field columns
            }
        }

    // Randomize hat position
    const hatX = Math.floor(Math.random() * this.cols);
    const hatY = Math.floor(Math.random() * this.rows);
    this.field[hatY][hatX] = HAT;

    // Randomize holes positions
    const numHoles = Math.floor(Math.random() * (15 - 8 + 1)) + 8; // Generate between 8 and 15 holes
    for (let i = 0; i < numHoles; i++) {
        let holeX, holeY;
        do {
            holeX = Math.floor(Math.random() * this.cols);
            holeY = Math.floor(Math.random() * this.rows);
        } while (holeX === hatX && holeY === hatY || (holeX === 0 && holeY === 0));
        this.field[holeY][holeX] = HOLE;
    }

    // Set player's initial position
    this.field[0][0] = PLAYER;
    this.playerX = 0;
    this.playerY = 0;
    }

    /* 5. method to print/display the field */
    printField() {
        for (let i = 0; i < this.rows; i++) {
            let row = '';
            for (let j = 0; j < this.cols; j++) {
                row += this.field[i][j] + ' ';
            }
            console.log(row);
        }
    }

    /* 6. method to start game */
    startGame() {
        this.gameplay = true;
        this.generateField();
        this.printField();
        this.updateGame();
    }

    /* 7. method to update game */
    updateGame() {
        while (this.gameplay) {
            const direction = prompt(`${DIRECTION} ${QUIT}\n`);
            if (direction.toLowerCase() === 'q') {
                console.log(ENDGAME);
                this.gameplay = false;
            } else {
                this.updatePlayer(direction);
                this.printField();
            }
        }
    }

    /* 8. method to end game */
    endgame() {
        console.log(ENDGAME);
        this.gameplay = false;
        process.exit();
    }

    /* 9. update the player's movement and game condition */
    updatePlayer(direction) {
        let newX = this.playerX;
        let newY = this.playerY;
        console.log("player has moved: " + direction);

        let lowerCaseDirection = direction.toLowerCase();

        switch (lowerCaseDirection) {
            case 'u':
                newY -= 1;
                break;
            case 'd':
                newY += 1;
                break;
            case 'l':
                newX -= 1;
                break;
            case 'r':
                newX += 1;
                break;
            default:
                console.log(NOT_RECOGNISED);
                return;
        }

        // End the game when out of bounds
        if (newX < 0 || newX >= this.cols || newY < 0 || newY >= this.rows) {
            console.log(OUT_BOUNDS,LOSE);
            this.endgame(); 
            return;
        }
        // End the game when falling into a hole
        if (this.field[newY][newX] === HOLE) {
            console.log(INTO_HOLE,LOSE);
            this.endgame();
        } else if (this.field[newY][newX] === HAT) {
            console.log(WIN); // the player finds the hat, Win and end game
            this.endgame();
        }

        this.field[this.playerY][this.playerX] = GRASS;
        this.field[newY][newX] = PLAYER;
        this.playerX = newX;
        this.playerY = newY;
    }
}

const field = new Field(10, 10);
Field.welcomeMsg(WELCOME);
field.startGame();