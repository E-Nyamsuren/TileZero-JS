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

window.onload = function(){ // [SC] called only after all web page resources have been loaded

	cc.game.onStart = function(){ // [SC] storing anonymous function as an expression to the onStart variable
		// [SC] setting the preffered screen resolution
		// [SC] cc.ResolutionPolicy.SHOW_ALL for stretching to fill the screen?
		cc.view.setDesignResolutionSize(TileZeroJS.screenWidth, TileZeroJS.screenHeight, cc.ResolutionPolicy.SHOW_ALL);
		
		// [SC] preload all resources in the gameResources array before the scene starts
		cc.LoaderScene.preload(gameResources, createGameScene, this);
	};
	
	function createGameScene() { // [SC] declaring a function
		// [SC]
		TileZeroJS.gameScene = new TileZeroJS.GameSceneC();
	
		// [SC] creating a new scene (e.g. menu scene, gameplay scene, end game scene)
		// [SC] gameScene class is defined in gamescrip.js
		cc.director.runScene(TileZeroJS.gameScene);
	}
		
	cc.game.run("gameCanvas");
};