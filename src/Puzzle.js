/* Contains 2d array of positions
First case to deal with:
[02][12][22]
[01][11][21] = 2
[00][10][20]
*/
class Puzzle {
    constructor(layout) {
        this.layout = layout;

        // for (var i = 0; i < structure.length; i++) {
        //     this.layout[i] = new Array(3);
        //     for (var j = 0; j < structure[i].length; j++) {
        //         this.layout[i][j] = 2;
        //     }
        // }
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
        return new Puzzle(this.layout);
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
                if (this.layout[i][j] === -1) 
                    result += "x";
                result += this.layout[i][j];
                if (j !== this.layout[i].length - 1) {
                    result += ", ";
                }
            }
            result += "]";
            if (i !== this.layout.length - 1) {
                result += "\n";
            }
        }
        console.log(result + "\n");
    }
}

export default Puzzle;