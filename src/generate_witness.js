import builder from './witness_calculator.cjs'
import * as fastFile from 'fastfile'
import { readOpList } from './utils/zkey_utils.js'
import { readFileSync, writeFile, mkdir } from 'fs'
import path from "path"
import appRootPath from 'app-root-path'

export default async function generateWitness(circuitDirectory, instanceId){

  const dirPath = circuitDirectory
	const fdOpL = await fastFile.readExisting(`${dirPath}/OpList.bin`, 1<<25, 1<<23)
  const opList = await readOpList(fdOpL)
	await fdOpL.close()

	mkdir(path.join(dirPath, `witness${instanceId}`), (err) => {})

	for (const index in opList) {
		const buffer = readFileSync(`${appRootPath.path}/resource/subcircuits/wasm/subcircuit${opList[index]}.wasm`)
		const input = JSON.parse(readFileSync(`${dirPath}/instance${instanceId}/Input_opcode${index}.json`, "utf8"))
		const witnessCalculator = await builder(buffer)
		const buff = await witnessCalculator.calculateWTNSBin(input, 0)
		writeFile(`${dirPath}/witness${instanceId}/witness${index}.wtns`, buff, function(err) {
			if (err) throw err
		})
	}
}