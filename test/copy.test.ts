import test from 'ava'
import * as dot from "../src/index.js";
import { all } from './fixtures/values.js'

test('source to target', t => {
  const source = dot.clone(all.primitives);
  const target = dot.clone(all.nested);

  t.assert(dot.has(source, 'string'));
  t.assert(!dot.has(target, 'string'));

  dot.copy(source, 'string', target, 'l1.string');
  t.is(dot.get(source, 'string'), 'string');
  t.is(dot.get(target, 'l1.string'), 'string');
});

test('source to target default', t => {
  const source = dot.clone(all.primitives);
  const target = dot.clone(all.nested);

  t.assert(dot.has(source, 'string'));
  t.assert(!dot.has(target, 'string'));

  dot.copy(source, 'string', target);
  t.is(dot.get(source, 'string'), 'string');
  t.is(dot.get(target, 'string'), 'string');
});

test('copy to self', t => {
  const source = dot.clone(all.primitives);

  t.assert(dot.has(source, 'string'));
  t.assert(!dot.has(source, 'l1.string'));

  dot.copy(source, 'string', source, 'l1.string');
  t.is(dot.get(source, 'string'), dot.get(source, 'l1.string'));
});

