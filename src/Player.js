import Vec2D from "./Vec2D.js";

export default class Player {

    pos;
    score = 10;

    constructor(x, y) {
        this.pos = new Vec2D(x, y);
    }

    update(dir) {
        dir.normalize();
        this.pos.add(dir);
    }
}