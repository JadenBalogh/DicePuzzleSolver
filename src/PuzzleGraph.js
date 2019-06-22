import LinkedList from './LinkedList.js';

class PuzzleGraph {
    constructor(puzzle) {
        this.head = new PuzzleNode(puzzle);
        this.queue = new LinkedList();
        this.queue.add(this.head);
        this.visited = new Map();
        this.visited.set(this.head.puzzle.key(), true);
        // this.checks = [1];
        // this.skipped = 0;
    }

    getNextInQueue() {
        this.queue.remove();
        // if (!this.checks[this.queue.get().level()]) {
        //     this.checks.push(0);
        // }
        // this.checks[this.queue.get().level()]++;
        if (!this.queue.get()) {
            return null;
        }
        return this.queue.get().puzzle;
    }
    
    getPathToCurrent() {
        // console.log("skipped: " + this.skipped);
        var path = [];
        var current = this.queue.get();
        while (current.parent != null) {
            path.push(current.puzzle.layout);
            current = current.parent;
        }
        path.reverse();
        
        // for (var i = 0; i < this.checks.length; i++) {
        //     console.log(`Level ${i} had ${this.checks[i]} checks.`);
        // }

        return path;
    }

    addNode(puzzle) {
        if (this.visited.get(puzzle.key())) {
            // this.skipped++;
            return;
        }
        puzzle.getEquivalent().forEach(p => {
            this.visited.set(p.key(), true);
        });
        var temp = new PuzzleNode(puzzle);
        temp.parent = this.queue.get();
        this.queue.get().children.push(temp);
        this.queue.add(temp);
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