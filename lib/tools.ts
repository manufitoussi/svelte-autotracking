const dev =  false;// import.meta.env.DEV;

/**
 * Convert a string to a class name
 * @param name
 * @returns {string}
 * @example
 * 
 * classify('coco-test') => 'CocoTest'
 * classify('coco_test') => 'CocoTest'
 * classify('cocoTest') => 'CocoTest'  
 */
export function classify(name: string) {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

}

export type TypeName =
  | 'undefined'
  | 'null'
  | 'string'
  | 'number'
  | 'boolean'
  | 'function'
  | 'array'
  | 'regexp'
  | 'date'
  | 'filelist'
  | 'class'
  | 'instance'
  | 'error'
  | 'object';

// ........................................
// TYPING & ARRAY MESSAGING
//
const TYPE_MAP: Record<string, TypeName> = {
  '[object Boolean]': 'boolean',
  '[object Number]': 'number',
  '[object String]': 'string',
  '[object Function]': 'function',
  '[object AsyncFunction]': 'function',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Object]': 'object',
  '[object FileList]': 'filelist',
} as const;

const { toString } = Object.prototype;

/**
  Returns a consistent type for the passed object.

  Use this instead of the built-in `typeof` to get the type of an item.
  It will return the same result across all browsers and includes a bit
  more detail. Here is what will be returned:

      | Return Value  | Meaning                                              |
      |---------------|------------------------------------------------------|
      | 'string'      | String primitive or String object.                   |
      | 'number'      | Number primitive or Number object.                   |
      | 'boolean'     | Boolean primitive or Boolean object.                 |
      | 'null'        | Null value                                           |
      | 'undefined'   | Undefined value                                      |
      | 'function'    | A function                                           |
      | 'array'       | An instance of Array                                 |
      | 'regexp'      | An instance of RegExp                                |
      | 'date'        | An instance of Date                                  |
      | 'filelist'    | An instance of FileList                              |
      | 'error'       | An instance of the Error object                      |
      | 'object'      | A JavaScript object                                  |

  Examples:

  ```javascript
  typeOf();                       // 'undefined'
  typeOf(null);                   // 'null'
  typeOf(undefined);              // 'undefined'
  typeOf('michael');              // 'string'
  typeOf(new String('michael'));  // 'string'
  typeOf(101);                    // 'number'
  typeOf(new Number(101));        // 'number'
  typeOf(true);                   // 'boolean'
  typeOf(new Boolean(true));      // 'boolean'
  typeOf([1, 2, 90]);             // 'array'
  typeOf(/abc/);                  // 'regexp'
  typeOf(new Date());             // 'date'
  typeOf(event.target.files);     // 'filelist'
  typeOf(new Error('teamocil'));  // 'error'
  typeOf({ a: 'b' });             // 'object'
  ```

  @param item the item to check
  @return {String} the type
*/
export function typeOf(item: unknown): TypeName {
  if (item === null) {
    return 'null';
  }
  if (item === undefined) {
    return 'undefined';
  }
  let ret = TYPE_MAP[toString.call(item)] || 'object';

  if (ret === 'object') {
    if (item instanceof Error) {
      ret = 'error';
    } else if (item instanceof Date) {
      ret = 'date';
    }
  }

  return ret;
}

/**
 * Compare deux valeurs de tous types.
 *
 * Les tableaux sont comparés élément par élément.
 * @param {Any} v1 Valeur 1 à comparer
 * @param {Any} v2 Valeur 2 à comparer
 * @param {Object} options Options de comparaison
 * @param {Boolean} [options.isWeakComparison] activer la comparaison faible
 * @returns vrai si les valeurs sont égales
 */
export function isEqual(v1: any, v2: any, { isWeakComparison = false } = {}) {

  if (isWeakComparison) {
    return v1 == v2;
  }

  if (typeOf(v1) !== typeOf(v2)) {
    return false;
  }

  switch (typeOf(v1)) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'null':
    case 'undefined':
    case 'function':
    case 'class':
    case 'object':
    default:
      return v1 === v2;
    case 'date':
      return v1.valueOf() === v2.valueOf();
    case 'array':
      if (v1.length !== v2.length) return false;
      for (let i = 0; i < v1.length; i++) {
        if (!isEqual(v1[i], v2[i])) return false;
      }
      return true;
  }
}

export function assert(message: string, condition: boolean) {
  if (!dev) {
    console.assert(condition, message)
  }
}

export const logger = {
  debug: (...args: any[]) => {
    if (dev) {
      console.debug(...args);
    }
  },
  info: (...args: any[]) => {
    console.info(...args);
  },
  warn: (...args: any[]) => {
    console.warn(...args);
  },
  error: (...args: any[]) => {
    console.error(...args);
  },
};