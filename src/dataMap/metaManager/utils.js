import { inherit, hasOwnProperty } from '../../helpers/object';
import { getCellType } from '../../cellTypes';

export function expandMetaType(metaObject) {
  if (!hasOwnProperty(metaObject, 'type')) {
    return;
  }

  const expandedType = {};
  let type;

  if (typeof metaObject.type === 'object') {
    type = metaObject.type;
  } else if (typeof metaObject.type === 'string') {
    type = getCellType(metaObject.type);
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const i in type) {
    if (hasOwnProperty(type, i) && !hasOwnProperty(metaObject, i)) {
      expandedType[i] = type[i];
    }
  }

  return expandedType;
}

export function columnFactory(TableMeta, conflictList) {
  function ColumnMeta() {}

  inherit(ColumnMeta, TableMeta);

  // Clear conflict settings
  for (let i = 0; i < conflictList.length; i++) {
    ColumnMeta.prototype[conflictList[i]] = void 0;
  }

  return ColumnMeta;
}

export function isFiniteSignedNumber(value) {
  return Number.isFinite(value) && value >= 0;
}

export function assert(condition, errorMessage) {
  if (!condition()) {
    throw new Error(`Assertion failed: ${errorMessage}`);
  }
}
