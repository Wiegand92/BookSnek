//worm is the player controlled entity that allows player to interact with game
console.log("worm");
var worm = (function() {
	//how to instantiate its place on the board without pointers?
		//pass the whole board in?
	var wormActual = [];

	wormActual.push(new tile());
	wormActual.push(new tile());

	wormActual[0].setLocation(0);
	wormActual[1].setLocation(25);
	wormActual[0].setOrient(3);
	wormActual[1].setOrient(3);
	wormActual[0].update(true, false, true);
	wormActual[1].update(true, true, false);

	var score = 0;
	var wormBel = new belly();
	var eating = false;
	//0 is up, 1 is right, 2 is down, 3 is left
	var orientation = 3;
	var collided = false;
	var location = 260;

	function eat(boardCurrent) {
		//check the tile to see if there's any content to eat
		let boardTemp = boardCurrent;

		if(boardTemp[location].getContent() != "")
			eating = true;
		else
			eating = false;

		wormBel.update(boardTemp[location].getContent());
	}

	function move(boardCurrent) {


		//if going down add board width, opposite for going up
		//0 is up, 1 is down, 2 is left, 3 is right

		//0: up, 1: right, 2: down, 3: left
		switch(orientation) {
			case 0:
				if(location >= boardWidth-1)
					location -= boardWidth;
				else
					//trigger game over
					return boardCurrent;
				break;
			case 1:
				if(location%boardWidth != boardWidth-1)
					location++;
				else
					//trigger game over
					return boardCurrent;
				break;
			case 2:
				if(location < boardSize-boardWidth)
					location += boardWidth;
				else
					//trigger game over
					return boardCurrent;
				break;
			case 3:
				if(location%boardWidth != 0)
					location--;
				else
					//trigger game over
					return boardCurrent;
				break;
		}

		//move head
		wormActual[wormActual.length-1].update(true,false,false);

		//add new head
		if(boardCurrent[location].getWormed()) {
			console.log("GAME OVVVVERRRRR")
			return;
		}

		wormActual.push(boardCurrent[location]);

		//place head on board
		boardCurrent[location].update(true,true,false);

		//update head
		wormActual[wormActual.length-1].update(true,true,false);
		//update head orientation
		wormActual[wormActual.length-1].setOrient(orientation);

		//if player is not eating, tail moves
		if(!eating) {
			//remove tail
			wormActual[0].update(false,false,false);

			//update on the board
			boardCurrent[wormActual[0].getLocation()].update(false,false,false);
			wormActual.shift();

			//move tail
			wormActual[0].update(true,false,true);
			//orient tail
			wormActual[0].setOrient(wormActual[0].getOrient()%4);
		}

		return boardCurrent;

	}

	function update(boardCurrent, boardWidth, boardHeight) {
		//move the worm, update board
		let newBoard = move(boardCurrent, boardWidth, boardHeight);

		setOrientation();

		//eat the tile
		eat(newBoard);
		
		//update eaten tile on board
		newBoard[location].setContent("");

		return newBoard;
	}

	function setOrientation() {

		//debugger;

		let length = wormActual.length;

		if(length<3) 
			return;

		//the new body that needs to be oriented
		let newBody = wormActual[length-2];

		//the new head that needs to be oriented
		let newHead = wormActual[length-1];

		//get orientation array with necessary info [newHead,lastBody]
		let bodyOrient = [newHead.getOrient()
						 ,wormActual[length-3].getOrient()%4];

		//8 cases of curved body
			//matching orientations documented in tile.js (line 8-11)
		switch(bodyOrient[0]) {
			case 0:
				//case[0,1], new body is countercw up
				if(bodyOrient[1] == 1)
					wormActual[length-2].setOrient(8);
				//case[0,3], new body is clockwise up 
				if(bodyOrient[1] == 3)
					wormActual[length-2].setOrient(4);
				break;
			case 1:
				//case[1,2], new body is countercw right 
				if(bodyOrient[1] == 2)
					wormActual[length-2].setOrient(9);
				//case[1,0], new body is clockwise right 
				if(bodyOrient[1] == 0)
					wormActual[length-2].setOrient(5);
				break;
			case 2:
				//case[2,3], new body is countercw down 
				if(bodyOrient[1] == 3)
					wormActual[length-2].setOrient(10);
				//case[2,1], new body is clcowkise down
				if(bodyOrient[1] == 1)
					wormActual[length-2].setOrient(6);
				break;
			case 3:
				//case[3,0], new body is countercw left 
				if(bodyOrient[1] == 0)
					wormActual[length-2].setOrient(11);
				//case[3,2], new body is clockwise left 
				if(bodyOrient[1] == 2)
					wormActual[length-2].setOrient(7);
				break;
		}
	}

	function changeDirection(e) {

		//for prevention of doubling back on self
		let head = wormActual[wormActual.length-1].getLocation(), neck = wormActual[wormActual.length-2].getLocation();

		//0: up, 1: right, 2: down, 3: left
		switch(e.key) {
			case "ArrowUp":
				if(neck != head - boardWidth)
					orientation = 0;
				break;
			case "ArrowDown":
				if(neck != head + boardWidth)
					orientation = 2;
				break;
			case "ArrowLeft":
				if(neck != --head)
					orientation = 3;
				break;
			case "ArrowRight":
				if(neck != ++head)
					orientation = 1;
				break;
		}
	}

	function init(boardCurrent) {
		let boardUpdated = boardCurrent;

		boardUpdated[wormActual[0].getLocation()].update(true,false,true);

		for(let i = 1; i < wormActual.size-1; i++) {
			boardUpdated[wormActual[i].getLocation()].update(true,false,false);
		}
		
		boardUpdated[wormActual[wormActual.length-1].getLocation()].update(true,true,false);
		
		return boardUpdated;
	}

	function getBelly() {
		return wormBel;
	}

	return {
		update, init, getBelly, changeDirection
	}

})();