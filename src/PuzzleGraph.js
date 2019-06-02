class PuzzleGraph {
    constructor(puzzle) {
        this.head = new PuzzleNode(puzzle);
        this.queue = [];
        this.queue.push(this.head);
        this.visited = new Map();
        this.visited.set(this.head.puzzle.key(), true);
        this.skipped = 0;
    }

    getNextInQueue() {
        this.visited.set(this.queue[0].puzzle.key(), true);
        this.queue.shift();
        if (this.visited.get(this.queue[0].puzzle.key())) {
            this.queue.shift();
            this.skipped++;
        }
        return this.queue[0].puzzle;
    }

    getPathToCurrent() {
        console.log("skipped: " + this.skipped);
        var path = [];
        var current = this.queue[0];
        while (current.parent != null) {
            path.push(current.puzzle.layout);
            current = current.parent;
        }
        path.reverse();
        return path;
    }

    addNode(puzzle) {
        var temp = new PuzzleNode(puzzle);
        temp.parent = this.queue[0];
        this.queue[0].children.push(temp);
        this.queue.push(temp);
    }
}

class PuzzleNode {
    constructor(puzzle) {
        this.puzzle = puzzle;
        this.children = [];
        this.parent = null;
    }
}

export default PuzzleGraph;