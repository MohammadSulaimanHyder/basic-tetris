document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start-button')
  const width = 10
  let nextRandomTetromino = 0
  let timerID
  let score = 0

  const tetrominoColors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]

  //Tetromino shapes at all positions.
  const lShape = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zShape = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tShape = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oShape = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iShape = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const allTetrominoShapes = [lShape, zShape, tShape, oShape, iShape]

  let currentPosition = 4
  let currentRotation = 0

  //choosing a random tetromino shape initially.
  let randomShape = Math.floor(Math.random()*allTetrominoShapes.length)
  let currentTetromino = allTetrominoShapes[randomShape][currentRotation]

  //draw the tetromino on screen
  function draw() {

    currentTetromino.forEach(arryValue => {
      squares[currentPosition + arryValue].classList.add('tetromino') //to add style to that div block
      squares[currentPosition + arryValue].style.backgroundColor = tetrominoColors[randomShape] //add color to tetromino
    })

  }

  //undraw the tetromino on screen
  function undraw() {

    currentTetromino.forEach(arryValue => {
      squares[currentPosition + arryValue].classList.remove('tetromino') //to remove style to that div block
      squares[currentPosition + arryValue].style.backgroundColor = '' //removes tetromino color
    })

  }

  //Controls the tetromino movement.
  document.addEventListener('keyup', (eventKey) => {
    
    if(eventKey.keyCode === 37) {
      moveLeft()
    } else if(eventKey.keyCode === 38) {
      rotateTetromino()
    } else if(eventKey.keyCode === 39) {
      moveRight()
    } else if(eventKey.keyCode === 40) {
      moveDown()
    }

  })

  //Moves the tetromino to the left, unless it is at the edge or blockage.
  function moveLeft() {

    undraw()
    const isAtLeftEdge = currentTetromino.some(tetrominoPosition => (currentPosition + tetrominoPosition) % width === 0) //retruns true if at the left edge.

    if(!isAtLeftEdge) currentPosition -=1 //if not at the left edge, the tetromino is moved left.

    //Checks if tetromino is taking a frozen tetromino's space and pushes it one postion back. 
    if(currentTetromino.some(tetrominoPosition => squares[currentPosition + tetrominoPosition].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }

  function rotateTetromino() {
    
    undraw()
    currentRotation ++ //Is incremented each time function is called. Using which tetromino is rotated.

    //Sets the currentRotation to zero when it has reached the currentTetromino's array limit of 4.
    if(currentRotation === currentTetromino.length) {
      currentRotation = 0
    }

    //Updating the rotation of the tetromino.
    currentTetromino = allTetrominoShapes[randomShape][currentRotation]
    draw()

  }

  //Moves the tetromino to the right, unless it is at the edge or blockage.
  function moveRight() {

    undraw()
    const isAtRightEdge = currentTetromino.some(tetrominoPosition => (currentPosition + tetrominoPosition) % width === width - 1) //retruns true if at the right edge.
    
    if(!isAtRightEdge) currentPosition +=1 //if not at the right edge, the tetromino is moved right.

    //Checks if tetromino is taking a frozen tetromino's space and pushes it one postion back.
    if(currentTetromino.some(tetrominoPosition => squares[currentPosition + tetrominoPosition].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()

  }

  //Makes the tetromino move down.
  function moveDown() {

    undraw()
    currentPosition += width //Pushes tetromino to the next line.
    draw()
    freeze()
  
  }

  //Freezes the tetromino at the bottom.
  function freeze() {
    
    if(currentTetromino.some(arryValue => squares[currentPosition + arryValue + width].classList.contains('taken'))) //checks if div has "taken"
    {
      currentTetromino.forEach(arryValue => squares[currentPosition + arryValue].classList.add('taken'))
      
      //Start a new tetromino fall.
      randomShape = nextRandomTetromino
      nextRandomTetromino = Math.floor(Math.random() * allTetrominoShapes.length)
      currentTetromino = allTetrominoShapes[randomShape][currentRotation]
      currentPosition = 4
      
      draw()
      displayNextTetromino()
      calculateScore()
      gameOver()
    }
  
  }


  //Is to display the upcoming tetromino in the mini-grid.
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0 


  //The array contains one shape of every tetromino.
  const tetrominoUpNext = [
    [1, displayWidth+1, displayWidth*2+1, 2], //l tetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //z tetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //t tetromino
    [0, 1, displayWidth, displayWidth+1], //o tetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //i tetromino 
  ]

  //Displays next tetromino on the display grid.
  function displayNextTetromino() {

    //Removes the previously displayed tetromino.
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })

    //Displays the next tetromino.
    tetrominoUpNext[nextRandomTetromino].forEach(positions => {
      displaySquares[displayIndex + positions].classList.add('tetromino')
      displaySquares[displayIndex + positions].style.backgroundColor = tetrominoColors[nextRandomTetromino]
    })

  }

  //Adding functionality to the start/pause button.
  startButton.addEventListener('click', () => {

    if(timerID) {
      clearInterval(timerID)
      timerID = null
    } else {
      draw()
      timerID = setInterval(moveDown, 1000)
      nextRandomTetromino = Math.floor(Math.random() * allTetrominoShapes.length)
      displayNextTetromino()
    }

  })

  //Calculate Score.
  function calculateScore() {

    for(let i = 0; i < 199; i +=width) {
      
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')      //remove the square at index
          squares[index].classList.remove('tetromino')  //remove the style of that square
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width) //removing the complete row from the grid
        squares = squaresRemoved.concat(squares)        
        squares.forEach(cell => grid.appendChild(cell))

      }

    }
  }

  function gameOver() {

    if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'Game Over'
      clearInterval(timerID)
    }
  }

})
