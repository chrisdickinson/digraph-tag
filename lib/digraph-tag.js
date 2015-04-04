'use strict'

module.exports = graph

function graph(strings) {
  const values = [].slice.call(arguments, 1)
  const accum = []

  accum.push(strings[0])

  let valueIdx = 0
  for (let xs of strings.slice(1)) {
    accum.push(String(valueIdx++))
    accum.push(xs)
  }

  const str = accum.join('')
  const rex = /\s*(\w+)\s*->\s*(\w+)/g

  const outgoing = new Map()
  const incoming = new Map()
  const vertices = new Set()

  str.split('\n').forEach(function(xs) {
    xs.replace(rex, function(g, lhs, rhs) {
      if (/\d+/.test(lhs) && Number(lhs) > -1 && Number(lhs) < values.length) {
        lhs = values[Number(lhs)]
      }
      if (/\d+/.test(rhs) && Number(rhs) > -1 && Number(rhs) < values.length) {
        rhs = values[Number(rhs)]
      }
      vertices.add(lhs)
      vertices.add(rhs)
      let outgoingEdges = outgoing.get(lhs)
      if (!outgoingEdges) {
        outgoing.set(lhs, outgoingEdges = new Set())
      }
      let incomingEdges = incoming.get(rhs)
      if (!incomingEdges) {
        incoming.set(rhs, incomingEdges = new Set())
      }
      let edge = [lhs, rhs]
      incomingEdges.add(edge)
      outgoingEdges.add(edge)
    })
  })

  return {
    vertices: vertices,
    incoming: incoming,
    outgoing: outgoing
  }
}
