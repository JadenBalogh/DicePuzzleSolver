import PuzzleGraph from './PuzzleGraph.js';
import Puzzle from './Puzzle.js';

// Contains graph of puzzle, findPaths() method and solution output code
class PuzzleSolver {
    /* ALGORITHM
      1. Create a new graph-queue with the starting
        puzzle as the head
      2. Calculate all next moves from that puzzle
        and check if any one is the solution
      3. Move to the next object in the queue, repeat
    */
    solve(structure, layout, priority) {
        var solution = new Puzzle(structure);
        var start = new Puzzle(layout);
        this.graph = new PuzzleGraph(start);
        var current = start;
        var moves = 0;
        while (moves < 1000000) {
            if (!current) {
                return [];
            }
            if (solution.equals(current)) {
                return this.graph.getPathToCurrent();
            }
            for (var x = 0; x < current.layout.length; x++) {
                for (var y = 0; y < current.layout[x].length; y++) {
                    if (layout[x][y] === -1)
                        continue;
                    var next = this.useTile(current, x, y, priority);
                    if (!next.equals(current)) {
                        this.graph.addNode(next);
                    }
                }
            }
            current = this.graph.getNextInQueue();
            moves++;
        }
        return [];
    }
    
    editTile(puzzle, x, y) {
        var result = puzzle.copy();
        if (this.isPositionValid(result.layout, x, y)) {
            if (this.isScoreValid(result.layout[x][y]+1)) {
                result.layout[x][y]++;
            } else {
                result.layout[x][y] = 0;
            }
        }
        return result;
    }

    /* RULES
    1. A tile can only increase if a tile 
        adjacent to it has a score of at least 1
    2. A tile cannot be increased if it has a score
        of 4
    3. A tile cannot be reduced if it has a score
        of 0
    4. If increasing a tile would put its tota
        above 4, it instead reduces a number of
        tiles around it equal to the amount it needs
        to reach 4, starting with the tiles with 
        the highest scores
    */
    useTile(puzzle, x, y, priority) {
        /* STEPS
            1. save each neighbour into a map where
            the key is its position and the value is its
            score
            2. sort by the highest value first
            3. while the current tile's score is below 4
            and there are still tiles in the adjacent list,
            add one to score and subtract one from the next
            adjacent tile, then remove it from the list
        */
        if (!this.isTileUsable(puzzle.layout, x, y)) {
            return puzzle;
        }

        var result = puzzle.copy();
    
        // Step 1
        var adj = [];
        if (this.isPositionValid(result.layout, x+1, y)  
        && this.isScoreValid(result.layout[x+1][y])) {
            adj.push([x+1, y, result.layout[x+1][y]]);
        } 
        if (this.isPositionValid(result.layout, x-1, y) 
        && this.isScoreValid(result.layout[x-1][y])) {
            adj.push([x-1, y, result.layout[x-1][y]]);
        } 
        if (this.isPositionValid(result.layout, x, y+1) 
        && this.isScoreValid(result.layout[x][y+1])) {
            adj.push([x, y+1, result.layout[x][y+1]]);
        }
        if (this.isPositionValid(result.layout, x, y-1) 
        && this.isScoreValid(result.layout[x][y-1])) {
            adj.push([x, y-1, result.layout[x][y-1]]);
        }
    
        // Step 2
        adj = adj.sort((a,b) => {
            if (b[2] !== a[2]) {
                return b[2] - a[2];
            } else {
                return priority[b[0]][b[1]] - priority[a[0]][a[1]];
            }
        });
    
        // Step 3
        while (result.layout[x][y] < 4 && adj.length > 0) {
            var next = adj.shift();
            result.layout[x][y]++;
            result.layout[next[0]][next[1]]--;
        }
    
        return result;
    }

    isTileUsable(layout, x, y) {
        return layout[x][y] < 4 && (
            (this.isPositionValid(layout, x+1, y) && layout[x+1][y] > 0) ||
            (this.isPositionValid(layout, x-1, y) && layout[x-1][y] > 0) ||
            (this.isPositionValid(layout, x, y+1) && layout[x][y+1] > 0) ||
            (this.isPositionValid(layout, x, y-1) && layout[x][y-1] > 0)
        );
    }
  
    isPositionValid(layout, x, y) {
      return x >= 0 && x < layout.length && y >= 0 && y < layout[0].length;
    }
  
    isScoreValid(score) {
      return (score > 0 && score <= 4);
    }

    isPuzzleValid(structure, layout) {
        var expected = 0;
        var actual = 0;
        for (var i = 0; i < structure.length; i++) {
            for (var j = 0; j < structure[i].length; j++) {
                expected += structure[i][j];
                actual += layout[i][j];
            }
        }
        return expected === actual;
    }

}

export default PuzzleSolver;