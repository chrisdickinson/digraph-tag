# digraph-tag

ES6 string template tag for quickly generating directed graph data.

```javascript
const digraph = require('digraph-tag')

let graph = digraph`
  A -> B
  B -> C
  C -> D
  D -> A
`

graph.vertices.size                           // === 4
graph.incoming.get('A').size                  // === 1
graph.incoming.get('A').values().next().value // ['D', 'A']

graph.outgoing.get('A').size                  // === 1
graph.outgoing.get('A').values().next().value // ['A', 'B']

// or with objects!
let lhs = {node: 'left hand'}
let rhs = {node: 'right hand'}

let simple = digraph`
  ${lhs} -> ${rhs}
`

graph.vertices.has(lhs) // true
graph.vertices.has(rhs) // true
graph.incoming.get(rhs).values().next().value // [lhs, rhs]
```

## API

#### `digraph\`\w+ -> \w+\`` → {vertices, incoming, outgoing}

Given a literal, return an object containing `vertices` (a set of all vertices in the graph),
`incoming` (a map of vertex to all incoming edges of that vertex), and `outgoing` (a map of
vertex to all outgoing eges of that vertex). Edges are represented as `[from, to]` 2-element
arrays.

## License

MIT
