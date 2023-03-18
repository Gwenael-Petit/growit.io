import Vec2D from "./Vec2D.js";

export default class Food {

    pos;
    value;

    constructor(x, y, value) {
        this.pos = new Vec2D(x, y);
        this.value = value;
    }

    getRadius() {
        return Math.sqrt(this.value/Math.PI);
    }

}