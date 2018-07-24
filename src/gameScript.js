/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// Background music by https://www.bensound.com under FREE Creative Commons License.
///


// [SC] defining a namespace
var TileZeroJS = {};

/////////////////////////////////////////////////////////////////////////
////// START: global game variables

// [SC] width/height of a tile in pixels
TileZeroJS.TILE_SIZE = 50;

TileZeroJS.gameScene;

TileZeroJS.boardLayer;

TileZeroJS.controlLayer;

TileZeroJS.graphLayer;

TileZeroJS.gameModeLayer;

// [SC][TODO] the screen size should reflect entire UI not just the board
TileZeroJS.screenWidth = 1000;
TileZeroJS.screenHeight = 1000;

TileZeroJS.playerTileSpacing = 5;

TileZeroJS.playableTiles = 54;

TileZeroJS.game;

////// END: global game variables
/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////
////// START: global TwoA variables

TileZeroJS.twoA;
TileZeroJS.adaptId;
TileZeroJS.gameId;
TileZeroJS.playerId;
TileZeroJS.isAdaptive = true;

TileZeroJS.prevPlayerScore = 0;
TileZeroJS.prevAiScore = 0;

TileZeroJS.playerTurnStart = 0;

////// END: global TwoA variables
/////////////////////////////////////////////////////////////////////////

// [SC] creating a game scene object
TileZeroJS.GameSceneC = cc.Scene.extend({ // [SC] JSON start

	onEnter: function() { // [SC] initializing the onEnter method of the Scene instance
		// [SC] calling a constructor for the Scene object?
		this._super();
		
		// [SC] init TwoA adapter
		this.initTwoA();
		
		// [SC] init a new game object
		TileZeroJS.game = new TileZeroTS.Game(this);
		TileZeroJS.game.aiDelay = 1000;
		
		let xPos = 0;
		let yPos = 0;
		
		// [SC] creating and adding the board layer to the scene
		TileZeroJS.boardLayer = new TileZeroJS.BoardLayerC();
		TileZeroJS.boardLayer.init();
		yPos += TileZeroJS.screenHeight - TileZeroJS.boardLayer.getContentSize().height;
		TileZeroJS.boardLayer.setPosition(xPos, yPos);
		
		// [SC] creating and adding the control layer to the scene
		TileZeroJS.controlLayer = new TileZeroJS.ControlLayerC();
		TileZeroJS.controlLayer.init();
		xPos += 50 + TileZeroJS.boardLayer.getContentSize().width;
		yPos = TileZeroJS.screenHeight - TileZeroJS.controlLayer.getContentSize().height;
		TileZeroJS.controlLayer.setPosition(xPos, yPos);
		this.addChild(TileZeroJS.controlLayer);
		
		// [SC] creating and adding the graph layer
		TileZeroJS.graphLayer = new TileZeroJS.GraphLayerC();
		TileZeroJS.graphLayer.init();
		yPos = TileZeroJS.boardLayer.getPositionY() - 5 - TileZeroJS.graphLayer.getContentSize().height;
		xPos = TileZeroJS.boardLayer.getPositionX();
		TileZeroJS.graphLayer.setPosition(xPos, yPos);
		this.addChild(TileZeroJS.graphLayer);
		
		// [SC] initializing the game mode layer but not adding to the scene yet
		TileZeroJS.gameModeLayer = new TileZeroJS.GameModeLayerC();
		TileZeroJS.gameModeLayer.init();
		xPos = (TileZeroJS.screenWidth - TileZeroJS.gameModeLayer.layerWidth) / 2;
		yPos = (TileZeroJS.screenHeight - TileZeroJS.gameModeLayer.layerHeight) / 2;
		TileZeroJS.gameModeLayer.setPosition(xPos, yPos);
		
		// [SC] as a game loop, using an update function called for every frame
		this.scheduleUpdate();
		
		// [TODO]
		TileZeroTS.Cfg.logEnableFlag = false;
		
		cc.audioEngine.setEffectsVolume(0.5);
	},
	
	initTwoA: function() {
		TileZeroJS.twoA = new TwoANS.TwoA();
				
		console.log(TwoANS.DifficultyAdapter.Type);
		console.log(TwoANS.DifficultyAdapter.Description);
		
		TileZeroJS.adaptId = TwoANS.DifficultyAdapter.Type;
		TileZeroJS.gameId = "TileZero";
		TileZeroJS.playerId = "Player";
		
		TileZeroJS.twoA.SetCalLength(TileZeroJS.adaptId, 1000); // [SC][TODO]
		
		// [SC] adding AIs as game scenarios with custom params
		let initPlaycount = 0;
		let initK = Misc.INITIAL_K_FCT;
		let initU = Misc.INITIAL_UNCERTAINTY;
		let initDate = Misc.DEFAULT_DATETIME;
		let timeLimit = 900000;
		TileZeroJS.twoA.AddScenario(TileZeroJS.adaptId, TileZeroJS.gameId, TileZeroTS.Cfg.VERY_EASY_AI
			, -0.384, initPlaycount, initK, initU, initDate, timeLimit);
		TileZeroJS.twoA.AddScenario(TileZeroJS.adaptId, TileZeroJS.gameId, TileZeroTS.Cfg.EASY_AI
			, 0.117, initPlaycount, initK, initU, initDate, timeLimit);
		TileZeroJS.twoA.AddScenario(TileZeroJS.adaptId, TileZeroJS.gameId, TileZeroTS.Cfg.MEDIUM_COLOR_AI
			, 1.52, initPlaycount, initK, initU, initDate, timeLimit);
		TileZeroJS.twoA.AddScenario(TileZeroJS.adaptId, TileZeroJS.gameId, TileZeroTS.Cfg.MEDIUM_SHAPE_AI
			, 1.519, initPlaycount, initK, initU, initDate, timeLimit);
		TileZeroJS.twoA.AddScenario(TileZeroJS.adaptId, TileZeroJS.gameId, TileZeroTS.Cfg.HARD_AI
			, 1.48, initPlaycount, initK, initU, initDate, timeLimit);
		TileZeroJS.twoA.AddScenario(TileZeroJS.adaptId, TileZeroJS.gameId, TileZeroTS.Cfg.VERY_HARD_AI
			, 2.066, initPlaycount, initK, initU, initDate, timeLimit);
		
		// [SC] loading a player data for TwoA
		this.loadPlayerData();
	},
	
	loadPlayerData: function() {
		let playerData = this.getCookie("player");
		
		if (playerData != "") {
			console.log("player cookie found");
			console.log(playerData);
			
			// [SC] loading player data from a cookie
			playerData = JSON.parse(playerData);
			TileZeroJS.twoA.AddPlayer(TileZeroJS.adaptId, TileZeroJS.gameId, TileZeroJS.playerId
				, playerData.rating, playerData.playcount, playerData.kfct, playerData.u, playerData.lastplayed);
		} else {
			console.log("no player cookie");
			
			// [SC] adding new player data
			TileZeroJS.twoA.AddPlayerDefault(TileZeroJS.adaptId, TileZeroJS.gameId, TileZeroJS.playerId);
		}
	},
	
	savePlayerData: function() {
		let playerNode = TileZeroJS.twoA.Player(TileZeroJS.adaptId, TileZeroJS.gameId, TileZeroJS.playerId, true);
		
		let playerData = { 
			"rating": playerNode.Rating,
			"playcount": playerNode.PlayCount,
			"kfct": playerNode.KFactor,
			"u": playerNode.Uncertainty,
			"lastplayed": playerNode.LastPlayed
		};
		
		this.setCookie("player", JSON.stringify(playerData));
	},
	
	setCookie: function(cname, cvalue) {
		document.cookie = cname + "=" + cvalue + "; path=/";
	},
	
	getCookie: function(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	},
	
	/////////////////////////////////////////////////////////////////////////
	////// START: wrapper for the layer methods called by the game logic
	
	addPlayerTile: function(colorIndex, shapeIndex, tileID, playerIndex) {
		TileZeroJS.controlLayer.addPlayerTile(colorIndex, shapeIndex, tileID, playerIndex);
	},

	removePlayerTile: function(colorIndex, shapeIndex, tileID, playerIndex) {
		TileZeroJS.controlLayer.removePlayerTile(colorIndex, shapeIndex, tileID, playerIndex);
	},

	setSelectedTile: function(colorIndex, shapeIndex, tileID, playerIndex) {
		TileZeroJS.controlLayer.setSelectedTile(colorIndex, shapeIndex, tileID, playerIndex);
		this.playSelectSound();
	},

	deselectTile: function(playerIndex) {
		TileZeroJS.controlLayer.deselectTile(playerIndex);
	},

	putTileOnBoard: function(rowIndex, colIndex, colorIndex, shapeIndex, tileID, playerIndex) {
		TileZeroJS.boardLayer.putTileOnBoard(rowIndex, colIndex, colorIndex, shapeIndex, tileID, playerIndex);
	},

	setSelectedCell: function(rowIndex, colIndex, playerIndex) {
		TileZeroJS.boardLayer.setSelectedCell(rowIndex, colIndex, playerIndex);
		this.playSelectSound();
	},

	deselectCell: function(playerIndex) {
		TileZeroJS.boardLayer.deselectCell(playerIndex);
	},
	
	endTurn: function(playerIndex) {
		// [SC] if true player turn started
		if (TileZeroJS.game.activePlayerIndex === TileZeroJS.game.HumanPlayer.PlayerIndex) {
			TileZeroJS.playerTurnStart = (new Date()).getTime();
			TileZeroJS.boardLayer.showStartTurnSprite();
			this.playTurnSound();
			
			// [TODO]
			console.log("Player turn start at: " + TileZeroJS.playerTurnStart);
		}
	},
	
	endGame: function() {
		TileZeroJS.boardLayer.showEndGameSprite();
		TileZeroJS.controlLayer.disableBtns();
	},
	
	////// END: wrapper for the layer methods called by the game logic
	/////////////////////////////////////////////////////////////////////////
	
	// [SC]function to start a new game
	startNewGame: function() {
		TileZeroJS.boardLayer.reInitBoard();
		TileZeroJS.controlLayer.reInit();
		TileZeroJS.graphLayer.reInit();
			
		TileZeroJS.prevPlayerScore = 0;
		TileZeroJS.prevAiScore = 0;
			
		TileZeroJS.playerTurnStart = 0;
		
		TileZeroJS.gameScene.addChild(TileZeroJS.boardLayer); // [TODO]
			
		TileZeroJS.game.initNewGame(TileZeroJS.playableTiles, 1);
		this.chooseAiPlayer();
		TileZeroJS.game.startNewGame();
	},
	
	// [SC] is called to update twoa ratings
	updateRating: function() {
		// [SC] calculating accuracy using turn score
		//let playerTurnScore = TileZeroJS.game.HumanPlayer.getPlayerScore() - //TileZeroJS.prevPlayerScore;
		//let aiTurnScore = TileZeroJS.game.AiPlayer.getPlayerScore() - TileZeroJS.prevAiScore;
		//let accuracy = playerTurnScore > aiTurnScore ? 1 : 0;	
		//TileZeroJS.prevPlayerScore = TileZeroJS.game.HumanPlayer.getPlayerScore();
		//TileZeroJS.prevAiScore = TileZeroJS.game.AiPlayer.getPlayerScore();
		
		// [SC] calculating accuracy using overall score
		let accuracy = TileZeroJS.game.HumanPlayer.getPlayerScore() > TileZeroJS.game.AiPlayer.getPlayerScore() ? 1 : 0;
			
		// [SC] calculating rt
		let rt = (new Date()).getTime() - TileZeroJS.playerTurnStart;
		
		// [SC] retrieve player and scenario nodes
		let playerNode = TileZeroJS.twoA.Player(TileZeroJS.adaptId, TileZeroJS.gameId, TileZeroJS.playerId, true);
		let scenarioNode = TileZeroJS.twoA.Scenario(TileZeroJS.adaptId, TileZeroJS.gameId
														, TileZeroJS.game.AiPlayer.PlayerType, true);
		
		// [TODO]
		console.log(playerNode);
		console.log(scenarioNode);
		console.log(rt + " and " + accuracy);
		
		// [SC] updating ratings
		TileZeroJS.twoA.UpdateRatings(playerNode, scenarioNode, rt, accuracy, false, 0);
		
		// [SC] save updated player rating in a cookie
		TileZeroJS.gameScene.savePlayerData();
		
		// [SC] adding new rating for drawing 
		TileZeroJS.graphLayer.addPlayerRating(playerNode.Rating);
		
		// [TODO]
		console.log(playerNode);
		console.log(scenarioNode);
	},
	
	// [SC] is called to choose the AI player difficulty in both adaptive and challenge modes
	chooseAiPlayer: function() {
		if (TileZeroJS.isAdaptive) { // [SC] if true use TwoA adaptation
			// [SC] retrieve player node
			let playerNode = TileZeroJS.twoA.Player(TileZeroJS.adaptId, TileZeroJS.gameId, TileZeroJS.playerId, true);
			// [SC] retriev scenario ID and set it as a AI player
			TileZeroJS.game.AiPlayer.PlayerType = TileZeroJS.twoA.TargetScenarioID(playerNode);
			
			// [TODO]
			console.log("Ai player: " + TileZeroJS.game.AiPlayer.PlayerType);
		} else {
			TileZeroJS.game.AiPlayer.PlayerType = TileZeroTS.Cfg.VERY_HARD_AI;
		}
		
		TileZeroJS.graphLayer.addAiRating(TileZeroJS.twoA.GetScenarioRating(TileZeroJS.adaptId, TileZeroJS.gameId, TileZeroJS.game.AiPlayer.PlayerType));
	},
	
	// [SC] contains the body of the game loop
	update: function(dt) {
		if (TileZeroJS.game.advanceGame((new Date().getTime()))) {
			
		} else {
			// [SC][TODO] no active game or game just ended
		}
		
		TileZeroJS.controlLayer.updateScores();
	},
	
	/////////////////////////////////////////////////////////////////////////
	
	playErrorSound: function() {
		cc.audioEngine.playEffect("assets/sound/error.wav", false);
	},
	
	playSelectSound: function() {
		cc.audioEngine.playEffect("assets/sound/select.wav", false);
	},
	
	playTurnSound: function() {
		cc.audioEngine.playEffect("assets/sound/turnBeep.wav", false);
	},
	
	playBtnSound: function() {
		cc.audioEngine.playEffect("assets/sound/btnClick.wav", false);
	}
	
});

/////////////////////////////////////////////////////////////////////////
////// START: game mode layer

TileZeroJS.GameModeLayerC = cc.LayerColor.extend({
	
	layerWidth: 500,
	layerHeight: 270,
	
	hSpacing: 10,
	vSpacing: 10,
	
	fontSize: 20,
	
	adaptiveBtn: null,
	challengeBtn: null,
	
	init: function() {
		// [SC] set the layer color to black
		this._super(cc.color(0,0,0,255));
		
		// [SC][TODO] set layer size here
		this.setContentSize(new cc.Size(this.layerWidth, this.layerHeight));
		
		let xPos = this.layerWidth / 2;
		let yPos = 0;
		
		// [SC] adaptive mode description
		let adaptiveLabel = cc.LabelTTF.create("Play the game in the adaptive mode.\nThe AI will be balanced in real time to your skill.", "Arial", this.fontSize, cc.TEXT_ALIGNMENT_CENTER);
		adaptiveLabel.setFontFillColor(cc.color(255,255,255,255));
		yPos = this.layerHeight - this.vSpacing - adaptiveLabel.getContentSize().height / 2;
		adaptiveLabel.setPosition(xPos, yPos);
		this.addChild(adaptiveLabel);
		
		// [SC] creating a button for the adaptive option
		this.adaptiveBtn = cc.Sprite.create("assets/adaptiveBtn.png");
		yPos -= (this.vSpacing + this.adaptiveBtn.getContentSize().height / 2 + adaptiveLabel.getContentSize().height / 2);
		this.adaptiveBtn.setPosition(xPos, yPos);
		this.addChild(this.adaptiveBtn);
		
		// [SC] challenge mode description
		let challengeLabel = cc.LabelTTF.create("Play against the smartest AI in the game.\nLost games and rage quitting are guaranteed.", "Arial", this.fontSize, cc.TEXT_ALIGNMENT_CENTER);
		challengeLabel.setFontFillColor(cc.color(255,255,255,255));
		yPos -= (this.vSpacing * 3 + challengeLabel.getContentSize().height / 2 + this.adaptiveBtn.getContentSize().height / 2); 
		challengeLabel.setPosition(xPos, yPos);
		this.addChild(challengeLabel);
		
		// [SC] creating a button for the challenge option
		this.challengeBtn = cc.Sprite.create("assets/challengeBtn.png");
		yPos -= (this.vSpacing + this.challengeBtn.getContentSize().height / 2 + challengeLabel.getContentSize().height / 2);
		this.challengeBtn.setPosition(xPos, yPos);
		this.addChild(this.challengeBtn);
		
		cc.eventManager.addListener(TileZeroJS.ModeBtnListener.clone(), this.adaptiveBtn);
		cc.eventManager.addListener(TileZeroJS.ModeBtnListener.clone(), this.challengeBtn);
		
		///////////////////////////////////////////////
		
		// [SC] creating and adding a close button to the layer
		let closeBtn = cc.Sprite.create("assets/close.png");
		xPos = this.layerWidth - closeBtn.getContentSize().width/2 - 5;
		yPos = this.layerHeight - closeBtn.getContentSize().height/2 - 5;
		closeBtn.setPosition(xPos, yPos);
		this.addChild(closeBtn);
		// [SC] adding an event listener and handler to the close button
		cc.eventManager.addListener(
			cc.EventListener.create({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: function (touch, event) {
					var target = event.getCurrentTarget();
				
					var targetSize = target.getContentSize();
					var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
							
					var location = target.convertToNodeSpace(touch.getLocation());
							
					// [SC][TODO] need click feedback
					if (cc.rectContainsPoint(targetRectangle, location)) {
						if (TileZeroJS.game.activeGameFlag) {
							// [SC] return the board layer
							TileZeroJS.gameScene.addChild(TileZeroJS.boardLayer);
							TileZeroJS.controlLayer.enableBtns();
						}
						
						// [SC] show the mode selection window
						TileZeroJS.gameScene.removeChild(TileZeroJS.gameModeLayer, false);
					}
				}
			})
		, closeBtn);
	},
	
});

TileZeroJS.ModeBtnListener = cc.EventListener.create({ // [SC] JSON start	
	event: cc.EventListener.TOUCH_ONE_BY_ONE,
	swallowTouches: true,
	onTouchBegan: function (touch, event) {
		var target = event.getCurrentTarget();
				
		var targetSize = target.getContentSize();
		var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
				
		var location = target.convertToNodeSpace(touch.getLocation());
				
		// [SC][TODO] need click feedback
		if (cc.rectContainsPoint(targetRectangle, location)) {
			
			if (TileZeroJS.gameModeLayer.adaptiveBtn === target) {
				// [SC] set the game mode to adaptive
				TileZeroJS.isAdaptive = true;
				console.log("adaptive was selected"); // [TODO][REMOVE]
			} 
			else if (TileZeroJS.gameModeLayer.challengeBtn === target) {
				// [SC] set the game mode to challenge
				TileZeroJS.isAdaptive = false;
				console.log("challenge was selected"); // [TODO][REMOVE]
			}
			
			// [SC] remove game mode selector window from the game scene
			TileZeroJS.gameScene.removeChild(TileZeroJS.gameModeLayer, false);
			// [SC] start a new game
			TileZeroJS.gameScene.startNewGame();
		}
	}

});

////// END: game mode layer
/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////
////// START: graph layer

TileZeroJS.GraphLayerC = cc.Layer.extend({
	
	pixelMarginHor: 10,
	pixelMarginVer: 10,
	
	pixelWidth: TileZeroJS.TILE_SIZE * TileZeroTS.Cfg.BOARD_COL_COUNT,
	pixelHeight: 200,
	
	verGridSize: 5, // [SC] grid width in number of inner lines
	horGridSize: 5, // [SC] grid height in number of inner lines
	
	defRatingRange: [-0.5, 2.5],
	ratingRange: [-0.5, 2.5],
	maxTurn: 50,
	
	pointsX: [],
	playerRatings: [],
	aiRatings: [],
	
	drawArea: null,
	
	playerColor: cc.color(34, 139, 34, 255),
	aiColor: cc.color(220, 20, 60, 255),
	gridColor: cc.color(0, 0, 0, 100),
	
	init: function() {
		this._super();
		
		this.setContentSize(new cc.Size(this.pixelWidth, this.pixelHeight));
		
		this.precalcPointsX();
		
		this.drawArea = cc.DrawNode.create();
		this.addChild(this.drawArea);
	},
	
	reInit: function() {
		// [TODO]
		//this.playerRatings.length = 0;
		//this.aiRatings.length = 0;
		//this.drawArea.clear();
		//this.ratingRange[0] = this.defRatingRange[0];
		//this.ratingRange[1] = this.defRatingRange[1];
	},
	
	precalcPointsX: function(){
		this.pointsX.length = 0;
		for(let turnCount=0; turnCount<this.maxTurn; turnCount++) {
			this.pointsX.push(this.getPixelX(turnCount));
		}
	},
	
	addPlayerRating: function(rating) {
		if (rating < this.ratingRange[0]) {
			this.ratingRange[0] = rating;
		} 
		else if (rating > this.ratingRange[1]) {
			this.ratingRange[1] = rating;
		}
		
		// [SC] if max length was reached then remove the first element
		if (this.playerRatings.length === this.maxTurn) {
			this.playerRatings.splice(0, 1);
		}
		
		this.playerRatings.push(rating);
		
		this.redrawRatings();
	},
	
	addAiRating: function(rating) {
		// [SC] if max length was reached then remove the first element
		if (this.aiRatings.length === this.maxTurn) {
			this.aiRatings.splice(0, 1);
		}
		
		this.aiRatings.push(rating);
		
		this.redrawRatings();
	},
	
	getPixelY: function(rating) {
		return this.pixelMarginVer + (this.pixelHeight - (this.pixelMarginVer * 2)) 
			* (rating -  this.ratingRange[0]) / (this.ratingRange[1] - this.ratingRange[0]);
	},
	
	getPixelX: function(turnCount) {
		return this.pixelMarginHor + (this.pixelWidth - (this.pixelMarginHor * 2)) * turnCount / this.maxTurn;
	},

	// [SC] draw grid
	redrawGrid: function () {
		let lineWidth = 1;
		let gridLineColor = this.gridColor;
		
		///////////////////////////////////////////////
		////// START: drawing the outer bondary
		
		// [SC] top left point
		let originPoint = new cc.Point(lineWidth, this.pixelHeight);
		// [SC] bottom right point
		let destPoint = new cc.Point(this.pixelWidth, lineWidth);
		
		// [SC] draws a rectangle (origin, destination, fillColor, lineWidth, lineColor)
		// [SC] drawing the outer boundary of the graph area
		this.drawArea.drawRect(originPoint, destPoint, null, 1, gridLineColor);
		
		////// END: drawing the outer bondary
		///////////////////////////////////////////////
		
		///////////////////////////////////////////////
		////// START: drawing the inner grid
		
		// [TODO] change the names
		let verSpacing = this.pixelWidth / (this.horGridSize + 1);
		let horSpacing = this.pixelHeight / (this.verGridSize + 1);
		
		// [SC] drawing vertical grids
		for(let index=1; index<=this.horGridSize; index++) {
			let xPos = index * verSpacing;
			this.drawArea.drawSegment(new cc.Point(xPos,lineWidth), new cc.Point(xPos, this.pixelHeight-lineWidth), lineWidth, gridLineColor);
		}
		
		// [SC] drawing horizontal grids
		for(let index=1; index<=this.verGridSize; index++) {
			let yPos = index * horSpacing;
			this.drawArea.drawSegment(new cc.Point(lineWidth, yPos), new cc.Point(this.pixelWidth-lineWidth, yPos), lineWidth, gridLineColor);
		}
		
		////// END: drawing the inner grid
		///////////////////////////////////////////////
	},
	
	// [SC] redraw player and AI ratings
	redrawRatings: function() {
		this.drawArea.clear();
		
		this.redrawGrid();
		
		if (this.playerRatings.length >= 2) {
			for(let turnCount=1; turnCount<this.playerRatings.length; turnCount++) {
				//console.log(new cc.Point(this.pointsX[turnCount-1], this.getPixelY(this.playerRatings[turnCount-1]))); // [TODO]
				//console.log(new cc.Point(this.pointsX[turnCount], this.getPixelY(this.playerRatings[turnCount])));
				
				this.drawArea.drawSegment(new cc.Point(this.pointsX[turnCount-1], this.getPixelY(this.playerRatings[turnCount-1]))
					, new cc.Point(this.pointsX[turnCount], this.getPixelY(this.playerRatings[turnCount])), 2, this.playerColor);
			}
		}
		
		if (this.aiRatings.length >= 2) {
			for(let turnCount=1; turnCount<this.aiRatings.length; turnCount++) {
				//console.log(new cc.Point(this.pointsX[turnCount-1], this.getPixelY(this.playerRatings[turnCount-1]))); // [TODO]
				//console.log(new cc.Point(this.pointsX[turnCount], this.getPixelY(this.playerRatings[turnCount])));
				
				this.drawArea.drawSegment(new cc.Point(this.pointsX[turnCount-1], this.getPixelY(this.aiRatings[turnCount-1]))
					, new cc.Point(this.pointsX[turnCount], this.getPixelY(this.aiRatings[turnCount])), 2, this.aiColor);
			}
		}
	}

});

////// START: graph layer
/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////
////// START: control layer

TileZeroJS.ControlLayerC = cc.Layer.extend({
	
	// [SC] player tiles
	tiles: [],
	// [SC] placeholder
	playerTilePh: null,
	// [SC] player tile selector
	tileSelector: null,
	
	humanScoreLabel: null,
	aiScoreLabel: null,
	
	endTurnBtn: null,
	dropBtn: null,
	putBtn: null,
	
	musicToggleBtn: null,
	musicState: false,
	musicId: null,
	
	// [SC] assigning a custom init method to the layer object?
	init: function() {
		this._super();
		
		// [SC] used to highlight tile selected by the player
		this.tileSelector = new TileZeroJS.SelectionSpriteC();
		
		// [SC] create buttons
		let yPos = this.createButtons();
		
		// [SC] a placeholder sprite for player tiles
		this.playerTilePh = cc.Sprite.createWithTexture("assets/playerTilePh_" + TileZeroJS.TILE_SIZE + ".png");
		let xPos = this.playerTilePh.getContentSize().width / 2;		
		yPos += 50 + this.playerTilePh.getContentSize().height / 2;
		this.playerTilePh.setPosition(xPos, yPos);
		this.addChild(this.playerTilePh);
		
		// [SC] adding AI score label sprite
		this.aiScoreLabel = cc.LabelTTF.create("0", "Arial", "50", cc.TEXT_ALIGNMENT_CENTER);
		this.aiScoreLabel.setFontFillColor(cc.color(0,0,0,255));
		yPos += 20 + this.aiScoreLabel.getContentSize().height / 2 + this.playerTilePh.getContentSize().height / 2;
		this.aiScoreLabel.setPosition(xPos, yPos);
		this.addChild(this.aiScoreLabel);
		
		// [SC] adding human score label sprite
		this.humanScoreLabel = cc.LabelTTF.create("0", "Arial", "50", cc.TEXT_ALIGNMENT_CENTER);
		this.humanScoreLabel.setFontFillColor(cc.color(0,0,0,255));
		yPos += 5 + (this.humanScoreLabel.getContentSize().height / 2) * 2;
		this.humanScoreLabel.setPosition(xPos, yPos);
		this.addChild(this.humanScoreLabel);
		
		this.setContentSize(70, yPos + this.humanScoreLabel.getContentSize().height / 2 + 5);
	},
	
	// [SC] called before each new game
	reInit: function() {
		this.deselectTile(-1);
		
		this.removePlayerTiles();
		
		this.humanScoreLabel.setString("0");
		this.aiScoreLabel.setString("0");
		
		this.enableBtns();
	},
	
	// called before each new game or restart window
	enableBtns: function() {
		this.addChild(this.endTurnBtn);
		this.addChild(this.dropBtn);
		this.addChild(this.putBtn);
	},
	
	// [SC] called after each game
	disableBtns: function() {
		this.removeChild(this.endTurnBtn, false);
		this.removeChild(this.dropBtn, false);
		this.removeChild(this.putBtn, false);
	},
	
	createButtons: function() {
		let vSpacing = 5;
		
		let xPos = Math.ceil(TileZeroJS.TILE_SIZE / 2);
		let yPos = 0;
		
		this.musicToggleBtn = new TileZeroJS.ButtonC("musicOff.png", "musicToggleBtn");
		yPos += vSpacing + xPos
		this.musicToggleBtn.setPosition(xPos, yPos);
		this.addChild(this.musicToggleBtn);
		
		let restartBtn = new TileZeroJS.ButtonC("restartBtn_50.png", "restartBtn");
		yPos += 10 * vSpacing + TileZeroJS.TILE_SIZE
		restartBtn.setPosition(xPos, yPos);
		this.addChild(restartBtn);
		
		this.endTurnBtn = new TileZeroJS.ButtonC("endTurnBtn_50.png", "endTurnBtn");
		yPos += vSpacing + TileZeroJS.TILE_SIZE;
		this.endTurnBtn.setPosition(xPos, yPos);
		
		this.dropBtn = new TileZeroJS.ButtonC("dropBtn_50.png", "dropBtn");
		yPos += vSpacing + TileZeroJS.TILE_SIZE;
		this.dropBtn.setPosition(xPos, yPos);
		
		this.putBtn = new TileZeroJS.ButtonC("putBtn_50.png", "putBtn");
		yPos += vSpacing + TileZeroJS.TILE_SIZE;
		this.putBtn.setPosition(xPos, yPos);
		
		return yPos + xPos;
	},

	// [SC] called by game logic
	addPlayerTile: function (colorIndex, shapeIndex, tileID, playerIndex) {
		// [SC] ignore ai player
		if (TileZeroJS.game.HumanPlayer.PlayerIndex !== playerIndex) {
			return;
		}
		
		for(let tile of this.tiles) {
			if (tile.colorIndex === colorIndex && tile.shapeIndex === shapeIndex && tile.tileID === tileID) {
				console.log("Cannot add player tile. It already exists in the player's stack.");
				return;
			}
		}
		
		let tile = new TileZeroJS.VTileC(colorIndex, shapeIndex, tileID, playerIndex, true);
		
		// [SC] add the tile to the fast look-up array
		this.tiles.push(tile);
		
		// [SC] add the tile sprite to the layer
		this.addChild(tile);
		
		// [SC] update sprite position for all times
		this.updateTilePositions();
	},
	
	// [SC] called by game logic
	removePlayerTile: function(colorIndex, shapeIndex, tileID, playerIndex) {
		// [SC] ignore ai player
		if (TileZeroJS.game.HumanPlayer.PlayerIndex !== playerIndex) {
			return;
		}
		
		for(let index=0; index<this.tiles.length; index++) {
			let tile = this.tiles[index];
			if (tile.colorIndex === colorIndex && tile.shapeIndex === shapeIndex 
				&& tile.tileID === tileID && tile.playerIndex === playerIndex) {
				
				// [SC] remove the tile from the look-up array
				this.tiles.splice(index, 1);
				// [SC] remove the tile sprite from the layer
				this.removeChild(tile);
				
				// [SC] update sprite position for all times
				this.updateTilePositions();
				
				return;
			}
		}
		
		console.log("removePlayerTile: tile (" + colorIndex + "," + shapeIndex + ") was not removed from player " + playerIndex);
	},
	
	// [SC] called by game logic
	setSelectedTile: function(colorIndex, shapeIndex, tileID, playerIndex) {
		// [SC] ignore ai player
		if (TileZeroJS.game.HumanPlayer.PlayerIndex !== playerIndex) {
			return;
		}
		
		for(let tile of this.tiles) {
			if (tile.colorIndex === colorIndex && tile.shapeIndex === shapeIndex 
				&& tile.tileID === tileID && tile.playerIndex === playerIndex) {
				
				this.tileSelector.setPosition(tile.getPosition());

				if (!this.tileSelector.isActive) {
					this.addChild(this.tileSelector);
					this.tileSelector.isActive = true;
				}

				return;
			}
		}
	},
	
	// [SC] called by game logic, and local UI reset function
	deselectTile: function(playerIndex) {
		if (playerIndex === -1 || TileZeroJS.game.HumanPlayer.PlayerIndex === playerIndex) {
			if (this.tileSelector.isActive) {
				this.removeChild(this.tileSelector);
				this.tileSelector.rowIndex = -1;
				this.tileSelector.colIndex = -1;
				this.tileSelector.isActive = false;
			}
		}
	},
	
	removePlayerTiles: function() {
		for(let tile of this.tiles) {
			this.removeChild(tile);
		}
		
		this.tiles.length = 0;
	},
	
	updateTilePositions: function() {		
		let x = this.playerTilePh.getPositionX() - this.playerTilePh.getContentSize().width / 2 
			+ TileZeroJS.TILE_SIZE / 2 + TileZeroJS.playerTileSpacing;
		let startY = this.playerTilePh.getPositionY() + this.playerTilePh.getContentSize().height / 2 - TileZeroJS.playerTileSpacing;
		
		for(let index=0; index<this.tiles.length; index++) {
			let tile = this.tiles[index];
			let y = startY - TileZeroJS.TILE_SIZE * index - TileZeroJS.playerTileSpacing * index - TileZeroJS.TILE_SIZE / 2;

			tile.setPosition(x, y);
		}
	},
	
	updateScores: function() {
		if (typeof(TileZeroJS.game.HumanPlayer) !== 'undefined') {
			this.humanScoreLabel.setString(TileZeroJS.game.HumanPlayer.getPlayerScore());
		}
		
		if (typeof(TileZeroJS.game.AiPlayer) !== 'undefined') {
			this.aiScoreLabel.setString(TileZeroJS.game.AiPlayer.getPlayerScore());
		}
	},
	
	toggleMusic: function(){
		this.musicState = !this.musicState;
		
		if (this.musicState) {
			this.musicToggleBtn.initWithFile("assets/musicOn.png");
			this.playBgMusic();
		} else {
			this.musicToggleBtn.initWithFile("assets/musicOff.png");
			this.pauseBgMusic();
		}
	},
	
	playBgMusic: function() {
		if (this.musicId === null) {
			// [SC] load and play bg music
			this.musicId = cc.audioEngine.playMusic("assets/sound/bensound-funnysong.mp3", true);
			cc.audioEngine.setMusicVolume(0.1);
		} 
		else if (!cc.audioEngine.isMusicPlaying()) {
			// [SC] resume bg music
			cc.audioEngine.resumeMusic();
		}
	},
	
	pauseBgMusic: function() {
		if (this.musicId !== null && cc.audioEngine.isMusicPlaying()) {
			cc.audioEngine.pauseMusic();
		}
	}
	
});

// [SC] represents a playable tile
TileZeroJS.ButtonC = cc.Sprite.extend({ // [SC] JSON start
	
	// [SC] stores the button type
	btnType: null,

	// [SC] constructor
	ctor: function(image, btnType) {
		this._super();
		this.initWithFile("assets/" + image); // [TODO] init with texture?
		
		this.btnType = btnType;
		
		cc.eventManager.addListener(TileZeroJS.ButtonListerner.clone(), this);
	},
	
	// [SC] removes TileZeroJS.TileListener
	invokeAction: function(){
		if (this.btnType === "putBtn") {
			if (TileZeroJS.game.placePlayerTileOnBoard(TileZeroJS.game.HumanPlayer.PlayerIndex)) {
				TileZeroJS.gameScene.playBtnSound();
				console.log("true");
			} else {
				TileZeroJS.gameScene.playErrorSound();
				console.log("false");
			}
		} 
		else if (this.btnType === "dropBtn") {
			if (TileZeroJS.game.dropPlayerTile(TileZeroJS.game.HumanPlayer.PlayerIndex)) {
				TileZeroJS.gameScene.playBtnSound();
			} else {
				TileZeroJS.gameScene.playErrorSound();
			}
		}
		else if (this.btnType === "endTurnBtn") {
			if (TileZeroJS.game.endTurn(TileZeroJS.game.HumanPlayer.PlayerIndex)) {
				TileZeroJS.gameScene.playBtnSound();
				
				// [SC] update player rating
				TileZeroJS.gameScene.updateRating();
				
				// [SC] choose AI player for the next turn
				TileZeroJS.gameScene.chooseAiPlayer();
			} else {
				TileZeroJS.gameScene.playErrorSound();
			}
		} 
		else if (this.btnType === "restartBtn") {
			TileZeroJS.gameScene.playBtnSound();
			
			// [SC] remove the board layer
			TileZeroJS.gameScene.removeChild(TileZeroJS.boardLayer, false);
			
			// [SC] disable control buttons if the restart pressed during an active game
			if (TileZeroJS.game.activeGameFlag) {
				TileZeroJS.controlLayer.disableBtns();
			}
			
			// [SC] show the mode selection window
			TileZeroJS.gameScene.addChild(TileZeroJS.gameModeLayer);
		} 
		else if (this.btnType === "musicToggleBtn") {
			TileZeroJS.controlLayer.toggleMusic();
		}
	},
	
});

TileZeroJS.ButtonListerner = cc.EventListener.create({ // [SC] JSON start

	// [SC] event trigger is a touch one at the time
	event: cc.EventListener.TOUCH_ONE_BY_ONE, // [SC] class property value assignment
	
	// [SC] ignore other touches if there is an active one
	swallowTouches: true, // [SC] class property value assignment
	
	// [SC] callback function as event handler
	onTouchBegan: function (touch, event){		
		// [SC] returns the current click target/node
		var target = event.getCurrentTarget();
		
		// [SC] get target size
		var targetSize = target.getContentSize();
		// [SC] create a rectangle of the same size as the target
		var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
		
		// [SC] touch.getLocation() to location of the touch within game screen
		// [SC] target.convertToNodeSpace converts the location to one relative to the node
		var location = target.convertToNodeSpace(touch.getLocation());
		
		// [SC] check if the location within the rectangle
		if (cc.rectContainsPoint(targetRectangle, location)) {
			target.invokeAction();
		}
	}

});

////// END: control layer
/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////
////// START: board layer

// [SC] creating an extended layer class
TileZeroJS.BoardLayerC = cc.LayerGradient.extend({ // [SC] JSON start

	// [SC] for a quick reference for the sprites drawn on the board
	board: null,
	// [SC] selector for a board cell
	boardSelector: null,
	// [SC]
	endGameSprite: null,
	// [SC]
	startTurnSprite: null,

	// [SC] assigning a custom init method to the layer object?
	init: function() {
		this._super();
		
		this.setStartColor(cc.color(0,0,0,255));
		this.setEndColor(cc.color(0x46,0x82,0xB4,255));
		
		this.setContentSize(TileZeroJS.TILE_SIZE * TileZeroTS.Cfg.BOARD_COL_COUNT
			, TileZeroJS.TILE_SIZE * TileZeroTS.Cfg.BOARD_ROW_COUNT);
			
		this.initBoard();
		
		this.boardSelector = new TileZeroJS.SelectionSpriteC();
		
		this.startTurnSprite = cc.Sprite.create("assets/startTurn.png");
		this.startTurnSprite.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
	},
	
	initBoard: function() {
		this.board = [];
		
		for (var rowIndex = 0; rowIndex < TileZeroTS.Cfg.BOARD_ROW_COUNT; rowIndex++) {
			this.board[rowIndex] = [];
			
			for(var colIndex = 0; colIndex < TileZeroTS.Cfg.BOARD_COL_COUNT; colIndex++) {
				this.board[rowIndex][colIndex] = null;
			}
		}
	},
	
	// [SC] init the board with placeholder sprites
	reInitBoard: function() {		
		this.deselectCell(-1);

		for(var rowIndex = 0; rowIndex < TileZeroTS.Cfg.BOARD_ROW_COUNT; rowIndex++) {
			for(var colIndex = 0; colIndex < TileZeroTS.Cfg.BOARD_COL_COUNT; colIndex++) {
				
				if (this.board[rowIndex][colIndex] instanceof TileZeroJS.VTileC) {
					this.removeChild(this.board[rowIndex][colIndex]);
				}
				else if (this.board[rowIndex][colIndex] instanceof TileZeroJS.PHTileC) {
					continue;
				}

				let phSprite = new TileZeroJS.PHTileC(rowIndex, colIndex);
				
				// [SC] set the sprite's pixel coordinates
				let pixelPos = this.getPixelPosition(rowIndex, colIndex);
				phSprite.setPosition(pixelPos[0], pixelPos[1]);
				
				// [SC] add the sprite to the layer where it will be automatically drawn
				this.addChild(phSprite);
				
				// [SC] register the sprite in the board matrix
				this.board[rowIndex][colIndex] = phSprite;
			}
		}
		
		if (this.endGameSprite !== null) {
			this.removeChild(this.endGameSprite);
			this.endGameSprite = null;
		}
	},
	
	///////////////////////////////////////////////////////
	
	putTileOnBoard: function(rowIndex, colIndex, colorIndex, shapeIndex, tileID, playerIndex) {
		if (!this.board[rowIndex][colIndex].isPlaceHolder) {
			return;
		}
		
		// [SC] remove the placeholder tile
		let phTile = this.board[rowIndex][colIndex];
		this.removeChild(phTile);
		phTile.removeListener();
		
		// [SC] create the playable tile sprite
		let vTile = new TileZeroJS.VTileC(colorIndex, shapeIndex, tileID, playerIndex, false);
		
		// [SC] add the tile sprite to the layer
		vTile.setPosition(phTile.getPosition());
		this.addChild(vTile);
		// [SC] add the tile to the fast look-up matrix
		this.board[rowIndex][colIndex] = vTile;
		vTile.rowIndex = rowIndex;
		vTile.colIndex = colIndex;
	},
	
	// [SC] called by game logic
	setSelectedCell: function(rowIndex, colIndex, playerIndex) {
		// [SC] ignore player index
		
		// [SC] are rowIndex and colIndex valid?
		if (rowIndex < 0 || rowIndex >= TileZeroTS.Cfg.BOARD_ROW_COUNT 
			|| colIndex < 0 || colIndex >= TileZeroTS.Cfg.BOARD_COL_COUNT) {
			return;
		}
		
		// [SC] is cell a clickable placeholder
		if (!this.board[rowIndex][colIndex].isPlaceHolder) {
			return;
		}
		
		// [SC] was the placeholder already highlighted
		if (this.boardSelector.isActive &&
			this.boardSelector.rowIndex === rowIndex && 
			this.boardSelector.colIndex === colIndex) {
			return;
		}
		
		this.boardSelector.setPosition(this.board[rowIndex][colIndex].getPosition());
		// [SC] add the sprite to the layer if it was not already added
		if (!this.boardSelector.isActive) {
			this.addChild(this.boardSelector);
		}
		
		this.boardSelector.rowIndex = rowIndex;
		this.boardSelector.colIndex = colIndex;
		this.boardSelector.isActive = true;
	},
	
	// [SC] called by game logic and local UI reset function
	deselectCell: function(playerIndex) {
		// [SC] ignore player index
		
		if (this.boardSelector.isActive) {
			this.removeChild(this.boardSelector);
			this.boardSelector.rowIndex = -1;
			this.boardSelector.colIndex = -1;
			this.boardSelector.isActive = false;
		}
	},
	
	showStartTurnSprite: function() {
		this.addChild(this.startTurnSprite);
		this.scheduleOnce(this.removeTurnSprite, 1);
	},
	
	removeTurnSprite: function() {
		this.removeChild(this.startTurnSprite);
	},
	
	showEndGameSprite: function() {
		if (TileZeroJS.game.HumanPlayer.getPlayerScore() > TileZeroJS.game.AiPlayer.getPlayerScore()) {
			this.endGameSprite = cc.Sprite.create("assets/win.png");
		} else {
			this.endGameSprite = cc.Sprite.create("assets/loss.png");
		}
		
		this.endGameSprite.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
		this.addChild(this.endGameSprite);
	},
	
	///////////////////////////////////////////////////////
	
	getPixelPosition: function(rowIndex, colIndex) {
		let xPos = colIndex * TileZeroJS.TILE_SIZE + TileZeroJS.TILE_SIZE/2;
		let yPos = (TileZeroTS.Cfg.BOARD_ROW_COUNT - rowIndex) * TileZeroJS.TILE_SIZE - TileZeroJS.TILE_SIZE/2;
		
		return [xPos, yPos];
	}
	
});

// [SC] a placeholder tile representing an empty cell
TileZeroJS.PHTileC = cc.Sprite.extend({ // [SC] JSON start

	// [SC] false because it is a playable tile
	isPlaceHolder: true,
	
	// [SC] mouse click/touch listener
	tileListener: null,
	
	// [SC] position on a board
	rowIndex: -1,
	colIndex: -1,
	
	// [SC] constructor
	ctor: function(p_rowIndex, p_colIndex){
		this._super();
		
		this.rowIndex = p_rowIndex;
		this.colIndex = p_colIndex;
		
		let cellCount = p_rowIndex * TileZeroTS.Cfg.BOARD_COL_COUNT + p_colIndex;
		let id = cellCount - 4 * Math.floor(cellCount / 4) + 1;
		if (TileZeroTS.Cfg.BOARD_COL_COUNT % 2 === 0 && (p_rowIndex + 1) % 2 === 0) {
			id -= 1;
			if (id === 0) {
				id = 4;
			} 
		}
		
		this.initWithFile("assets/cell" + id + "_" + TileZeroJS.TILE_SIZE + ".png");
		
		this.tileListener = TileZeroJS.TileListener.clone();
		
		cc.eventManager.addListener(this.tileListener, this);
	},
	
	// [SC] removes TileZeroJS.TileListener
	removeListener: function(){
		cc.eventManager.removeListener(this.tileListener);
		this.tileListener = null;
	}
	
});

// [SC] represents a playable tile
TileZeroJS.VTileC = cc.Sprite.extend({ // [SC] JSON start
	
	// [SC] true because it is a placeholder tile
	isPlaceHolder: false,
	
	// [SC] mouse click/touch listener
	tileListener: null,
	
	// [SC] position on a board
	rowIndex: -1,
	colIndex: -1,
	
	// [SC] information about the tile
	colorIndex: -1,
	shapeIndex: -1,
	tileID: -1,
	playerIndex: -1,

	// [SC] constructor
	ctor: function(colorIndex, shapeIndex, tileID, playerIndex, addListenerFlag) {
		this._super();
		this.initWithFile("assets/" + colorIndex + "" + shapeIndex + "_15_" + TileZeroJS.TILE_SIZE + ".jpg");
		
		this.colorIndex = colorIndex;
		this.shapeIndex = shapeIndex;
		this.tileID = tileID;
		this.playerIndex = playerIndex;
		
		if (addListenerFlag) {
			this.tileListener = TileZeroJS.TileListener.clone();	
			cc.eventManager.addListener(this.tileListener, this);
		}
	},
	
	// [SC] removes TileZeroJS.TileListener
	removeListener: function() {
		if (this.tileListener !== null) {
			cc.eventManager.removeListener(this.tileListener);
			this.tileListener = null;
		}
	}

});

// [SC] a placeholder tile representing an empty cell
TileZeroJS.SelectionSpriteC = cc.Sprite.extend({ // [SC] JSON start

	// [SC] position on a board
	rowIndex: -1,
	colIndex: -1,
	// [SC] true if it is highlighting a selected cell or tile
	isActive: false,

	// [SC] constructor
	ctor: function(){
		this._super();
		this.initWithFile("assets/selection_" + TileZeroJS.TILE_SIZE + ".png");
	}
	
});

TileZeroJS.TileListener = cc.EventListener.create({ // [SC] JSON start

	// [SC] event trigger is a touch one at the time
	event: cc.EventListener.TOUCH_ONE_BY_ONE, // [SC] class property value assignment
	
	// [SC] ignore other touches if there is an active one
	swallowTouches: true, // [SC] class property value assignment
	
	// [SC] callback function as event handler
	onTouchBegan: function (touch, event){		
		// [SC] returns the current click target/node
		var target = event.getCurrentTarget();
		
		// [SC] get target size
		var targetSize = target.getContentSize();
		// [SC] create a rectangle of the same size as the target
		var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
		
		// [SC] touch.getLocation() to location of the touch within game screen
		// [SC] target.convertToNodeSpace converts the location to one relative to the node
		var location = target.convertToNodeSpace(touch.getLocation());
		
		// [SC] check if the location within the rectangle
		if (cc.rectContainsPoint(targetRectangle, location)) {
			if (target.isPlaceHolder) { // [SC] placeholder sprite was clicked				
				TileZeroJS.game.setSelectedCell(target.rowIndex, target.colIndex, TileZeroJS.game.HumanPlayer.PlayerIndex);
			} 
			else {
				if (!TileZeroJS.game.setSelectedTile(target.colorIndex, target.shapeIndex
					, target.tileID, target.playerIndex)) {
					TileZeroJS.gameScene.playErrorSound();	
				}
			}
		}
	}

});

////// END: board layer
/////////////////////////////////////////////////////////////////////////