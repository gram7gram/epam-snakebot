import PF from "pathfinding";

const Path = new PF.AStarFinder({
    allowDiagonal: false
});

export default function (grid, origin, destination) {

    return Path.findPath(
        origin.x,
        origin.y,
        destination.x,
        destination.y,
        grid.clone());
}