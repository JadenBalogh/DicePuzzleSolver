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
    solve(structure, layout) {
        var solution = new Puzzle(structure);
        // sample start position
        var start = new Puzzle(layout);
        start.print();
        this.graph = new PuzzleGraph(start);
        var current = start;
        var moves = 0;
        var stepCount = 0;
        var levelCount = 0;
        var level = 0;
        while (moves < 1000000) {
            if (solution.equals(current)) {
                console.log("moves: " + moves);
                return this.graph.getPathToCurrent();
            }
            for (var x = 0; x < current.layout.length; x++) {
                for (var y = 0; y < current[x].layout.length; y++) {
                    if (layout[x][y] === -1)
                        continue;
                    var next = this.useTile(current, x, y);
                    if (!next.equals(current)) {
                        this.graph.addNode(next);
                        stepCount++;
                    }
                }
            }
            if (levelCount === 0) {
                level++;
                console.log(`level ${level} completed with ${stepCount} steps`);
                levelCount = stepCount;
                stepCount = 0;
            }
            levelCount--;
            current = this.graph.getNextInQueue();
            moves++;
        }
        return null;
    }
    
    editTile(puzzle, x, y) {
        var result = puzzle.copy();
        if (isPositionValid(result.layout, x, y)) {
            if (isScoreValid(result.layout[x][y]+1)) {
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
    useTile(puzzle, x, y) {
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
            return b[2] - a[2];
        });
    
        // Step 3
        while (result.layout[x][y] < 4 && adj.length > 0) {
            var next = adj.shift();
            result.layout[x][y]++;
            result.layout[next[0]][next[1]]--;
        }
    
        return result;
    }
  
    isPositionValid(layout, x, y) {
      return x >= 0 && x < layout.length && y >= 0 && y < layout[0].length;
    }
  
    isScoreValid(score) {
      return (score > 0 && score <= 4);
    }
}

export default PuzzleSolver;