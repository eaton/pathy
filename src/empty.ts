import { merge } from "./merge.js";
import { get, set, unset } from "./crud.js";
import { EmptyOptions } from "./empty-options.js";

export const defaults: EmptyOptions = {
  null: true,
  string: true,
}

/**
 * Test whether a value is empty or not, based on emptines criteria specified in
 * the options parameter.
 * 
 * By default, `undefined`, `null`, and zero-length strings are treated as empty.
 */
export function isEmpty(input: unknown, options: EmptyOptions = {}) {
  const opt = merge(defaults, options);

  if (input === undefined) return true;

  if (opt.none !== true) {
    if (input === null) return !!opt.all || !!opt.null;
    if (typeof input === 'string' && /^\s+$/.test(input)) return !!opt.all || !!opt.whitespace;
    if (typeof input === 'string' && input.length === 0) return !!opt.all || !!opt.string;

    // Check arrays first, as they technically show up as 'object'
    if (Array.isArray(input) && input.length === 0) return !!opt.all || !!opt.array;

    // Object comparisons; plain objects, buffers, maps, and sets are supported.
    if (Buffer.isBuffer(input) && input.byteLength === 0) return !!opt.all || !!opt.object;
    if (input instanceof Map && input.size === 0) return !!opt.all || !!opt.object;
    if (input instanceof Set && input.size === 0) return !!opt.all || !!opt.object;
    if (typeof input === 'object' && input !== null && Object.keys(input).length === 0) return !!opt.all || !!opt.object;

    if (!input) return !!opt.all || !!opt.falsy;
    if (input === false) return !!opt.all || !!opt.false;
  }
  
  // Try any custom empty functions
  if (opt.custom) {
    if (opt.custom(input, opt)) return true;
  }

  return false;
}

/**
 * Returns `undefined` if the input matches the supplied emptinees criteria,
 * or an unmodified copy of the input if it does not.
 */
export function toEmpty<T>(input: T, options: EmptyOptions = {}): T | undefined {
  return isEmpty(input, options) ? undefined : input;
}

/**
 * Recursively walks an object's properties or an array's elements, removing any
 * that fit the supplied emptiness criteria.
 */
export function toEmptyDeep(input: unknown, options?: EmptyOptions) {
  if (isEmpty(input, options)) return undefined;

  if (Array.isArray(input)) {
    return toEmpty(input.filter(i => toEmpty(i, options)));
  }
  
  if (typeof input === 'object' && input !== null) {
    for (const k in input) {
      const value = toEmptyDeep(get(input, k), options);

      if (isEmpty(value, options)) {
        unset(input, k);
      } else {
        set(input, k, value);
      }
    }
  }

  return toEmpty(input, options);
}