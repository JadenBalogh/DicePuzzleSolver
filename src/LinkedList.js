class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    /**
     * Appends an element with the given data to the end of the list.
     */
    add(data) {
        var node = new Node(data);
        if (this.head === null) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.prev = node;
            node.next = this.tail;
            this.tail = node;
        }
    }

    /**
     * Returns the first element in the list, or null if the list is empty.
     */
    get() {
        if (this.head === null) {
            return null;
        }
        return this.head.data;
    }

    /**
     * Removes and returns the first element in the list, or null if the list is empty.
     */
    remove() {
        var temp = this.head;
        if (this.head === null) {
            return null;
        } else if (this.head.prev === null) {
            this.head = null;
            this.tail = null;
        } else {
            this.head.prev.next = null;
            this.head = this.head.prev;
        }
        return temp.data;
    }
}

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

export default LinkedList;