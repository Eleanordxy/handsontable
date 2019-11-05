import { isUndefined, isDefined } from '../helpers/mixed';
import { mixin } from '../helpers/object';
import localHooks from '../mixins/localHooks';

// Counter for checking if there is a memory leak.
let registeredMaps = 0;

/**
 * Collection of maps.
 */
class MapCollection {
  constructor() {
    /**
     * Mappings from the unique name to the stored map.
     *
     * @type {Map<string, BaseMap>}
     */
    this.mappings = new Map();
  }

  /**
   * Register custom index map.
   *
   * @param {String} uniqueName Unique name of the map.
   * @param {BaseMap} map Map containing miscellaneous (i.e. meta data, indexes sequence), updated after remove and insert data actions.
   * @returns {BaseMap|undefined}
   */
  register(uniqueName, map) {
    if (this.mappings.has(uniqueName) === false) {
      this.mappings.set(uniqueName, map);

      map.addLocalHook('change', () => this.runLocalHooks('change', map));

      registeredMaps += 1;
    }
  }

  /**
   * Unregister custom index map.
   *
   * @param {String} name Name of the map.
   */
  unregister(name) {
    const map = this.mappings.get(name);

    if (isDefined(map)) {
      map.clearLocalHooks();
      this.mappings.delete(name);

      this.runLocalHooks('change', map);

      registeredMaps -= 1;
    }
  }

  /**
   * Get indexes list for provided index map name.
   *
   * @param {String} [name] Name of the map.
   * @returns {Array|BaseMap}
   */
  get(name) {
    if (isUndefined(name)) {
      return Array.from(this.mappings.values());
    }

    return this.mappings.get(name);
  }

  /**
   * Get collection size.
   *
   * @returns {Number}
   */
  getLength() {
    return this.mappings.size;
  }

  /**
   * Remove some indexes and corresponding mappings and update values of the others within all collection's maps.
   *
   * @private
   * @param {Array} removedIndexes List of removed indexes.
   */
  removeFromEvery(removedIndexes) {
    this.mappings.forEach((map) => {
      map.remove(removedIndexes);
    });
  }

  /**
   * Insert new indexes and corresponding mapping and update values of the others all collection's maps.
   *
   * @private
   * @param {Number} insertionIndex Position inside the actual list.
   * @param {Array} insertedIndexes List of inserted indexes.
   */
  insertToEvery(insertionIndex, insertedIndexes) {
    this.mappings.forEach((map) => {
      map.insert(insertionIndex, insertedIndexes);
    });
  }

  /**
   * Set default values to index maps within collection.
   *
   * @param {Number} length Destination length for all stored maps.
   */
  initEvery(length) {
    this.mappings.forEach((map) => {
      map.init(length);
    });
  }
}

mixin(MapCollection, localHooks);

export default MapCollection;

export function getRegisteredMapsCounter() {
  return registeredMaps;
}
