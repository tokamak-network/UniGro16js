import { opcodeDictionary } from './opcode.js'
import fs from 'fs'

const numOfLinesPerCircuit = 12

fs.readFile('./temp.txt', 'utf8', function(err, data) {
  if (err) throw err;
  
  const subcircuitJson = {'wire-list': []}

  const output = data.split('\n').slice(0, -1)
  for (var i = 0; i < output.length; i += numOfLinesPerCircuit) {
    // circuit id
    const id = Number(output[i].match(/\d+/)[0])

    // circuit name
    let name
    if (output[i].includes('_')) {
      const _name = output[i].split(' = ')[1].toUpperCase()
      const index = _name.indexOf('_')
      name = _name.substring(0, index) + '-' + _name.substring(index + 1)
    } else {
      name = output[i].split(' = ')[1].toUpperCase()
    }

    // circuit opcode
    const opcode = opcodeDictionary[name]

    // num_wires 
    const numWires = Number(output[i + 8].match(/\d+/)[0])

    // public output
    const numOutput = Number(output[i + 5].match(/\d+/)[0])

    // public input
    const numInput = Number(output[i + 4].match(/\d+/)[0])

    const subcircuit = {
      id: id,
      opcode: opcode,
      name: name,
      Nwires: numWires,
      Out_idx: [1, numOutput],
      In_idx: [numOutput + 1, numInput]
    }
    subcircuitJson['wire-list'].push(subcircuit)
  }
  fs.writeFile('./subcircuit_info.json', JSON.stringify(subcircuitJson, null, "\t"), err => {
    if (err) {
      console.log('Error occurs while writing a file.', err)
    } else {
      console.log('subcircuit_info.json has been successfully updated.')
    }
  })
})