/**
 * Spatial Hash Grid for efficient collision detection
 * Divides space into cells and only checks entities in nearby cells
 * Reduces collision checks from O(n×m) to O(n+m)
 */
export default class SpatialGrid {
  constructor(cellSize = 32) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  clear() {
    this.grid.clear();
  }

  // Convert world coordinates to grid cell coordinates
  _getCellCoords(x, y) {
    return {
      x: Math.floor(x / this.cellSize),
      y: Math.floor(y / this.cellSize)
    };
  }

  // Create unique key for a grid cell
  _getCellKey(cellX, cellY) {
    return `${cellX},${cellY}`;
  }

  // Insert an entity into all grid cells it overlaps
  insert(entity) {
    const box = entity.getBox();

    // Find all cells this entity overlaps
    const minCell = this._getCellCoords(box.x, box.y);
    const maxCell = this._getCellCoords(box.x + box.width, box.y + box.height);

    // Insert entity into all overlapping cells
    for (let cellX = minCell.x; cellX <= maxCell.x; cellX++) {
      for (let cellY = minCell.y; cellY <= maxCell.y; cellY++) {
        const key = this._getCellKey(cellX, cellY);

        if (!this.grid.has(key)) {
          this.grid.set(key, []);
        }

        this.grid.get(key).push(entity);
      }
    }
  }

  // Query all entities near the given entity
  query(entity) {
    const box = entity.getBox();
    const nearby = [];
    const seen = new Set();

    // Find all cells this entity overlaps
    const minCell = this._getCellCoords(box.x, box.y);
    const maxCell = this._getCellCoords(box.x + box.width, box.y + box.height);

    // Collect all entities in overlapping cells
    for (let cellX = minCell.x; cellX <= maxCell.x; cellX++) {
      for (let cellY = minCell.y; cellY <= maxCell.y; cellY++) {
        const key = this._getCellKey(cellX, cellY);
        const cell = this.grid.get(key);

        if (cell) {
          for (let i = 0; i < cell.length; i++) {
            const otherEntity = cell[i];

            // Use Set to avoid checking same entity multiple times
            if (!seen.has(otherEntity)) {
              seen.add(otherEntity);
              nearby.push(otherEntity);
            }
          }
        }
      }
    }

    return nearby;
  }

  // Get grid statistics (useful for debugging/tuning)
  getStats() {
    let totalEntities = 0;
    let maxEntitiesPerCell = 0;

    this.grid.forEach(cell => {
      totalEntities += cell.length;
      maxEntitiesPerCell = Math.max(maxEntitiesPerCell, cell.length);
    });

    return {
      cellCount: this.grid.size,
      totalEntities,
      maxEntitiesPerCell,
      avgEntitiesPerCell: totalEntities / this.grid.size || 0
    };
  }
}
