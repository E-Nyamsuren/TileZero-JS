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

var TileZeroTS;
(function (TileZeroTS) {
    var TileZeroTile = /** @class */ (function () {
        ////// END: fields and properties
        /////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        function TileZeroTile(p_colorIndex, p_shapeIndex, p_tileID) {
            this.colorIndex = p_colorIndex;
            this.shapeIndex = p_shapeIndex;
            this.tileID = p_tileID;
            this.resetTile();
        }
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods
        TileZeroTile.prototype.getColorIndex = function () {
            return this.colorIndex;
        };
        TileZeroTile.prototype.getShapeIndex = function () {
            return this.shapeIndex;
        };
        TileZeroTile.prototype.getTileID = function () {
            return this.tileID;
        };
        // [SC] returns true if this tile has the same color and shape as another tile 
        TileZeroTile.prototype.sameVisTile = function (p_tile) {
            if (this.colorIndex === p_tile.getColorIndex() && this.shapeIndex === p_tile.getShapeIndex()) {
                return true;
            }
            else {
                return false;
            }
        };
        TileZeroTile.prototype.sameTile = function (p_colorIndex, p_shapeIndex, p_tileID) {
            if (this.colorIndex === p_colorIndex && this.shapeIndex === p_shapeIndex && this.tileID == p_tileID) {
                return true;
            }
            else {
                return false;
            }
        };
        TileZeroTile.prototype.setPlayable = function (p_playableFlag) {
            this.playableFlag = p_playableFlag;
        };
        TileZeroTile.prototype.getPlayable = function () {
            return this.playableFlag;
        };
        TileZeroTile.prototype.setCanDrop = function (p_canDrop) {
            this.canDrop = p_canDrop;
        };
        TileZeroTile.prototype.getCanDrop = function () {
            return this.canDrop;
        };
        TileZeroTile.prototype.resetTile = function () {
            this.setPlayable(true);
            this.setCanDrop(true);
        };
        TileZeroTile.prototype.ToString = function () {
            return this.getColorIndex() + "" + this.getShapeIndex();
        };
        return TileZeroTile;
    }());
    TileZeroTS.TileZeroTile = TileZeroTile;
})(TileZeroTS || (TileZeroTS = {}));
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
/// <reference path="TileZeroTile.ts"/>
///
var TileZeroTS;
(function (TileZeroTS) {
    // [SC] abstract class to simulate a static class and prevent instantiation
    var Cfg = /** @class */ (function () {
        function Cfg() {
        }
        // [SC] returns a random integer between [0, maxValue)
        Cfg.getRandonInt = function (maxVal) {
            return Math.floor(Math.random() * Math.floor(maxVal));
        };
        Cfg.getTileFeatureID = function (colorIndex, shapeIndex) {
            return colorIndex + "" + shapeIndex;
        };
        Cfg.enableLog = function (flag) {
            Cfg.logEnableFlag = flag;
        };
        Cfg.clearLog = function () {
            Cfg.logStr = "";
        };
        Cfg.log = function (str) {
            if (Cfg.logEnableFlag) {
                Cfg.logStr += "\n" + str;
            }
        };
        Cfg.getLog = function () {
            return Cfg.logStr;
        };
        // Fisher-Yates shuffle
        Cfg.Shuffle = function (list) {
            var n = list.length;
            while (n > 1) {
                n--;
                var k = Cfg.getRandonInt(n + 1);
                var value = list[k];
                list[k] = list[n];
                list[n] = value;
            }
        };
        // [SC] pop operation on an array
        Cfg.Pop = function (list, index) {
            if (list.length > index && index >= 0) {
                return list.splice(index, 1)[0];
            }
            return null;
        };
        // [SC] get a random element from a list
        Cfg.getRandomElement = function (list) {
            var n = list.length;
            if (n == 1) {
                return list[0];
            }
            else if (n > 1) {
                return list[Cfg.getRandonInt(n)];
            }
            return null;
        };
        // [SC] do list shallow cloning
        Cfg.listShallowClone = function (list) {
            var cloneList = new Array();
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var listItem = list_1[_i];
                cloneList.push(listItem);
            }
            return cloneList;
        };
        // [SC] create a shallow clone of the 2D array
        Cfg.createBoardCopy = function (tileArray) {
            if (tileArray == null) {
                return null;
            }
            var newTileArray = [];
            for (var currRowIndex = 0; currRowIndex < tileArray.length; currRowIndex++) {
                newTileArray[currRowIndex] = [];
                for (var currColIndex = 0; currColIndex < tileArray[currRowIndex].length; currColIndex++) {
                    newTileArray[currRowIndex][currColIndex] = tileArray[currRowIndex][currColIndex];
                }
            }
            return newTileArray;
        };
        // [SC] human player name
        Cfg.HUMAN_PLAYER = "human";
        // [SC] ai player name
        Cfg.AI_PLAYER = "ai";
        Cfg.ACTION_DELAY = 50;
        Cfg.BOARD_COL_COUNT = 15;
        Cfg.BOARD_ROW_COUNT = 15;
        Cfg.NONE = -1;
        Cfg.COLOR_ATTR = 1;
        Cfg.SHAPE_ATTR = 2;
        Cfg.MAX_VAL_INDEX = 6; // [SC] the the numeric id for color and shape features ranges from 0 to 5
        Cfg.MAX_TILE_ID = 3; // [SC] there can be three tiles of the same color:shape combination
        Cfg.MAX_BAG_SIZE = Cfg.MAX_VAL_INDEX * Cfg.MAX_VAL_INDEX * Cfg.MAX_TILE_ID;
        Cfg.MAX_PLAYER_TILE_COUNT = 6;
        Cfg.START_TILE_COUNT = 3;
        Cfg.HORIZONTAL = 1;
        Cfg.VERTICAL = 2;
        Cfg.TURN_DURATION = 10000;
        Cfg.LAST_PLAYER_REWARD = 6;
        Cfg.MAX_SEQ_SCORE = 6;
        Cfg.TILEZERO_REWARD = Cfg.MAX_SEQ_SCORE * 2;
        Cfg.VERY_EASY_AI = "Very Easy AI";
        Cfg.EASY_AI = "Easy AI";
        Cfg.MEDIUM_COLOR_AI = "Medium Color AI";
        Cfg.MEDIUM_SHAPE_AI = "Medium Shape AI";
        Cfg.HARD_AI = "Hard AI";
        Cfg.VERY_HARD_AI = "Very Hard AI";
        Cfg.logStr = "";
        Cfg.logEnableFlag = true;
        return Cfg;
    }());
    TileZeroTS.Cfg = Cfg;
})(TileZeroTS || (TileZeroTS = {}));
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
/// <reference path="TileZeroTile.ts"/>
///
var TileZeroTS;
(function (TileZeroTS) {
    /*export class AbstractTile
    {
        /////////////////////////////////////////////////////////////////
        ////// START: fields

        public colorIndex: number;
        public shapeIndex: number;
        public tileID: number;
        public playableFlag: boolean;

        ////// END: fields
        /////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////
        ////// START: constructors

        constructor(p_colorIndex: number, p_shapeIndex: number, p_tileID: number, p_playableFlag: boolean) {
            this.colorIndex = p_colorIndex;
            this.shapeIndex = p_shapeIndex;
            this.tileID = p_tileID;
            this.playableFlag = p_playableFlag;
        }

        ////// END: constructors
        /////////////////////////////////////////////////////////////////
    }*/
    // [SC] the same list of tiles can be placed on a board in different possible orders (tile sequences)
    // [SC] object of this class represents one possible sequence of tiles
    var CandidateTileSeq = /** @class */ (function () {
        ////// END: fields
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: constructors
        function CandidateTileSeq(p_attrValueIndex, p_attrIndex, p_tileSequence) {
            this.attrValueIndex = p_attrValueIndex;
            this.attrIndex = p_attrIndex;
            this.tileSequence = p_tileSequence;
            this.candTilePosList = new Array();
        }
        ////// END: constructors
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: methods
        CandidateTileSeq.prototype.getTileCount = function () {
            return this.tileSequence.length; // [SC][TODO] for now let it crash if tileSequence == null; but it should not happen
        };
        CandidateTileSeq.prototype.getTileAt = function (p_tileIndex) {
            return this.tileSequence[p_tileIndex];
        };
        CandidateTileSeq.prototype.addCandTilePos = function (p_candTilePos) {
            this.candTilePosList.push(p_candTilePos);
        };
        CandidateTileSeq.prototype.getPosComboList = function () {
            return this.candTilePosList;
        };
        CandidateTileSeq.prototype.isOrderedSubsetOf = function (p_cts) {
            if (this.getTileCount() > p_cts.getTileCount()) {
                return false;
            }
            else {
                for (var tileIndex = 0; tileIndex < this.getTileCount(); tileIndex++) {
                    if (!this.getTileAt(tileIndex).sameVisTile(p_cts.getTileAt(tileIndex))) {
                        return false;
                    }
                }
                return true;
            }
        };
        CandidateTileSeq.prototype.TileSeqToString = function () {
            var str = "(";
            for (var _i = 0, _a = this.tileSequence; _i < _a.length; _i++) {
                var tile = _a[_i];
                str += tile.ToString() + ",";
            }
            return str + ")";
        };
        return CandidateTileSeq;
    }());
    TileZeroTS.CandidateTileSeq = CandidateTileSeq;
    // [SC] the same sequence of tiles can be placed on board with different possible combinations of tile positions
    // [SC] object of this class represents one possible combination of tile positions
    var CandidateTilePos = /** @class */ (function () {
        ////// END: fields
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: constructors
        function CandidateTilePos(p_candTileSequence, p_posList, p_totalScore) {
            this.candTileSequence = p_candTileSequence;
            this.posList = p_posList;
            this.totalScore = p_totalScore;
            this.candTileSequence.addCandTilePos(this);
        }
        ////// end: constructors
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: methods
        CandidateTilePos.prototype.getTotalScore = function () {
            return this.totalScore;
        };
        CandidateTilePos.prototype.setTotalScore = function (p_totalScore) {
            this.totalScore = p_totalScore;
        };
        CandidateTilePos.prototype.getComboLength = function () {
            return this.posList.length;
        };
        CandidateTilePos.prototype.getAbstrPosAt = function (p_index) {
            //if (posList != null && posList.Count > index)
            return this.posList[p_index];
        };
        CandidateTilePos.prototype.getCandidateTileSeq = function () {
            return this.candTileSequence;
        };
        return CandidateTilePos;
    }());
    TileZeroTS.CandidateTilePos = CandidateTilePos;
    var AbstractPos = /** @class */ (function () {
        ////// END: fields
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: constructors
        function AbstractPos(p_tileIndex, p_rowIndex, p_colIndex, p_score) {
            this.tileIndex = p_tileIndex;
            this.rowIndex = p_rowIndex;
            this.colIndex = p_colIndex;
            this.score = p_score;
        }
        ////// end: constructors
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: methods
        AbstractPos.prototype.getScore = function () {
            return this.score;
        };
        AbstractPos.prototype.getTileIndex = function () {
            return this.tileIndex;
        };
        AbstractPos.prototype.getRowIndex = function () {
            return this.rowIndex;
        };
        AbstractPos.prototype.getColIndex = function () {
            return this.colIndex;
        };
        return AbstractPos;
    }());
    TileZeroTS.AbstractPos = AbstractPos;
    var TreeNode = /** @class */ (function () {
        ////// END: fields
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: constructors
        function TreeNode(p_value) {
            this.parentNode = null;
            this.childNodes = new Array();
            this.value = p_value;
        }
        ////// end: constructors
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: methods
        TreeNode.prototype.addChildeNode = function (p_childNode) {
            this.childNodes.push(p_childNode);
            p_childNode.setParentNode(this);
        };
        TreeNode.prototype.setParentNode = function (p_parentNode) {
            this.parentNode = p_parentNode;
        };
        TreeNode.prototype.addChildNodeValue = function (p_value) {
            var childNode = new TreeNode(p_value);
            this.addChildeNode(childNode);
            return childNode;
        };
        TreeNode.prototype.hasChildNodes = function () {
            if (typeof this.childNodes !== 'undefined' && this.childNodes instanceof Array && this.childNodes.length !== 0) {
                return true;
            }
            else {
                return false;
            }
        };
        TreeNode.prototype.getChildNodes = function () {
            return this.childNodes;
        };
        TreeNode.prototype.getValue = function () {
            return this.value;
        };
        return TreeNode;
    }());
    TileZeroTS.TreeNode = TreeNode;
})(TileZeroTS || (TileZeroTS = {}));
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
/// <reference path="Cfg.ts"/>
/// <reference path="Game.ts"/>
/// <reference path="TileZeroTile.ts"/>
///
var TileZeroTS;
(function (TileZeroTS) {
    var Cfg = TileZeroTS.Cfg;
    var VirtualBoard = /** @class */ (function () {
        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        function VirtualBoard(p_game) {
            this.game = p_game;
            this.resetBoard();
        }
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods
        VirtualBoard.prototype.resetBoard = function () {
            this.tileArray = [];
            for (var rowIndex = 0; rowIndex < VirtualBoard.rowCount; rowIndex++) {
                this.tileArray[rowIndex] = []; // [TODO] make sure that it is a row
                for (var colIndex = 0; colIndex < VirtualBoard.colCount; colIndex++) {
                    this.tileArray[rowIndex][colIndex] = null;
                }
            }
        };
        VirtualBoard.prototype.addTile = function (p_rowIndex, p_colIndex, p_tile, p_validCheck, p_tileArray) {
            if (p_tileArray === null) {
                p_tileArray = this.tileArray;
            }
            var result = this.isValidMove(p_rowIndex, p_colIndex, p_tile, p_validCheck, p_tileArray, true);
            if (result !== Cfg.NONE) {
                p_tileArray[p_rowIndex][p_colIndex] = p_tile;
            }
            return result;
        };
        VirtualBoard.prototype.getColCount = function () {
            return VirtualBoard.colCount;
        };
        VirtualBoard.prototype.getRowCount = function () {
            return VirtualBoard.rowCount;
        };
        // [SC] 2018.01.11
        VirtualBoard.prototype.getTileAt = function (p_rowIndex, p_colIndex) {
            if (this.tileArray === null) {
                return null;
            }
            return this.tileArray[p_rowIndex][p_colIndex];
        };
        // [SC] returns true if the indicated cell has a tile
        VirtualBoard.prototype.hasTile = function (p_rowIndex, p_colIndex, p_tileArray) {
            if (p_tileArray === null) {
                p_tileArray = this.tileArray; // [SC] 2018.01.11
            }
            if (p_tileArray[p_rowIndex][p_colIndex] !== null) {
                return true;
            }
            else {
                return false;
            }
        };
        // [SC] returns true if the left cell adjacent to the indicated cell has a tile
        VirtualBoard.prototype.hasLeftTile = function (p_rowIndex, p_colIndex, p_tileArray) {
            if (p_colIndex > 0 && p_tileArray[p_rowIndex][p_colIndex - 1] !== null) {
                return true;
            }
            else {
                return false;
            }
        };
        // [SC] returns true if the right cell adjacent to the indicated cell has a tile
        VirtualBoard.prototype.hasRightTile = function (p_rowIndex, p_colIndex, p_tileArray) {
            if (p_colIndex < (VirtualBoard.colCount - 1) && p_tileArray[p_rowIndex][p_colIndex + 1] !== null) {
                return true;
            }
            else {
                return false;
            }
        };
        // [SC] returns true if the top cell adjacent to the indicated cell has a tile
        VirtualBoard.prototype.hasTopTile = function (p_rowIndex, p_colIndex, p_tileArray) {
            if (p_rowIndex > 0 && p_tileArray[p_rowIndex - 1][p_colIndex] != null) {
                return true;
            }
            else {
                return false;
            }
        };
        // [SC] returns true if the bottom cell adjacent to the indicated cell has a tile
        VirtualBoard.prototype.hasBottomTile = function (p_rowIndex, p_colIndex, p_tileArray) {
            if (p_rowIndex < (VirtualBoard.rowCount - 1) && p_tileArray[p_rowIndex + 1][p_colIndex] != null) {
                return true;
            }
            else {
                return false;
            }
        };
        VirtualBoard.prototype.isValidMove = function (p_rowIndex, p_colIndex, p_tile, p_validCheck, p_tileArrayP, p_showMsg) {
            if (p_tileArrayP == null) {
                p_tileArrayP = this.tileArray;
            }
            var horizScore = 0;
            var vertScore = 0;
            if (p_rowIndex < 0 || p_rowIndex >= VirtualBoard.rowCount) {
                if (p_showMsg) {
                    Cfg.log("Invalid row index: " + p_rowIndex + ".");
                }
                return Cfg.NONE;
            }
            if (p_colIndex < 0 || p_colIndex >= VirtualBoard.colCount) {
                if (p_showMsg) {
                    Cfg.log("Invalid column index: " + p_colIndex + ".");
                }
                return Cfg.NONE;
            }
            if (this.hasTile(p_rowIndex, p_colIndex, p_tileArrayP)) {
                if (p_showMsg) {
                    Cfg.log("The cell already has a tile.");
                }
                return Cfg.NONE;
            }
            if (p_validCheck) {
                // [SC] check if there is any tile adjacent to the destinatio position
                if (!this.hasLeftTile(p_rowIndex, p_colIndex, p_tileArrayP) && !this.hasRightTile(p_rowIndex, p_colIndex, p_tileArrayP)
                    && !this.hasBottomTile(p_rowIndex, p_colIndex, p_tileArrayP) && !this.hasTopTile(p_rowIndex, p_colIndex, p_tileArrayP)) {
                    if (p_showMsg) {
                        Cfg.log("A new tile should be placed next to the existing one.");
                    }
                    return Cfg.NONE;
                }
                // [SC] temporarily put the tile
                p_tileArrayP[p_rowIndex][p_colIndex] = p_tile;
                // [SC] check validity of the horizontal sequence of tiles
                if (this.hasLeftTile(p_rowIndex, p_colIndex, p_tileArrayP) || this.hasRightTile(p_rowIndex, p_colIndex, p_tileArrayP)) {
                    horizScore = this.isValidSequence(p_rowIndex, p_colIndex, Cfg.HORIZONTAL, p_tileArrayP, p_showMsg);
                    if (horizScore == Cfg.NONE) {
                        p_tileArrayP[p_rowIndex][p_colIndex] = null;
                        return Cfg.NONE;
                    }
                    else if (horizScore == Cfg.MAX_SEQ_SCORE) {
                        // [SC] reward for completing a TileZero
                        horizScore = Cfg.TILEZERO_REWARD;
                    }
                }
                // [SC] check validity of the vertical sequence of tiles
                if (this.hasTopTile(p_rowIndex, p_colIndex, p_tileArrayP) || this.hasBottomTile(p_rowIndex, p_colIndex, p_tileArrayP)) {
                    vertScore = this.isValidSequence(p_rowIndex, p_colIndex, Cfg.VERTICAL, p_tileArrayP, p_showMsg);
                    if (vertScore == Cfg.NONE) {
                        p_tileArrayP[p_rowIndex][p_colIndex] = null;
                        return Cfg.NONE;
                    }
                    else if (vertScore == Cfg.MAX_SEQ_SCORE) {
                        // [SC] reward for completing a TileZero
                        vertScore = Cfg.TILEZERO_REWARD;
                    }
                }
                // [SC] remove the temporary tile
                p_tileArrayP[p_rowIndex][p_colIndex] = null;
            }
            return horizScore + vertScore;
        };
        VirtualBoard.prototype.isValidSequence = function (p_rowIndex, p_colIndex, p_orientation, p_tileArrayP, p_showMsg) {
            var uniqueColors = [Cfg.MAX_VAL_INDEX];
            var uniqueColorCount = 0;
            var uniqueShapes = [Cfg.MAX_VAL_INDEX];
            var uniqueShapeCount = 0;
            var sequenceLength = 0;
            var currRow = p_rowIndex;
            var currCol = p_colIndex;
            for (var currIndex = 0; currIndex < Cfg.MAX_VAL_INDEX; currIndex++) {
                uniqueColors[currIndex] = Cfg.NONE;
                uniqueShapes[currIndex] = Cfg.NONE;
            }
            // [SC] start with the left-most or top-most tile in the sequence
            if (p_orientation === Cfg.HORIZONTAL) {
                while (currCol > 0 && p_tileArrayP[currRow][currCol - 1] != null) {
                    currCol--;
                }
            }
            else {
                while (currRow > 0 && p_tileArrayP[currRow - 1][currCol] != null) {
                    currRow--;
                }
            }
            // [SC] checking the validity of colors and shapes, and color-shape combination of the sequence
            while (currRow < VirtualBoard.rowCount && currCol < VirtualBoard.colCount) {
                var currTile = p_tileArrayP[currRow][currCol];
                if (currTile === null) {
                    break;
                }
                // [SC] checking the validity of colors
                var currColorIndex = currTile.getColorIndex();
                if (uniqueColors[currColorIndex] === Cfg.NONE) {
                    uniqueColors[currColorIndex] = currColorIndex;
                    uniqueColorCount++;
                }
                else if (uniqueColorCount === 1) {
                }
                else {
                    if (p_showMsg) {
                        Cfg.log("Invalid color sequence.");
                    }
                    return Cfg.NONE;
                }
                // [SC] checking the validity of shapes
                var currShapeIndex = currTile.getShapeIndex();
                if (uniqueShapes[currShapeIndex] === Cfg.NONE) {
                    uniqueShapes[currShapeIndex] = currShapeIndex;
                    uniqueShapeCount++;
                }
                else if (uniqueShapeCount === 1) {
                }
                else {
                    if (p_showMsg)
                        Cfg.log("Invalid shape sequence.");
                    return Cfg.NONE;
                }
                sequenceLength++;
                if (sequenceLength > 1) {
                    if ((uniqueColorCount == 1 && uniqueShapeCount == 1) || // [SC] both shape and color are same
                        (uniqueColorCount > 1 && uniqueShapeCount > 1) // both shape and color are different
                    ) {
                        if (p_showMsg)
                            Cfg.log("Invalid combination of color and shape.");
                        return Cfg.NONE;
                    }
                }
                // [TODO] update row
                if (p_orientation == Cfg.HORIZONTAL)
                    currCol++;
                else
                    currRow++;
            }
            return sequenceLength;
        };
        VirtualBoard.prototype.getBoardCopy = function () {
            return Cfg.createBoardCopy(this.tileArray);
        };
        VirtualBoard.prototype.ToString = function () {
            var boardStr = "";
            var indexRow = "   ";
            var brRow = "   ";
            for (var colIndex = 0; colIndex < VirtualBoard.colCount; colIndex++) {
                if (colIndex < 10) {
                    indexRow += "0" + colIndex + " ";
                }
                else {
                    indexRow += colIndex + " ";
                }
                brRow += "---";
            }
            boardStr += indexRow + "\n";
            boardStr += brRow + "\n";
            for (var rowIndex = 0; rowIndex < VirtualBoard.rowCount; rowIndex++) {
                var rowStr = "";
                if (rowIndex < 10) {
                    rowStr += "0" + rowIndex + "|";
                }
                else {
                    rowStr += rowIndex + "|";
                }
                for (var colIndex = 0; colIndex < VirtualBoard.colCount; colIndex++) {
                    var tile = this.tileArray[rowIndex][colIndex];
                    if (tile === null) {
                        rowStr += "-- ";
                    }
                    else {
                        rowStr += tile.ToString() + " ";
                    }
                }
                boardStr += rowStr + "\n";
            }
            return boardStr;
        };
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constants
        VirtualBoard.rowCount = Cfg.BOARD_ROW_COUNT;
        VirtualBoard.colCount = Cfg.BOARD_COL_COUNT;
        return VirtualBoard;
    }());
    TileZeroTS.VirtualBoard = VirtualBoard;
})(TileZeroTS || (TileZeroTS = {}));
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
/// <reference path="Cfg.ts"/>
/// <reference path="TileZeroTile.ts"/>
/// <reference path="Game.ts"/>
/// <reference path="DataStructure.ts"/>
/// <reference path="VirtualBoard.ts"/>
///
var TileZeroTS;
(function (TileZeroTS) {
    var Cfg = TileZeroTS.Cfg;
    var CandidateTileSeq = TileZeroTS.CandidateTileSeq;
    var CandidateTilePos = TileZeroTS.CandidateTilePos;
    var AbstractPos = TileZeroTS.AbstractPos;
    var TreeNode = TileZeroTS.TreeNode;
    var Player = /** @class */ (function () {
        ////// END: fields and properties
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: constructors
        function Player(p_playerIndex, p_game, p_isHuman) {
            this.selectedPosCombo = null; // [SC] 2018.01.11
            this.playerType = Cfg.VERY_HARD_AI;
            this.game = p_game;
            this.isHuman = p_isHuman;
            this.playerIndex = p_playerIndex;
            this.playerTiles = new Array();
            this.resetGameVars();
        }
        Object.defineProperty(Player.prototype, "PlayerIndex", {
            get: function () {
                return this.playerIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "PlayerType", {
            get: function () {
                return this.playerType;
            },
            set: function (playerType) {
                if (playerType === Cfg.VERY_EASY_AI
                    || playerType === Cfg.EASY_AI
                    || playerType === Cfg.MEDIUM_COLOR_AI
                    || playerType === Cfg.MEDIUM_SHAPE_AI
                    || playerType === Cfg.HARD_AI
                    || playerType === Cfg.VERY_HARD_AI) {
                    this.playerType = playerType;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "WinFlag", {
            get: function () {
                return this.winFlag;
            },
            set: function (p_winFlag) {
                this.winFlag = p_winFlag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "IsHuman", {
            get: function () {
                return this.isHuman;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "PlayerName", {
            get: function () {
                if (this.IsHuman) {
                    return Cfg.HUMAN_PLAYER;
                }
                else {
                    return Cfg.AI_PLAYER;
                }
            },
            enumerable: true,
            configurable: true
        });
        ////// END: constructors
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: init and reset methods
        Player.prototype.resetGameVars = function () {
            this.resetTurnVars();
            this.playerScore = 0;
            this.WinFlag = false;
        };
        Player.prototype.resetTurnVars = function () {
            this.resetSelected();
            this.resetColorReq();
            this.resetShapeReq();
            this.resetTiles();
            this.canDropFlag = true;
            this.canMoveFlag = true;
        };
        ////// END: init and reset methods
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: generic functions for manipulating tiles
        Player.prototype.addTile = function (p_tile) {
            if (this.getPlayerTileCount() < Cfg.MAX_PLAYER_TILE_COUNT) {
                this.playerTiles.push(p_tile);
                return true;
            }
            return false;
        };
        Player.prototype.removeTile = function (p_tile) {
            var index = this.playerTiles.indexOf(p_tile, 0);
            this.playerTiles.splice(index, 1);
        };
        Player.prototype.getTileAt = function (p_index) {
            if (p_index < this.playerTiles.length) {
                return this.playerTiles[p_index];
            }
            else {
                return null;
            }
        };
        Player.prototype.getPlayerTileCount = function () {
            if (typeof this.playerTiles !== 'undefined' && this.playerTiles instanceof Array) {
                return this.playerTiles.length;
            }
            else {
                return 0;
            }
        };
        ////// END: generic functions for manipulating tiles
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: functions for manipulating a selected tile
        Player.prototype.setSelectedTileObj = function (p_tile) {
            // [TODO] make sure the tile is one of the player's tiles
            if (!p_tile.getPlayable()) {
                Cfg.log("The tile {" + p_tile.getColorIndex() + "}{" + p_tile.getShapeIndex() + "} is not playable.");
            }
            else {
                this.selectedTile = p_tile;
                return true;
            }
            return false;
        };
        Player.prototype.setSelectedTile = function (p_colorIndex, p_shapeIndex, p_tileID) {
            this.resetSelected();
            for (var _i = 0, _a = this.playerTiles; _i < _a.length; _i++) {
                var tile = _a[_i];
                if (tile.sameTile(p_colorIndex, p_shapeIndex, p_tileID) && tile.getPlayable()) {
                    return this.setSelectedTileObj(tile);
                }
            }
            return false;
        };
        Player.prototype.resetSelected = function () {
            this.selectedTile = null;
        };
        Player.prototype.isTileSelected = function () {
            if (typeof this.selectedTile === 'undefined' || this.selectedTile === null) {
                return false;
            }
            else {
                return true;
            }
        };
        Player.prototype.getSelectedTile = function () {
            return this.selectedTile;
        };
        Player.prototype.removeSelectedTile = function () {
            this.removeTile(this.selectedTile);
            this.resetSelected();
        };
        ////// END: functions for manipulating a selected tile
        /////////////////////////////////////////////////////////////////
        Player.prototype.disableMismatchedTiles = function (p_colorIndex, p_shapeIndex) {
            if (!this.hasColorReq() && !this.hasShapeReq()) {
                this.setColorReq(p_colorIndex);
                this.setShapeReq(p_shapeIndex);
            }
            else if (this.hasColorReq() && this.hasShapeReq()) {
                if (this.sameColorReq(p_colorIndex) && !this.sameShapeReq(p_shapeIndex)) {
                    this.resetShapeReq();
                }
                else if (!this.sameColorReq(p_colorIndex) && this.sameShapeReq(p_shapeIndex)) {
                    this.resetColorReq();
                }
            }
            if (this.hasColorReq() && this.hasShapeReq()) {
                for (var currTileIndex = 0; currTileIndex < this.playerTiles.length; currTileIndex++) {
                    var tile = this.playerTiles[currTileIndex];
                    if (!this.sameColorReq(tile.getColorIndex()) && !this.sameShapeReq(tile.getShapeIndex())) {
                        tile.setPlayable(false);
                    }
                }
            }
            else if (this.hasColorReq() && !this.hasShapeReq()) {
                for (var currTileIndex = 0; currTileIndex < this.playerTiles.length; currTileIndex++) {
                    var tile = this.playerTiles[currTileIndex];
                    if (!this.sameColorReq(tile.getColorIndex())) {
                        tile.setPlayable(false);
                    }
                }
            }
            else if (!this.hasColorReq() && this.hasShapeReq()) {
                for (var currTileIndex = 0; currTileIndex < this.playerTiles.length; currTileIndex++) {
                    var tile = this.playerTiles[currTileIndex];
                    if (!this.sameShapeReq(tile.getShapeIndex())) {
                        tile.setPlayable(false);
                    }
                }
            }
        };
        Player.prototype.resetTiles = function () {
            for (var currTileIndex = 0; currTileIndex < this.playerTiles.length; currTileIndex++) {
                this.playerTiles[currTileIndex].resetTile();
            }
        };
        Player.prototype.getPlayerScore = function () {
            return this.playerScore;
        };
        Player.prototype.increaseScore = function (p_score) {
            this.playerScore += p_score;
        };
        Player.prototype.getPlayerIndex = function () {
            return this.playerIndex;
        };
        Player.prototype.PlayerTilesToString = function () {
            var tilesStr = "{";
            for (var _i = 0, _a = this.playerTiles; _i < _a.length; _i++) {
                var tile = _a[_i];
                tilesStr += tile.ToString() + ",";
            }
            return tilesStr + "}";
        };
        /////////////////////////////////////////////////////////////////
        ////// START: can move and can drop flags
        Player.prototype.setCanDrop = function (p_canDropFlag) {
            this.canDropFlag = p_canDropFlag;
        };
        Player.prototype.getCanDrop = function () {
            return this.canDropFlag;
        };
        Player.prototype.setCanMove = function (p_canMoveFlag) {
            this.canMoveFlag = p_canMoveFlag;
        };
        Player.prototype.getCanMove = function () {
            return this.canMoveFlag;
        };
        ////// END: can move and can drop flags
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: functions for color requirements
        Player.prototype.getColorReq = function () {
            return this.colorReq;
        };
        Player.prototype.setColorReq = function (p_colorIndex) {
            this.colorReq = p_colorIndex;
        };
        Player.prototype.hasColorReq = function () {
            if (this.colorReq != Cfg.NONE) {
                return true;
            }
            else {
                return false;
            }
        };
        Player.prototype.sameColorReq = function (p_colorIndex) {
            if (this.colorReq == p_colorIndex) {
                return true;
            }
            else {
                return false;
            }
        };
        Player.prototype.resetColorReq = function () {
            this.colorReq = Cfg.NONE;
        };
        ////// END: functions for color requirements
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: functions for shape requirements
        Player.prototype.getShapeReq = function () {
            return this.shapeReq;
        };
        Player.prototype.setShapeReq = function (p_shapeIndex) {
            this.shapeReq = p_shapeIndex;
        };
        Player.prototype.hasShapeReq = function () {
            if (this.shapeReq != Cfg.NONE) {
                return true;
            }
            else {
                return false;
            }
        };
        Player.prototype.sameShapeReq = function (p_shapeIndex) {
            if (this.shapeReq == p_shapeIndex) {
                return true;
            }
            else {
                return false;
            }
        };
        Player.prototype.resetShapeReq = function () {
            this.shapeReq = Cfg.NONE;
        };
        ////// END: functions for shape requirements
        /////////////////////////////////////////////////////////////////
        // [SC] 2018.01.11 return true if all action performed
        Player.prototype.invokeAI = function () {
            if (this.playerType === Cfg.VERY_EASY_AI) {
                return this.invokeVeryEasyAI();
            }
            else if (this.playerType === Cfg.EASY_AI) {
                return this.invokeEasyAI();
            }
            else if (this.playerType === Cfg.MEDIUM_COLOR_AI) {
                return this.invokeColorOnlyMediumAI();
            }
            else if (this.playerType === Cfg.MEDIUM_SHAPE_AI) {
                return this.invokeShapeOnlyMediumAI();
            }
            else if (this.playerType === Cfg.HARD_AI) {
                return this.invokeHardAI();
            }
            else if (this.playerType === Cfg.VERY_HARD_AI) {
                return this.invokeVeryHardAI();
            }
            return true;
        };
        /////////////////////////////////////////////////////////////////
        ////// START: very easy ai functionality
        // [SC] puts only a single tile on a board
        Player.prototype.invokeVeryEasyAI = function () {
            var virtualBoard = this.game.getVirtualBoard();
            var rowCount = virtualBoard.getRowCount();
            var colCount = virtualBoard.getColCount();
            // [SC] using copy since indices in playerTiles may change due to removed tiles
            var tempPlayerTiles = Cfg.listShallowClone(this.playerTiles);
            var tilePlacedFlag = false;
            var shouldDropFlag = true;
            for (var _i = 0, tempPlayerTiles_1 = tempPlayerTiles; _i < tempPlayerTiles_1.length; _i++) {
                var tile = tempPlayerTiles_1[_i];
                // [SC] check if the tile is playable
                if (!tile.getPlayable()) {
                    continue;
                }
                for (var currRowIndex = 0; currRowIndex < rowCount && !tilePlacedFlag; currRowIndex++) {
                    for (var currColIndex = 0; currColIndex < colCount; currColIndex++) {
                        var resultScore = virtualBoard.isValidMove(currRowIndex, currColIndex, tile, true, null, false);
                        if (resultScore != Cfg.NONE) {
                            this.game.setSelectedTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), this.PlayerIndex);
                            this.game.setSelectedCell(currRowIndex, currColIndex, this.playerIndex);
                            this.game.placePlayerTileOnBoard(this.playerIndex);
                            tilePlacedFlag = true;
                            shouldDropFlag = false;
                            break;
                        }
                    }
                }
                if (tilePlacedFlag)
                    break;
            }
            if (shouldDropFlag) {
                // [SC] dropping a random tile
                var tile = Cfg.getRandomElement(this.playerTiles);
                this.game.setSelectedTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), this.PlayerIndex);
                this.game.dropPlayerTile(this.playerIndex);
            }
            return true;
        };
        ////// END: very easy ai functionality
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: easy ai functionality
        Player.prototype.invokeEasyAI = function () {
            var virtualBoard = this.game.getVirtualBoard();
            var rowCount = virtualBoard.getRowCount();
            var colCount = virtualBoard.getColCount();
            // [SC] using copy since indices in playerTiles may change due to removed tiles
            var tempPlayerTiles = Cfg.listShallowClone(this.playerTiles);
            for (var _i = 0, tempPlayerTiles_2 = tempPlayerTiles; _i < tempPlayerTiles_2.length; _i++) {
                var tile = tempPlayerTiles_2[_i];
                // [SC] check if the tile is playable
                if (!tile.getPlayable()) {
                    continue;
                }
                for (var currRowIndex = 0; currRowIndex < rowCount; currRowIndex++) {
                    for (var currColIndex = 0; currColIndex < colCount; currColIndex++) {
                        var resultScore = virtualBoard.isValidMove(currRowIndex, currColIndex, tile, true, null, false);
                        if (resultScore !== Cfg.NONE) {
                            this.game.setSelectedTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), this.PlayerIndex);
                            this.game.setSelectedCell(currRowIndex, currColIndex, this.playerIndex);
                            this.game.placePlayerTileOnBoard(this.playerIndex);
                            return false;
                        }
                    }
                }
            }
            if (tempPlayerTiles.length == Cfg.MAX_PLAYER_TILE_COUNT) {
                // [SC] dropping a random tile
                var tile = Cfg.getRandomElement(this.playerTiles);
                this.game.setSelectedTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), this.PlayerIndex);
                this.game.dropPlayerTile(this.playerIndex);
            }
            return true;
        };
        ////// END: easy ai functionality
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: medium ai functionality - color only
        Player.prototype.invokeColorOnlyMediumAI = function () {
            if (this.selectedPosCombo === null) {
                this.selectedPosCombo = this.calculateMoves(true, false, false);
                this.currMoveCount = 0;
                if (this.selectedPosCombo === null) {
                    // [SC] dropping a random tile
                    var tile = Cfg.getRandomElement(this.playerTiles);
                    this.game.setSelectedTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), this.PlayerIndex);
                    this.game.dropPlayerTile(this.playerIndex);
                    return true;
                }
            }
            if (this.getCanMove()) {
                var tileSeq = this.selectedPosCombo.getCandidateTileSeq();
                var totalMoveCount = this.selectedPosCombo.getComboLength();
                if (this.currMoveCount < totalMoveCount) {
                    var abstrPos = this.selectedPosCombo.getAbstrPosAt(this.currMoveCount);
                    var rowIndex = abstrPos.getRowIndex();
                    var colIndex = abstrPos.getColIndex();
                    var tileIndex = abstrPos.getTileIndex();
                    var tile = tileSeq.getTileAt(tileIndex);
                    this.game.setSelectedTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), this.PlayerIndex);
                    this.game.setSelectedCell(rowIndex, colIndex, this.playerIndex);
                    this.game.placePlayerTileOnBoard(this.playerIndex);
                    this.currMoveCount++;
                    return false;
                }
                else {
                    this.selectedPosCombo = null;
                    return true;
                }
            }
            else {
                this.selectedPosCombo = null;
                return true;
            }
        };
        ////// END: medium ai functionality - color only
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: medium ai functionality - shape only
        Player.prototype.invokeShapeOnlyMediumAI = function () {
            if (this.selectedPosCombo === null) {
                this.selectedPosCombo = this.calculateMoves(false, true, false);
                this.currMoveCount = 0;
                if (this.selectedPosCombo === null) {
                    // [SC] dropping a random tile
                    var tile = Cfg.getRandomElement(this.playerTiles);
                    this.game.setSelectedTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), this.PlayerIndex);
                    this.game.dropPlayerTile(this.playerIndex);
                    return true;
                }
            }
            if (this.getCanMove()) {
                var tileSeq = this.selectedPosCombo.getCandidateTileSeq();
                var totalMoveCount = this.selectedPosCombo.getComboLength();
                if (this.currMoveCount < totalMoveCount) {
                    var abstrPos = this.selectedPosCombo.getAbstrPosAt(this.currMoveCount);
                    var rowIndex = abstrPos.getRowIndex();
                    var colIndex = abstrPos.getColIndex();
                    var tileIndex = abstrPos.getTileIndex();
                    var tile = tileSeq.getTileAt(tileIndex);
                    this.game.setSelectedTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), this.PlayerIndex);
                    this.game.setSelectedCell(rowIndex, colIndex, this.playerIndex);
                    this.game.placePlayerTileOnBoard(this.playerIndex);
                    this.currMoveCount++;
                    return false;
                }
                else {
                    this.selectedPosCombo = null;
                    return true;
                }
            }
            else {
                this.selectedPosCombo = null;
                return true;
            }
        };
        ////// END: medium ai functionality - shape only
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: hard ai functionality
        Player.prototype.invokeHardAI = function () {
            if (this.selectedPosCombo === null) {
                this.selectedPosCombo = this.calculateMoves(true, true, true);
                this.currMoveCount = 0;
                if (this.selectedPosCombo === null) {
                    // [SC] dropping a random tile
                    var tile = Cfg.getRandomElement(this.playerTiles);
                    this.game.setSelectedTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), this.PlayerIndex);
                    this.game.dropPlayerTile(this.playerIndex);
                    return true;
                }
            }
            if (this.getCanMove()) {
                var tileSeq = this.selectedPosCombo.getCandidateTileSeq();
                var totalMoveCount = this.selectedPosCombo.getComboLength();
                if (this.currMoveCount < totalMoveCount) {
                    var abstrPos = this.selectedPosCombo.getAbstrPosAt(this.currMoveCount);
                    var rowIndex = abstrPos.getRowIndex();
                    var colIndex = abstrPos.getColIndex();
                    var tileIndex = abstrPos.getTileIndex();
                    var tile = tileSeq.getTileAt(tileIndex);
                    this.game.setSelectedTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), this.PlayerIndex);
                    this.game.setSelectedCell(rowIndex, colIndex, this.playerIndex);
                    this.game.placePlayerTileOnBoard(this.playerIndex);
                    this.currMoveCount++;
                    return false;
                }
                else {
                    this.selectedPosCombo = null;
                    return true;
                }
            }
            else {
                this.selectedPosCombo = null;
                return true;
            }
        };
        // [SC] gets the combo with the second highest score
        Player.prototype.boardPosPermTraverseTreePathsSuboptimal = function (rootNode, currPath, candTileSeq, currScore, chosenPosComboList, maxScorePosCombo) {
            if (rootNode.hasChildNodes()) {
                var childNodes = rootNode.getChildNodes();
                for (var _i = 0, childNodes_1 = childNodes; _i < childNodes_1.length; _i++) {
                    var childNode = childNodes_1[_i];
                    var newPath = Cfg.listShallowClone(currPath);
                    //let pos: AbstractPos = (AbstractPos) (childNode.getValue());
                    var pos = childNode.getValue(); // [TOODO][TS] typecasting maybe necessary
                    newPath.push(pos);
                    this.boardPosPermTraverseTreePathsSuboptimal(childNode, newPath, candTileSeq, currScore + pos.getScore(), chosenPosComboList, maxScorePosCombo);
                }
            }
            else {
                if (currScore > 0) {
                    var newCandTilePos = new CandidateTilePos(candTileSeq, currPath, currScore);
                    if (maxScorePosCombo.length === 0) {
                        maxScorePosCombo.push(newCandTilePos);
                        chosenPosComboList.length = 0;
                        chosenPosComboList.push(newCandTilePos);
                    }
                    else if (maxScorePosCombo[0].getTotalScore() == currScore) {
                        if (chosenPosComboList.length !== 0 && chosenPosComboList[0].getTotalScore() === currScore) {
                            chosenPosComboList.push(newCandTilePos);
                        }
                    }
                    else if (maxScorePosCombo[0].getTotalScore() < currScore) {
                        chosenPosComboList.length = 0;
                        chosenPosComboList.push(maxScorePosCombo[0]);
                        maxScorePosCombo.length = 0;
                        maxScorePosCombo.push(newCandTilePos);
                    }
                    else if (maxScorePosCombo[0].getTotalScore() > currScore) {
                        if (chosenPosComboList.length === 0) {
                            chosenPosComboList.push(newCandTilePos);
                        }
                        else if (chosenPosComboList[0].getTotalScore() === maxScorePosCombo[0].getTotalScore()) {
                            chosenPosComboList.length = 0;
                            chosenPosComboList.push(newCandTilePos);
                        }
                        else if (chosenPosComboList[0].getTotalScore() < currScore) {
                            chosenPosComboList.length = 0;
                            chosenPosComboList.push(newCandTilePos);
                        }
                        else if (chosenPosComboList[0].getTotalScore() === currScore) {
                            chosenPosComboList.push(newCandTilePos);
                        }
                    }
                }
            }
        };
        ////// END: hard ai functionality
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: very hard ai functionality
        Player.prototype.invokeVeryHardAI = function () {
            if (this.selectedPosCombo === null) {
                this.selectedPosCombo = this.calculateMoves(true, true, false);
                this.currMoveCount = 0;
                if (this.selectedPosCombo === null) {
                    // [SC] dropping a random tile
                    var tile = Cfg.getRandomElement(this.playerTiles);
                    this.game.setSelectedTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), this.PlayerIndex);
                    this.game.dropPlayerTile(this.playerIndex);
                    return true;
                }
            }
            if (this.getCanMove()) {
                var tileSeq = this.selectedPosCombo.getCandidateTileSeq();
                var totalMoveCount = this.selectedPosCombo.getComboLength();
                if (this.currMoveCount < totalMoveCount) {
                    var abstrPos = this.selectedPosCombo.getAbstrPosAt(this.currMoveCount);
                    var rowIndex = abstrPos.getRowIndex();
                    var colIndex = abstrPos.getColIndex();
                    var tileIndex = abstrPos.getTileIndex();
                    var tile = tileSeq.getTileAt(tileIndex);
                    this.game.setSelectedTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), this.PlayerIndex);
                    this.game.setSelectedCell(rowIndex, colIndex, this.playerIndex);
                    this.game.placePlayerTileOnBoard(this.playerIndex);
                    this.currMoveCount++;
                    return false;
                }
                else {
                    this.selectedPosCombo = null;
                    return true;
                }
            }
            else {
                this.selectedPosCombo = null;
                return true;
            }
        };
        // [SC] 1. Create lists of tiles where each list is a group of tiles with the same color or shape.
        // [SC] 2. For each group of tiles, create lists of tile sequences where each list contains a sequence of tiles in a unique order.
        // [SC] 3. For each tile sequence, create a combination of unique board positions.
        Player.prototype.calculateMoves = function (considerColor, considerShape, suboptiomal) {
            console.log("Control 1");
            var candTileSeqList = new Array(); // [TODO]
            //////////////////////////////////////////////////////////////////////////////
            // [2016.12.08] new code
            // [TODO][TS] make sure it works
            var colorTileLists = []; // [SC] each list contains player's tiles of the same color
            var shapeTileLists = []; // [SC] each list contains player's tiles of the same shape
            for (var index = 0; index < Cfg.MAX_VAL_INDEX; index++) {
                colorTileLists[index] = [];
                shapeTileLists[index] = [];
            }
            for (var _i = 0, _a = this.playerTiles; _i < _a.length; _i++) {
                var tile = _a[_i];
                colorTileLists[tile.getColorIndex()].push(tile);
                shapeTileLists[tile.getShapeIndex()].push(tile);
            }
            // [SC] remove empty tile combos // [TS]
            for (var remIndex = colorTileLists.length - 1; remIndex >= 0; remIndex--) {
                if (colorTileLists[remIndex].length == 0) {
                    colorTileLists.splice(remIndex, 1);
                }
                if (shapeTileLists[remIndex].length == 0) {
                    shapeTileLists.splice(remIndex, 1);
                }
            }
            // [SC] order by size of tile combos // [TS]
            colorTileLists = colorTileLists.sort(function (comboOne, comboTwo) {
                if (comboOne.length < comboTwo.length) {
                    return -1;
                }
                else if (comboOne.length > comboTwo.length) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            // [SC] order by size of tile combos // [TS]
            shapeTileLists = shapeTileLists.sort(function (comboOne, comboTwo) {
                if (comboOne.length < comboTwo.length) {
                    return -1;
                }
                else if (comboOne.length > comboTwo.length) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            if (considerColor) {
                // [SC] remove all color tile combos that are subsets of another color or shape combo
                for (var indexOne = 0; indexOne < colorTileLists.length; indexOne++) {
                    var tileComboOne = colorTileLists[indexOne];
                    var _loop_1 = function (indexTwo) {
                        var tileComboTwo = colorTileLists[indexTwo];
                        // [SC] true if combo one is a subset of combo two // [TS]
                        if (tileComboOne.every(function (tile) { return tileComboTwo.indexOf(tile) !== -1; })) {
                            tileComboOne.length = 0;
                            return "break";
                        }
                    };
                    for (var indexTwo = indexOne + 1; indexTwo < colorTileLists.length; indexTwo++) {
                        var state_1 = _loop_1(indexTwo);
                        if (state_1 === "break")
                            break;
                    }
                    if (tileComboOne.length === 0) {
                        continue;
                    }
                    if (considerShape) {
                        var _loop_2 = function (indexTwo) {
                            var tileComboTwo = shapeTileLists[indexTwo];
                            // [SC] true if combo one is a subset of combo two // [TS]
                            if (tileComboOne.length <= tileComboTwo.length
                                && tileComboOne.every(function (tile) { return tileComboTwo.indexOf(tile) !== -1; })) {
                                tileComboOne.length = 0;
                                return "break";
                            }
                        };
                        for (var indexTwo = 0; indexTwo < shapeTileLists.length; indexTwo++) {
                            var state_2 = _loop_2(indexTwo);
                            if (state_2 === "break")
                                break;
                        }
                    }
                }
                // [SC] remove empty tile combos // [TS]
                for (var remIndex = colorTileLists.length - 1; remIndex >= 0; remIndex--) {
                    if (colorTileLists[remIndex].length === 0) {
                        colorTileLists.splice(remIndex, 1);
                    }
                }
            }
            if (considerShape) {
                // [SC] remove all shape tile combos that are subsets of another color or shape combo
                for (var indexOne = 0; indexOne < shapeTileLists.length; indexOne++) {
                    var tileComboOne = shapeTileLists[indexOne];
                    var _loop_3 = function (indexTwo) {
                        var tileComboTwo = shapeTileLists[indexTwo];
                        // [SC] true if combo one is a subset of combo two // [TS]
                        if (tileComboOne.every(function (tile) { return tileComboTwo.indexOf(tile) !== -1; })) {
                            tileComboOne.length = 0;
                            return "break";
                        }
                    };
                    for (var indexTwo = indexOne + 1; indexTwo < shapeTileLists.length; indexTwo++) {
                        var state_3 = _loop_3(indexTwo);
                        if (state_3 === "break")
                            break;
                    }
                    if (tileComboOne.length === 0) {
                        continue;
                    }
                    if (considerColor) {
                        var _loop_4 = function (indexTwo) {
                            var tileComboTwo = colorTileLists[indexTwo];
                            // [SC] true if combo one is a subset of combo two // [TS]
                            if (tileComboOne.length <= tileComboTwo.length
                                && tileComboOne.every(function (tile) { return tileComboTwo.indexOf(tile) !== -1; })) {
                                tileComboOne.length = 0;
                                return "break";
                            }
                        };
                        for (var indexTwo = 0; indexTwo < colorTileLists.length; indexTwo++) {
                            var state_4 = _loop_4(indexTwo);
                            if (state_4 === "break")
                                break;
                        }
                    }
                }
                // [SC] remove empty tile combos // [TS]
                for (var remIndex = shapeTileLists.length - 1; remIndex >= 0; remIndex--) {
                    if (shapeTileLists[remIndex].length === 0) {
                        shapeTileLists.splice(remIndex, 1);
                    }
                }
            }
            //
            //////////////////////////////////////////////////////////////////////////////
            // [DELETE]
            /*for (let colorTileList of colorTileLists) {
                let tileListStr: string = "";
                for (let tile of colorTileList) {
                    tileListStr += tile.ToString() + ", ";
                }
                console.log("Color tile list: " + tileListStr);
            }
            // [DELETE]
            for (let shapeTileList of shapeTileLists) {
                let tileListStr: string = "";
                for (let tile of shapeTileList) {
                    tileListStr += tile.ToString() + ", ";
                }
                console.log("Shape tile list: " + tileListStr);
            }*/
            //////////////////////////////////////////////////////////////////////////////
            // [2016.12.08] new code
            if (considerColor) {
                // [SC] iterate through list of tiles with one particular color
                for (var _b = 0, colorTileLists_1 = colorTileLists; _b < colorTileLists_1.length; _b++) {
                    var tileList = colorTileLists_1[_b];
                    var colorIndex = tileList[0].getColorIndex();
                    var rootNode = new TreeNode(null);
                    for (var tileIndex = 0; tileIndex < tileList.length; tileIndex++) {
                        this.tileListPermAddChildNodes(tileList, tileIndex, rootNode);
                    }
                    this.tileListPermTraverseTreePaths(rootNode, new Array(), colorIndex, Cfg.COLOR_ATTR, candTileSeqList);
                }
            }
            if (considerShape) {
                // [SC] iterate through list of tiles with one particular shape
                for (var _c = 0, shapeTileLists_1 = shapeTileLists; _c < shapeTileLists_1.length; _c++) {
                    var tileList = shapeTileLists_1[_c];
                    var shapeIndex = tileList[0].getShapeIndex();
                    var rootNode = new TreeNode(null);
                    for (var tileIndex = 0; tileIndex < tileList.length; tileIndex++) {
                        this.tileListPermAddChildNodes(tileList, tileIndex, rootNode);
                    }
                    this.tileListPermTraverseTreePaths(rootNode, new Array(), shapeIndex, Cfg.SHAPE_ATTR, candTileSeqList);
                }
            }
            //
            //////////////////////////////////////////////////////////////////////////////
            // [DELETE]
            /*console.log("Printing cand tile seqs.");
            console.log("Count: " + candTileSeqList.length);
            for (let candTileSeq of candTileSeqList) {
                console.log("Candidate tile seq: " + candTileSeq.TileSeqToString());
            }*/
            //////////////////////////////////////////////////////////////////////////////
            // [2016.12.08] new code
            var maxCTS = 10;
            if (candTileSeqList.length > maxCTS) {
                // [TS] order by a descending order
                candTileSeqList = candTileSeqList.sort(function (valOne, valTwo) {
                    if (valOne.getTileCount() > valTwo.getTileCount()) {
                        return -1;
                    }
                    else if (valOne.getTileCount() < valTwo.getTileCount()) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                // [TS]
                candTileSeqList.splice(maxCTS, candTileSeqList.length - maxCTS);
            }
            //
            //////////////////////////////////////////////////////////////////////////////
            var virtualBoard = this.game.getVirtualBoard();
            var tileArray = virtualBoard.getBoardCopy();
            var chosenPosComboList = new Array();
            var maxScorePosComboList = new Array();
            for (var _d = 0, candTileSeqList_1 = candTileSeqList; _d < candTileSeqList_1.length; _d++) {
                var candTileSeq = candTileSeqList_1[_d];
                var rootNode = new TreeNode(null);
                this.boardPosPermAddChildNodes(candTileSeq, 0, rootNode, tileArray, virtualBoard);
                if (suboptiomal) {
                    this.boardPosPermTraverseTreePathsSuboptimal(rootNode, new Array(), candTileSeq, 0, chosenPosComboList, maxScorePosComboList);
                }
                else {
                    this.boardPosPermTraverseTreePaths(rootNode, new Array(), candTileSeq, 0, chosenPosComboList);
                }
            }
            return Cfg.getRandomElement(chosenPosComboList);
        };
        // [DELETE]
        /*private printTree(rootNode: TreeNode, level:  number): void {
            if (rootNode.hasChildNodes()) {
                let childNodes: TreeNode[] = rootNode.getChildNodes();

                let levelStr: string = "";
                for (let levelCounter: number = 0; levelCounter < level; levelCounter++) {
                    levelStr += "-";
                }

                for (let childNode of childNodes) {
                    console.log(levelStr + (childNode.getValue() as TileZeroTile).ToString());
                    this.printTree(childNode, level + 1);
                }
            }
        }*/
        /////////////////////////////////////////////////////////////////
        ////// START: A code for creating all possible permutations of board positions 
        ////// of tiles in given list, starting from left-most tile in the array
        Player.prototype.boardPosPermAddChildNodes = function (candTileSeq, currTileIndex, parentNode, tileArray, virtualBoard) {
            if (currTileIndex >= candTileSeq.getTileCount()) {
                return;
            }
            var tile = candTileSeq.getTileAt(currTileIndex);
            for (var currRowIndex = 0; currRowIndex < tileArray.length; currRowIndex++) {
                for (var currColIndex = 0; currColIndex < tileArray[currRowIndex].length; currColIndex++) {
                    var resultScore = virtualBoard.isValidMove(currRowIndex, currColIndex, tile, true, tileArray, false);
                    if (resultScore !== Cfg.NONE) {
                        var newTileArray = Cfg.createBoardCopy(tileArray);
                        virtualBoard.addTile(currRowIndex, currColIndex, tile, false, newTileArray);
                        var childNode = parentNode.addChildNodeValue(new AbstractPos(currTileIndex, currRowIndex, currColIndex, resultScore));
                        this.boardPosPermAddChildNodes(candTileSeq, currTileIndex + 1, childNode, newTileArray, virtualBoard);
                    }
                }
            }
            this.boardPosPermAddChildNodes(candTileSeq, currTileIndex + 1, parentNode, tileArray, virtualBoard); // [SC][2016.12.08] new code
        };
        Player.prototype.boardPosPermTraverseTreePaths = function (rootNode, currPath, candTileSeq, currScore, maxScorePosComboList) {
            if (rootNode.hasChildNodes()) {
                var childNodes = rootNode.getChildNodes();
                for (var _i = 0, childNodes_2 = childNodes; _i < childNodes_2.length; _i++) {
                    var childNode = childNodes_2[_i];
                    var newPath = Cfg.listShallowClone(currPath);
                    var pos = childNode.getValue();
                    newPath.push(pos);
                    this.boardPosPermTraverseTreePaths(childNode, newPath, candTileSeq, currScore + pos.getScore(), maxScorePosComboList);
                }
            }
            else {
                if (currScore > 0) {
                    var newCandTilePos = new CandidateTilePos(candTileSeq, currPath, currScore);
                    if (maxScorePosComboList.length === 0) {
                        maxScorePosComboList.push(newCandTilePos);
                    }
                    else if (maxScorePosComboList[0].getTotalScore() == currScore) {
                        maxScorePosComboList.push(newCandTilePos);
                    }
                    else if (maxScorePosComboList[0].getTotalScore() < currScore) {
                        maxScorePosComboList.length = 0;
                        maxScorePosComboList.push(newCandTilePos);
                    }
                }
            }
        };
        ////// END: A code for creating all possible permutations of board positions 
        ////// of tiles in given list, starting from left-most tile in the array
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: A code for creating all possible permutations of tiles in list
        Player.prototype.tileListPermAddChildNodes = function (tileList, childValIndex, rootNode) {
            var newList = Cfg.listShallowClone(tileList);
            var childNodeValue = newList.splice(childValIndex, 1)[0];
            var childNode = rootNode.addChildNodeValue(childNodeValue);
            for (var tileIndex = 0; tileIndex < newList.length; tileIndex++) {
                this.tileListPermAddChildNodes(newList, tileIndex, childNode);
            }
        };
        Player.prototype.tileListPermTraverseTreePaths = function (rootNode, currPath, attrValueIndex, attrIndex, candTileSeqList) {
            if (rootNode.hasChildNodes()) {
                var childNodes = rootNode.getChildNodes();
                for (var _i = 0, childNodes_3 = childNodes; _i < childNodes_3.length; _i++) {
                    var childNode = childNodes_3[_i];
                    var newPath = Cfg.listShallowClone(currPath);
                    newPath.push(childNode.getValue());
                    this.tileListPermTraverseTreePaths(childNode, newPath, attrValueIndex, attrIndex, candTileSeqList);
                }
            }
            else {
                //////////////////////////////////////////////////////////////////////////////
                // [2016.12.08] new code
                var newCts = new CandidateTileSeq(attrValueIndex, attrIndex, currPath);
                var cstToRemove = new Array();
                var addFlag = true;
                for (var _a = 0, candTileSeqList_2 = candTileSeqList; _a < candTileSeqList_2.length; _a++) {
                    var oldCts = candTileSeqList_2[_a];
                    // [SC] if true the new cts is a subset of existing cts
                    if (newCts.isOrderedSubsetOf(oldCts)) {
                        addFlag = false;
                        break;
                    }
                    else if (oldCts.isOrderedSubsetOf(newCts)) {
                        cstToRemove.push(oldCts);
                    }
                }
                // [TS]
                for (var index = candTileSeqList.length - 1; index >= 0; index--) {
                    if (cstToRemove.indexOf(candTileSeqList[index]) !== -1) {
                        candTileSeqList.splice(index, 1);
                    }
                }
                if (addFlag) {
                    candTileSeqList.push(newCts);
                }
                //
                //////////////////////////////////////////////////////////////////////////////
            }
        };
        return Player;
    }());
    TileZeroTS.Player = Player;
})(TileZeroTS || (TileZeroTS = {}));
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
/// <reference path="Cfg.ts"/>
/// <reference path="TileZeroTile.ts"/>
/// <reference path="VirtualBoard.ts"/>
/// <reference path="Player.ts"/>
/// <reference path="IAbstractUI.ts"/>
///
var TileZeroTS;
(function (TileZeroTS) {
    var Cfg = TileZeroTS.Cfg;
    var TileZeroTile = TileZeroTS.TileZeroTile;
    var VirtualBoard = TileZeroTS.VirtualBoard;
    var Player = TileZeroTS.Player;
    var Game = /** @class */ (function () {
        ////// END: fields and properties
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        ////// START: constructor
        function Game(p_abstractUI) {
            this.aiDelay = 200; // [SC] time delay in milliseconds
            this.pastAiTime = 0;
            this.abstractUI = p_abstractUI;
            this.virtualBoard = new VirtualBoard(this);
        }
        Object.defineProperty(Game.prototype, "HumanPlayer", {
            get: function () {
                return this.humanPlayer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "AiPlayer", {
            get: function () {
                return this.aiPlayer;
            },
            enumerable: true,
            configurable: true
        });
        ////// END: constructor
        /////////////////////////////////////////////////////////////////
        // [2016.12.01]
        Game.prototype.initNewGame = function (p_playableTileCount, p_startPlayerIndex) {
            var aiPlayerCount = 1;
            this.createTileBag();
            if (this.verifyPlayableTileCount(p_playableTileCount, aiPlayerCount)) {
                this.playableTileCount = p_playableTileCount;
            }
            else {
                this.playableTileCount = this.tileBag.length;
            }
            this.playedTileCount = 0;
            this.virtualBoard.resetBoard();
            this.createPlayers(); // [SC] should be called after 3 tiles were put on a board
            this.activePlayerIndex = p_startPlayerIndex;
            this.correctAnswer = 0;
            this.newGameInitFlag = true;
            this.activeGameFlag = false; // [TS]
        };
        // [2016.12.01]
        Game.prototype.startNewGame = function () {
            if (!this.newGameInitFlag) {
                return;
            }
            if (this.activeGameFlag) {
                return;
            }
            this.putStartingTiles();
            this.newGameInitFlag = false;
            this.activeGameFlag = true;
        };
        // [SC] returns false if the game ended
        Game.prototype.advanceGame = function (currentTime) {
            if (this.activeGameFlag) {
                var activePlayer = this.players[this.activePlayerIndex];
                if (!activePlayer.IsHuman && currentTime - this.pastAiTime >= this.aiDelay) {
                    if (activePlayer.invokeAI()) {
                        this.endTurn(this.activePlayerIndex);
                    }
                    this.pastAiTime = currentTime;
                }
            }
            return this.activeGameFlag;
        };
        // [2016.12.01]
        Game.prototype.endTurn = function (p_playerIndex) {
            if (!this.activeGameFlag) {
                Cfg.log("No active game.");
                return false;
            }
            if (p_playerIndex != this.activePlayerIndex) {
                Cfg.log("Not your turn!" + p_playerIndex);
                return false;
            }
            // [SC] reset board position
            this.resetSelected();
            var activePlayer = this.players[this.activePlayerIndex];
            // [SC] reset player's variables that are persistent only for a turn
            activePlayer.resetTurnVars();
            this.abstractUI.deselectTile(activePlayer.PlayerIndex);
            this.abstractUI.deselectCell(activePlayer.PlayerIndex);
            // [SC] refill player's tile array with new tiles from bag
            this.fillPlayerTiles(activePlayer);
            // [SC] if player has no tiles then end the game
            if (activePlayer.getPlayerTileCount() == 0) {
                this.endGame();
            }
            // [SC] make the next player in a queue as a current player
            if (++this.activePlayerIndex >= this.players.length) {
                this.activePlayerIndex = 0;
            }
            Cfg.log(this.getVirtualBoard().ToString());
            this.abstractUI.endTurn(activePlayer.PlayerIndex);
            return true;
        };
        // [2016.12.01]
        Game.prototype.endGame = function () {
            if (!this.activeGameFlag) {
                return;
            }
            var activePlayer = this.players[this.activePlayerIndex];
            activePlayer.increaseScore(Cfg.LAST_PLAYER_REWARD);
            var maxScore = Cfg.NONE;
            var maxScorePlayers = new Array();
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                var playerScore = player.getPlayerScore();
                if (maxScore === Cfg.NONE || maxScore === playerScore) {
                    maxScorePlayers.push(player);
                    maxScore = playerScore;
                }
                else if (maxScore < playerScore) {
                    maxScorePlayers.length = 0;
                    maxScorePlayers.push(player);
                    maxScore = playerScore;
                }
            }
            if (maxScorePlayers.length > 1) {
                Cfg.log("It is a draw!");
            }
            else {
                Cfg.log("Player " + maxScorePlayers[0].PlayerName + " won the game!");
                maxScorePlayers[0].WinFlag = true;
            }
            this.activeGameFlag = false;
            this.abstractUI.endGame();
        };
        Game.prototype.forceEndGame = function () {
            this.activeGameFlag = false;
            this.abstractUI.endGame();
        };
        // [2016.12.01]
        Game.prototype.createTileBag = function () {
            this.tileBag = new Array();
            for (var colorIndex = 0; colorIndex < Cfg.MAX_VAL_INDEX; colorIndex++) {
                for (var shapeIndex = 0; shapeIndex < Cfg.MAX_VAL_INDEX; shapeIndex++) {
                    for (var tileID = 0; tileID < Cfg.MAX_TILE_ID; tileID++) {
                        this.tileBag.push(new TileZeroTile(colorIndex, shapeIndex, tileID));
                    }
                }
            }
            Cfg.Shuffle(this.tileBag);
        };
        // [2016.12.01]
        Game.prototype.putStartingTiles = function () {
            var startCol = Math.floor(this.virtualBoard.getColCount() / 2 - Cfg.START_TILE_COUNT / 2);
            var startRow = Math.floor(this.virtualBoard.getRowCount() / 2);
            for (var counter = 0; counter < Cfg.START_TILE_COUNT; counter++) {
                var currCol = startCol + counter;
                var tile = this.tileBag[this.tileBag.length - 1];
                var result = this.putTileOnBoard(startRow, currCol, tile, false);
                // [TODO] need to terminate the game
                if (result == Cfg.NONE) {
                    Cfg.log("Error putting starting tiles");
                    break;
                }
                this.tileBag.pop();
                ++this.playedTileCount;
                this.abstractUI.putTileOnBoard(startRow, currCol, tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), -1);
            }
        };
        // [2016.12.01]
        // [SC] a function for dropping a tile
        Game.prototype.dropPlayerTile = function (p_playerIndex) {
            if (!this.activeGameFlag) {
                return false;
            }
            // [SC] check if this the player's turn
            if (p_playerIndex != this.activePlayerIndex) {
                Cfg.log("It is not your turn!");
                return false;
            }
            var activePlayer = this.players[this.activePlayerIndex];
            // [SC] check if player can drop tiles
            if (!activePlayer.getCanDrop()) {
                Cfg.log("Cannot drop a tile after putting a tile on a board!"); // [TODO]
                return false;
            }
            // [SC] check if bag has tiles
            if (this.tileBag.length === 0) {
                Cfg.log("Cannot drop a tile! The bag is empty."); // [TODO]
                return false;
            }
            // [SC] check if player tile is selected
            if (!activePlayer.isTileSelected()) {
                Cfg.log("Select a tile at first!"); // [TODO]
                return false;
            }
            // [SC] get the selected tile
            var tile = activePlayer.getSelectedTile();
            // [SC] make sure that the tile being dropped is not a replacement tile of previously dropped tile
            if (!tile.getCanDrop()) {
                Cfg.log("Cannot drop a replacement tile!");
                return false;
            }
            // [SC][TODO] need to make sure that a previously dropped tile does not get administered if multiple tiles were dropped per turn
            for (var tileIndex = 0; tileIndex < this.tileBag.length; tileIndex++) {
                // [SC] get a new tile from a bag
                var newTile = this.tileBag[tileIndex];
                // [SC] make sure that the new tile does not have the same features as the dropped tile
                if (newTile.getColorIndex() == tile.getColorIndex() && newTile.getShapeIndex() == tile.getShapeIndex()) {
                    continue;
                }
                Cfg.log("    Dropped tile " + tile.ToString() + ". Replaced with tile " + newTile.ToString() + ".");
                // [SC] remove the dropped tile from player's stack
                activePlayer.removeTile(tile);
                // [SC] add the dropped tile into the bag
                this.tileBag.push(tile);
                // [SC] remove the new tile from the bag 
                Cfg.Pop(this.tileBag, tileIndex);
                // [SC] add the new tile to player's stack
                activePlayer.addTile(newTile);
                // [SC] make sure that the new tile cannot be dropped in the same turn
                newTile.setCanDrop(false);
                // [SC] shuffle the bag
                Cfg.Shuffle(this.tileBag);
                // [SC] prevent the player from moving tiles into the board
                activePlayer.setCanMove(false);
                // [SC] remove any tile selection
                activePlayer.resetSelected();
                this.abstractUI.deselectTile(p_playerIndex);
                this.abstractUI.removePlayerTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), activePlayer.PlayerIndex);
                this.abstractUI.addPlayerTile(newTile.getColorIndex(), newTile.getShapeIndex(), newTile.getTileID(), activePlayer.PlayerIndex);
                return true;
            }
            return false;
        };
        // [2016.12.01]
        // [SC] place active player's tile on a board
        Game.prototype.placePlayerTileOnBoard = function (p_playerIndex) {
            if (!this.activeGameFlag) {
                return false;
            }
            if (p_playerIndex != this.activePlayerIndex) {
                Cfg.log("It is not your turn!");
                return false;
            }
            var activePlayer = this.players[this.activePlayerIndex];
            // [SC] check if player can put tiles on a board
            if (!activePlayer.getCanMove()) {
                Cfg.log("Cannot move a tile after dropping a tile!"); // [TODO]
                return false;
            }
            // [SC] check if board position is selected
            if (!this.isSelected()) {
                Cfg.log("Select a board position at first!"); // [TODO]
                return false;
            }
            // [SC] check if player tile is selected
            if (!activePlayer.isTileSelected()) {
                Cfg.log("Select a tile at first!"); // [TODO]
                return false;
            }
            var tile = activePlayer.getSelectedTile();
            var result = this.putTileOnBoard(this.selectedRowIndex, this.selectedColIndex, tile, true);
            if (result != Cfg.NONE) {
                Cfg.log("    Put tile " + tile.ToString() + " at position " + this.selectedRowIndex + "-"
                    + this.selectedColIndex + " for " + result + " points.");
                // [SC] increase player's score
                activePlayer.increaseScore(result);
                // [SC] remove the tile from the player and reset player selection
                activePlayer.removeSelectedTile();
                // [SC] disable mismatching tiles
                activePlayer.disableMismatchedTiles(tile.getColorIndex(), tile.getShapeIndex());
                // [SC] prevent the player from dropping tiles in the same turn
                activePlayer.setCanDrop(false);
                // [SC] request UI to update
                this.abstractUI.deselectTile(p_playerIndex);
                this.abstractUI.deselectCell(p_playerIndex);
                this.abstractUI.removePlayerTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), activePlayer.PlayerIndex);
                this.abstractUI.putTileOnBoard(this.selectedRowIndex, this.selectedColIndex, tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), activePlayer.PlayerIndex);
                // [SC] reset board selection
                this.resetSelected();
                return true;
            }
            return false;
        };
        // [2016.12.01]
        // [SC] put a given tile on a specified board position; validCheck is true then verify if the move conforms to game rules
        Game.prototype.putTileOnBoard = function (p_rowIndex, p_colIndex, p_tile, p_validCheck) {
            return this.virtualBoard.addTile(p_rowIndex, p_colIndex, p_tile, p_validCheck, null);
        };
        // [SC][2016.12.01]
        Game.prototype.createPlayers = function () {
            // [SC] the list of all players
            this.players = new Array();
            // [SC] creating a human player
            this.humanPlayer = new Player(0, this, true);
            this.fillPlayerTiles(this.humanPlayer);
            this.players.push(this.humanPlayer);
            // [SC] creating an opponent AI player
            this.aiPlayer = new Player(1, this, false);
            this.fillPlayerTiles(this.aiPlayer);
            this.players.push(this.aiPlayer);
        };
        // [2016.12.01]
        Game.prototype.fillPlayerTiles = function (p_player) {
            // [SC] make sure the tile bag is not empty and not all playable tiles are used
            while (this.tileBag.length > 0 && this.playedTileCount < this.playableTileCount) {
                var tile = this.tileBag[0];
                if (p_player.addTile(tile)) {
                    Cfg.Pop(this.tileBag, 0);
                    ++this.playedTileCount;
                    this.abstractUI.addPlayerTile(tile.getColorIndex(), tile.getShapeIndex(), tile.getTileID(), p_player.PlayerIndex);
                }
                else {
                    break;
                }
            }
        };
        // [2016.12.01]
        // [TODO] end the game
        Game.prototype.verifyPlayableTileCount = function (p_tileCount, p_aiPlayerCount) {
            var minTileCount = Cfg.START_TILE_COUNT + (p_aiPlayerCount + 1) * Cfg.MAX_PLAYER_TILE_COUNT;
            if (p_tileCount < minTileCount) {
                Cfg.log("The minimum umber of playable tiles should be " + minTileCount + ". Using default bag size.");
                return false;
            }
            return true;
        };
        /////////////////////////////////////////////////////////////////
        ////// START: board cell selection
        // [2016.12.01]
        Game.prototype.setSelectedCell = function (p_rowIndex, p_colIndex, p_playerIndex) {
            if (p_playerIndex >= this.players.length) {
                Cfg.log("Unknown player with an index " + p_playerIndex + ".");
            }
            else if (this.activePlayerIndex != p_playerIndex) {
                Cfg.log("It is not your turn, " + this.players[p_playerIndex].PlayerName + "!");
            }
            else {
                this.selectedRowIndex = p_rowIndex;
                this.selectedColIndex = p_colIndex;
                this.abstractUI.setSelectedCell(p_rowIndex, p_colIndex, p_playerIndex);
                return true;
            }
            return false;
        };
        // [2016.12.01]
        Game.prototype.resetSelected = function () {
            this.selectedRowIndex = Cfg.NONE;
            this.selectedColIndex = Cfg.NONE;
        };
        // [2016.12.01]
        // [SC] returns true if any board cell is selected
        Game.prototype.isSelected = function () {
            if (this.selectedRowIndex != Cfg.NONE && this.selectedColIndex != Cfg.NONE) {
                return true;
            }
            return false;
        };
        ////// END: board cell selection
        /////////////////////////////////////////////////////////////////
        /// <summary>
        /// Sets selected player tile.
        /// </summary>
        ///
        /// <param name="colorIndex"> Zero-based index of the color. </param>
        /// <param name="shapeIndex"> Zero-based index of the shape. </param>
        /// <param name="tileID">     Identifier for the tile. </param>
        Game.prototype.setSelectedTile = function (colorIndex, shapeIndex, tileID, playerIndex) {
            // [SC] check if it is human player's turn
            if (this.activePlayerIndex !== playerIndex) {
                Cfg.log("It is not the turn for the player " + playerIndex + "!"); //[TODO]
                return false;
            }
            // [TODO] what if parameters values are Cfg.NONE
            if (!this.players[this.activePlayerIndex].setSelectedTile(colorIndex, shapeIndex, tileID)) {
                Cfg.log("The selected tile is not playable!");
                return false;
            }
            this.abstractUI.setSelectedTile(colorIndex, shapeIndex, tileID, playerIndex);
            return true;
        };
        // [SC] 2018.01.11
        Game.prototype.getPlayerCount = function () {
            return this.players.length;
        };
        // [SC] 2018.01.11
        Game.prototype.getBoardTileAt = function (p_rowIndex, p_colIndex) {
            if (this.virtualBoard == null) {
                return null;
            }
            return this.virtualBoard.getTileAt(p_rowIndex, p_colIndex);
        };
        // [SC] called by Player
        Game.prototype.getVirtualBoard = function () {
            return this.virtualBoard;
        };
        Game.prototype.getPlayerByIndex = function (p_index) {
            if (p_index >= 0 && p_index < this.players.length) {
                return this.players[p_index];
            }
            else {
                return null;
            }
        };
        return Game;
    }());
    TileZeroTS.Game = Game;
})(TileZeroTS || (TileZeroTS = {}));
//# sourceMappingURL=TileZeroTS.js.map