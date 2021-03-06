// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // create a counter
      var counter = 0;
      // iterate over the rowIndex
      for (var i = 0; i < this.attributes[rowIndex].length; i++) {
        // if current element is a 1
        if (this.attributes[rowIndex][i] === 1) {
          // increase counter
          counter++;
        }
      }
      // return if the counter is greater than 1
      return counter > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // iterate over the rows
      // for (var i = 0; i < this.attributes.length; i++) {
      //   // iterate over the row
      //   if (this.hasRowConflictAt(i)) {
      //     return true;
      //   }
      // }

      for (var row in this.attributes) {
        if (this.hasRowConflictAt(row)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      //create counter variable
      var counter = 0;
      //create a board - array of arrays
      var board = this.rows();
      //iterate over the board
      for (var i = 0; i < board.length; i++) {
        //if the element at column index is one
        if (board[i][colIndex] === 1) {
          //increase counter by one
          counter++;
        }
      }
      //return if counter is greater than one
      return counter > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      //store the first row in var
      var firstRow = this.get(0);
      if (!firstRow) {
        return false;
      }
      //iterate over the first row
      for (var i = 0; i < firstRow.length; i++) {
        //if the current column has conflict
        if (this.hasColConflictAt(i)) {
          //return true
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      //create counter variable
      var counter = 0;
      //create a board
      var newBoard = this.rows();
      //create column index variable
      var colIndex;
      //if input is negative
      if (majorDiagonalColumnIndexAtFirstRow < 0) {
        //add the input to the length of the first row; set colIndex equal to value
        colIndex = majorDiagonalColumnIndexAtFirstRow + newBoard[0].length;
        //otherwise
      } else {
        //set column index equal to the input
        colIndex = majorDiagonalColumnIndexAtFirstRow;
      }
      //iterate over the board starting at first row
      for (var i = 0; i < newBoard.length; i++) {
        //if the element at the column index is undefined
        if (newBoard[i][colIndex] === undefined) {
          //reset counter
          counter = 0;
          //iterate over the board starting at the current row
          for (var j = i; j < newBoard.length; j++) {
            //if the element at (column index minus row length) equals one
            if (newBoard[j][colIndex - newBoard[j].length] === 1) {
              //increase counter by one
              counter++;
            }
            //increase column indexby one
            colIndex++;
          }
          // break
          break;
        }
        //if the element at the column index is one
        if (newBoard[i][colIndex] === 1) {
          //increase counter by one
          counter++;
        }
        // if counter is greater than 1
        if (counter > 1) {
          // break
          break;
        }
        //also increase col index by one
        colIndex++;
      }
      //return if the counter is greater than one
      return counter > 1;

    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //store entire board in variable
      var newBoard = this.rows();
      //iterate over the rows
      for (var i = 0; i < newBoard.length; i++) {
        //iterate over the columns
        for (var j = 0; j < newBoard[i].length; j++) {
          //create the columnIndex for the firstRow
          var columnIndexAtFirstRow = this._getFirstRowColumnIndexForMajorDiagonalOn(i, j);
          //if the current index has a diagonal conflict
          if (this.hasMajorDiagonalConflictAt(columnIndexAtFirstRow)) {
            //return true
            return true;
          }
        }
      }
      //return false as a fallback
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      // if the input is greater than the length of the first row
      if (minorDiagonalColumnIndexAtFirstRow > this.get(0).length) {
        // subtract the length of the first row from the input and set equal to current column
        var currCol = minorDiagonalColumnIndexAtFirstRow - this.get(0).length;
      // otherwise
      } else {
        // set current column variable equal to input
        var currCol = minorDiagonalColumnIndexAtFirstRow;
      }
      // create inbounds array
      var inbounds = [];
      // create out of bounds array
      var outOfBounds = [];
      // create inbounds sum
      var inboundsSum = 0;
      // create out of bounds array
      var outOfBoundsSum = 0;
      // create a new board
      var newBoard = this.rows();
      // iterate over the board starting at the first row
      for (var i = 0; i < newBoard.length; i++) {
        // create a container and store the row, col, and value
        var container = {};
        // if inbounds
        if (this._isInBounds(i, currCol)) {
          // add to inbounds array
          inbounds.push({'row': i, 'col': currCol, 'val': newBoard[i][currCol]});
        // else
        } else {
          // add to out of bounds array
          outOfBounds.push({'row': i, 'col': currCol, 'val': newBoard[i][currCol + newBoard.length]});
        }
        // decrease column index by 1
        currCol--;
      }
      // if there is more than one element in the inbounds array
      if (inbounds.length > 1) {
        // iterate over the inbounds array
        for (var j = 0; j < inbounds.length; j++) {
          // add each value to the inbounds sum
          inboundsSum += inbounds[j]['val'];
        }
      }
      // if there is more than one element in the out of bounds array
      if (outOfBounds.length > 1) {
        // iterate over the out of bounds array
        for (var k = 0; k < outOfBounds.length; k++) {
          // add each value to the out of bounds sum
          outOfBoundsSum += outOfBounds[k]['val'];
        }
      }
      // return if the inbounds sum or out of bounds sum is greater than 1
      return inboundsSum > 1 || outOfBoundsSum > 1; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      // create a new board
      var newBoard = this.rows();
      // iterate over the rows
      for (var i = 0; i < newBoard.length; i++) {
        // iterate over the columns
        for (var j = 0; j < newBoard[i].length; j++) {
          // create the col index at the first row
          var columnIndexAtFirstRow = this._getFirstRowColumnIndexForMajorDiagonalOn(i, j);
          // if current index has a diagonal conflict
          if (this.hasMinorDiagonalConflictAt(columnIndexAtFirstRow)) {
            // return true
            return true;
          }
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
