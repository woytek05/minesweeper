export default class Block {
    constructor(i, j, count, type, is_mine, covered) {
        this.i = i;
        this.j = j;
        this.count = count;
        this.type = type;
        this.is_mine = is_mine;
        this.covered = covered;
    }
}
