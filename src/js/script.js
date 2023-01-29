document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu');
    const grid = document.querySelector('.grid');
    const bottom = document.querySelector('.bottom');
    const easy = document.querySelector('.easy');
    const medium = document.querySelector('.medium');
    const hard = document.querySelector('.hard');
    const restart = document.querySelector('.restart');
    const backMenu = document.querySelector('.backMenu');
    const status = document.querySelector('.status');
    const bombsShow = document.querySelector('.bombs');
    const flagsShow = document.querySelector('.flags');
    let width = 10;
    let squares = [];
    let bombAmount = 0;
    let flags = 0;
    let isGameOver = false;
    let matches = 0;

    function startGame() {
        easy.addEventListener("click", function() {
            bombAmount = 15;
            createBoard()
            menu.style.display = "none";
            grid.style.display = "flex";
            bottom.style.display = "flex";
            isGameOver = false;
            return
        })
        medium.addEventListener("click", function() {
            bombAmount = 30;
            createBoard()
            menu.style.display = "none";
            grid.style.display = "flex";
            bottom.style.display = "flex";
            isGameOver = false;
            return
        })
        hard.addEventListener("click", function() {
            bombAmount = 50;
            createBoard()
            menu.style.display = "none";
            grid.style.display = "flex";
            bottom.style.display = "flex";
            isGameOver = false;
            return
        })
        restart.addEventListener("click", restartGame);
        function restartGame() {
            squares.forEach((square) => {
              grid.removeChild(square);
            });
            squares = [];
            flags = 0;
            isGameOver = false;
            matches = 0;
            createBoard();
          }
        backMenu.addEventListener('click', backAtMenu);
        function backAtMenu() {
            squares.forEach((square) => {
              grid.removeChild(square);
            });
            squares = [];
            bombAmount = 0;
            flags = 0;
            isGameOver = false;
            matches = 0;
            menu.style.display = "flex";
            grid.style.display = "none";
            bottom.style.display = "none";
          }
        function createBoard() {
            const flagCount = document.getElementsByClassName('flag');
            const flagCountNumber = flagCount.length;
            const bombsArray = Array(bombAmount).fill('bomb');
            const emptyArray = Array(width*width - bombAmount).fill('valid');
            const gameArray = emptyArray.concat(bombsArray);
            const shuffledArray = gameArray.sort(() => Math.random() -0.5);
            status.innerHTML = '000000000000';
            status.style.color = "#6B0001";
            bombsShow.innerHTML = `${bombAmount}`
            flagsShow.innerHTML = `${flags}-${bombAmount}`
            for(let i = 0; i< width*width; i++) {
                const square = document.createElement('div');
                square.setAttribute('id', i);
                square.classList.add(shuffledArray[i]);
                grid.appendChild(square);
                squares.push(square);
    
                square.addEventListener('click', function(e) {
                    click(square)
                })
                square.oncontextmenu = function(e) {
                    e.preventDefault();
                    addFlag(square);
                }
            }
            for (let i =0; i < squares.length; i++) {
                let total = 0;
                const isLeftEdge = (i % width === 0);
                const isRightEdge = (i % width === width -1);
    
                if (squares[i].classList.contains('valid')) {
                    if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                    if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total++;
                    if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
                    if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total++;
                    if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total++;
                    if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total++;
                    if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total++;
                    if (i < 89 && squares[i +width].classList.contains('bomb')) total++;
                    squares[i].setAttribute('data', total);
                }
            }
    
    
        };
        function addFlag(square) {
            if (isGameOver) return;
            if (!square.classList.contains('checked') && (flags < bombAmount)) {
                if (!square.classList.contains('flag')) {
                    square.classList.add('flag');
                    square.style.backgroundImage = "url('https://vasquesjp.github.io/minesweeper/assets/img/flag.svg')";
                    square.style.backgroundRepeat= "no-repeat";
                    square.style.backgroundPosition= "center center";
                    square.style.backgroundSize= "35px 35px";
                    flags ++;
                    if (square.classList.contains('bomb')) {
                        matches ++; 
                    }
                    checkForWin();
                } else if (square.classList.contains('flag')) {
                    if (square.classList.contains('bomb') && square.classList.contains('flag')) {
                        matches --; 
                    }
                    square.classList.remove('flag');
                    square.style.backgroundImage = "none";
                    flags --;
                }
            }else if (square.classList.contains('flag')) {
                if (square.classList.contains('bomb') && square.classList.contains('flag')) {
                    matches --; 
                }
                square.classList.remove('flag');
                square.style.backgroundImage = "none";
                flags --;
            }
            flagsShow.innerHTML = `${flags}-${bombAmount}`
        }
    
        function click(square) {
            let currentId = square.id;
            if (isGameOver) return;
            if (square.classList.contains('checked') || square.classList.contains('flag')) return;
            if (square.classList.contains('bomb')) {
                gameOver(square);
            } else {
                let total = square.getAttribute('data');
                if (total !=0) {
                    square.classList.add('checked');
                    if (total == 3) {
                        square.innerHTML = `<span style="color:red;font-size:1.5rem;">${total}`;
                    } else if (total == 2){
                        square.innerHTML = `<span style="color:green;font-size:1.5rem;">${total}`;
                    } else if (total == 1) {
                        square.innerHTML = `<span style="color:blue;font-size:1.5rem;">${total}`;
                    } else {
                        square.innerHTML = `<span style="color:pink;font-size:1.5rem;">${total}`;
                    }
                    return
                }
                checkSquare(square, currentId);
            }
            square.classList.add('checked');
        }
        function checkSquare(square, currentId) {
            const isLeftEdge = (currentId % width === 0);
            const isRightEdge = (currentId % width === width -1);
    
            setTimeout(() => {
                if (currentId > 0 && !isLeftEdge) {
                    const newId = squares[parseInt(currentId) -1].id;
                    const newSquare = document.getElementById(newId);
                    click(newSquare);
                }
                if (currentId > 9 && !isRightEdge) {
                    const newId = squares[parseInt(currentId) +1 -width].id;
                    const newSquare = document.getElementById(newId);
                    click(newSquare);
                }
                if (currentId > 10) {
                    const newId = squares[parseInt(currentId) -width].id;
                    const newSquare = document.getElementById(newId);
                    click(newSquare);
                }
                if (currentId > 11 && !isLeftEdge) {
                    const newId = squares[parseInt(currentId) -1 -width].id;
                    const newSquare = document.getElementById(newId);
                    click(newSquare);
                }
                if (currentId < 98 && !isRightEdge) {
                    const newId = squares[parseInt(currentId) +1].id;
                    const newSquare = document.getElementById(newId);
                    click(newSquare);
                }
                if (currentId < 90 && !isLeftEdge) {
                    const newId = squares[parseInt(currentId) -1 +width].id;
                    const newSquare = document.getElementById(newId);
                    click(newSquare);
                }
                if (currentId < 88 && !isRightEdge) {
                    const newId = squares[parseInt(currentId) +1 +width].id;
                    const newSquare = document.getElementById(newId);
                    click(newSquare);
                }
                if (currentId < 89) {
                    const newId = squares[parseInt(currentId) +width].id;
                    const newSquare = document.getElementById(newId);
                    click(newSquare);
                }
            }, 10)
        }
        function gameOver(square) {
            status.innerHTML = '<marquee dicrection="left"> VOCE PERDEU <img src="https://vasquesjp.github.io/minesweeper/assets/img/sad.svg" /><img src=".https://vasquesjp.github.io/minesweeper/assets/img/sad.svg" /><img src="https://vasquesjp.github.io/minesweeper/assets/img/sad.svg" /></marquee>';
            status.style.color = '#FB0007';
            isGameOver = true;
    
            squares.forEach(square => {
                if (square.classList.contains('bomb')) {
                    square.style.backgroundImage = "url('https://vasquesjp.github.io/minesweeper/assets/img/bomb.svg')";
                    square.style.backgroundRepeat= "no-repeat";
                    square.style.backgroundPosition= "center center";
                    square.style.backgroundSize= "35px 35px";
                }
            })
        }
        function checkForWin() {
            if (matches === bombAmount) {
            status.innerHTML = '<marquee dicrection="left"> VOCE GANHOU <img src="https://vasquesjp.github.io/minesweeper/assets/img/happy.svg" /><img src="https://vasquesjp.github.io/minesweeper/assets/img/happy.svg" /><img src="https://vasquesjp.github.io/minesweeper/assets/img/happy.svg" /></marquee>';
            status.style.color = '#FB0007';
            isGameOver = true;
            } else { }
        }
    }
    startGame();
})
