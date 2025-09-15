import { test } from 'tap'

import { setMark } from './HLD.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Tests
---------+---------+---------+---------+---------+---------+---------+--------*/

test('HLD setMark', async (t) => {
  t.equal(setMark('2025-1-1'), 'N')
  t.equal(setMark('2025-01-1'), 'N')
  t.equal(setMark('2025-1-01'), 'N')
  t.equal(setMark('2025-01-01'), 'N')

  t.equal(setMark('2025-13-01'), ' ')
  t.equal(setMark('2025-2-31'), ' ')
  t.equal(setMark('2025-11-31'), ' ')
})
