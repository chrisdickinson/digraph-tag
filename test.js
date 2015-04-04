'use strict'


const digraph = require('./lib/digraph-tag.js')
const test = require('tape')


test('works with empty tag', function(assert) {
  let data = digraph``

  assert.equal(data.vertices.size, 0)
  assert.equal(data.incoming.size, 0)
  assert.equal(data.outgoing.size, 0)
  assert.end()
})


test('builds expected graph', function(assert) {
  let data = digraph`
    A -> B
    B -> C
    C -> D

    X -> Y
    Y -> Z
    Z -> D
  `

  assert.equal(data.vertices.size, 7)
  assert.equal(data.incoming.size, 5)
  assert.equal(data.outgoing.size, 6)

  assert.equal(data.incoming.has('A'), false)
  assert.equal(data.outgoing.get('A').size, 1)
  assert.equal(data.outgoing.get('A').values().next().value[0], 'A')
  assert.equal(data.outgoing.get('A').values().next().value[1], 'B')

  assert.equal(data.incoming.get('B').size, 1)
  assert.equal(data.outgoing.get('B').size, 1)
  assert.equal(data.outgoing.get('B').values().next().value[0], 'B')
  assert.equal(data.outgoing.get('B').values().next().value[1], 'C')
  assert.equal(data.incoming.get('B').values().next().value[0], 'A')
  assert.equal(data.incoming.get('B').values().next().value[1], 'B')

  assert.equal(data.incoming.get('C').size, 1)
  assert.equal(data.outgoing.get('C').size, 1)
  assert.equal(data.outgoing.get('C').values().next().value[0], 'C')
  assert.equal(data.outgoing.get('C').values().next().value[1], 'D')
  assert.equal(data.incoming.get('C').values().next().value[0], 'B')
  assert.equal(data.incoming.get('C').values().next().value[1], 'C')

  assert.equal(data.incoming.has('X'), false)
  assert.equal(data.outgoing.get('X').size, 1)
  assert.equal(data.outgoing.get('X').values().next().value[0], 'X')
  assert.equal(data.outgoing.get('X').values().next().value[1], 'Y')

  assert.equal(data.incoming.get('Y').size, 1)
  assert.equal(data.outgoing.get('Y').size, 1)
  assert.equal(data.outgoing.get('Y').values().next().value[0], 'Y')
  assert.equal(data.outgoing.get('Y').values().next().value[1], 'Z')
  assert.equal(data.incoming.get('Y').values().next().value[0], 'X')
  assert.equal(data.incoming.get('Y').values().next().value[1], 'Y')

  assert.equal(data.incoming.get('Z').size, 1)
  assert.equal(data.outgoing.get('Z').size, 1)
  assert.equal(data.outgoing.get('Z').values().next().value[0], 'Z')
  assert.equal(data.outgoing.get('Z').values().next().value[1], 'D')
  assert.equal(data.incoming.get('Z').values().next().value[0], 'Y')
  assert.equal(data.incoming.get('Z').values().next().value[1], 'Z')

  assert.equal(data.incoming.get('D').size, 2)
  assert.equal(data.outgoing.get('D'), undefined)
  let iter = data.incoming.get('D').values()
  assert.equal(iter.next().value[0], 'C')
  assert.equal(iter.next().value[0], 'Z')
  assert.end()
})


test('works with inserted literals', function(assert) {
  let alpha = {name: 'alpha'}
  let beta = {name: 'beta'}
  let gamma = {name: 'gamma'}
  let zeta = {name: 'zeta'}

  let data = digraph`
    ${alpha} -> ${beta}
    ${beta} -> ${gamma}
    ${gamma} -> ${zeta}
    ${zeta} -> ${alpha}
  `

  assert.equal(data.vertices.size, 4)
  assert.ok(data.vertices.has(alpha))
  assert.ok(data.vertices.has(beta))
  assert.ok(data.vertices.has(gamma))
  assert.ok(data.vertices.has(zeta))

  const combinations = [
    [zeta, alpha, beta],
    [alpha, beta, gamma],
    [beta, gamma, zeta]
  ]

  for (let trio of combinations) {
    assert.equal(data.incoming.get(trio[1]).size, 1)
    assert.equal(data.incoming.get(trio[1]).values().next().value[0], trio[0])
    assert.equal(data.incoming.get(trio[1]).values().next().value[1], trio[1])
    assert.equal(data.outgoing.get(trio[1]).size, 1)
    assert.equal(data.outgoing.get(trio[1]).values().next().value[0], trio[1])
    assert.equal(data.outgoing.get(trio[1]).values().next().value[1], trio[2])
  }

  assert.end()
})
