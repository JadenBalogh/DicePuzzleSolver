/* Contains 2d array of positions
First case to deal with:
[02][12][22]
[01][11][21] = 2
[00][10][20]
*/
class Puzzle {
    constructor(layout) {
        this.layout = layout;
    }

    // returns all equivalent transformations of this puzzle including the original
    getEquivalent() {
        var result = [];
        var temp = this.copy();
        result.push(temp);
        result.push(temp.reflectH());
        result.push(temp.reflectV());
        temp = temp.rotate();
        result.push(temp);
        temp = temp.rotate();
        result.push(temp);
        temp = temp.rotate();
        result.push(temp);
        return result;
    }

    /*  returns a 90 degree rotated copy of this puzzle:
        [2, 2, 2]    [0, 1, 2]      [00, 01, 02]
        [1, 0, 1] => [x, 0, 2] key: [10, 11, 12]
        [0, x, 0]    [0, 1, 2]      [20, 21, 22]
    */
    rotate() {
        var result = [];
        for (var j = 0; j < this.layout[0].length; j++) {
            var row = [];
            for (var i = this.layout.length - 1; i >= 0; i--) {
                row.push(this.layout[i][j]);
            }
            result.push(row);
        }
        return new Puzzle(result);
    }

    /* returns a copy of this puzzle reflected across the horizontal axis
        [0, 1, 0]    [0, x, 0]      [00, 01, 02]
        [4, 0, 3] => [4, 0, 3] key: [10, 11, 12]
        [0, x, 0]    [0, 1, 0]      [20, 21, 22]
    */
    reflectH() {
        var result = [];
        for (var i = this.layout.length - 1; i >= 0; i--) {
            var row = [];
            for (var j = 0; j < this.layout[i].length; j++) {
                row.push(this.layout[i][j]);
            }
            result.push(row);
        }
        return new Puzzle(result);
    }

    /* returns a copy of this puzzle reflected across the vertical axis
        [0, 1, 0]    [0, 1, 0]      [00, 01, 02]
        [4, 0, 3] => [3, 0, 4] key: [10, 11, 12]
        [0, x, 0]    [0, x, 0]      [20, 21, 22]

    */
    reflectV() {
        var result = [];
        for (var i = 0; i < this.layout.length; i++) {
            var row = [];
            for (var j = this.layout[i].length - 1; j >= 0; j--) {
                row.push(this.layout[i][j]);
            }
            result.push(row);
        }
        return new Puzzle(result);
    }

    equals(other) {
        for (var i = 0; i < this.layout.length; i++) {
            for (var j = 0; j < this.layout[i].length; j++) {
                if (this.layout[i][j] !== other.layout[i][j])
                    return false;
            }
        }
        return true;
    }

    copy() {
        var result = [];
        for (var i = 0; i < this.layout.length; i++) {
            var row = [];
            for (var j = 0; j < this.layout[i].length; j++) {
                row.push(this.layout[i][j]);
            }
            result.push(row);
        }
        return new Puzzle(result);
    }

    key() {
        var result = "";
        for (var i = 0; i < this.layout.length; i++) {
            for (var j = 0; j < this.layout[i].length; j++) {
                if (this.layout[i][j] === -1) 
                    continue;
                result += this.layout[i][j];
            }
        }
        return result;
    }

    print() {
        var result = "";
        for (var i = 0; i < this.layout.length; i++) {
            result += "[";
            for (var j = 0; j < this.layout[i].length; j++) {
                if (this.layout[i][j] === -1) {
                    result += "x";
                } else {
                    result += this.layout[i][j];
                }
                if (j !== this.layout[i].length - 1) {
                    result += ", ";
                }
            }
            result += "]";
            if (i !== this.layout.length - 1) {
                result += "\n";
            }
        }
        console.log(result);
    }
}

export default Puzzle;