class PuzzleGraph {
    constructor(puzzle) {
        this.head = new PuzzleNode(puzzle);
        this.queue = [];
        this.queue.push(this.head);
        this.visited = new Map();
        this.visited.set(this.head.puzzle.key(), true);
        this.checks = [1];
        this.skipped = 0;
    }

    getNextInQueue() {
        this.queue[0].puzzle.getEquivalent().forEach(puzzle => {
            this.visited.set(puzzle.key(), true);
        });
        this.queue.shift();
        if (this.visited.get(this.queue[0].puzzle.key())) {
            this.queue.shift();
            this.skipped++;
        }
        if (!this.checks[this.queue[0].level()]) {
            this.checks.push(0);
        }
        this.checks[this.queue[0].level()]++;
        // console.log(`Level ${this.queue[0].level()}`);
        // this.queue[0].parent.puzzle.print();
        // console.log("goes to:")
        // this.queue[0].puzzle.print();
        // console.log("");
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
        
        for (var i = 0; i < this.checks.length; i++) {
            console.log(`Level ${i} had ${this.checks[i]} checks.`);
        }

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

    level() {
        if (!this.parent) {
            return 0;
        }

        return 1 + this.parent.level();
    }
}

export default PuzzleGraph;