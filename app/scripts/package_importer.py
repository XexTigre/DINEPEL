"""Bundle editable scene data and native Figma runtime after export_figma.cjs."""
from pathlib import Path
import json
import base64
import struct

root = Path(__file__).resolve().parents[1]
scenes = json.loads((root / 'test-results/figma-scenes.json').read_text())
runtime = (root / 'figma-importer/runtime.js').read_text()
source = json.dumps(scenes, ensure_ascii=True, separators=(',', ':'))
dictionary = {chr(i): i for i in range(256)}
word = ''
codes = []
for char in source:
    candidate = word + char
    if candidate in dictionary:
        word = candidate
    else:
        codes.append(dictionary[word])
        dictionary[candidate] = len(dictionary)
        word = char
if word:
    codes.append(dictionary[word])
if max(codes) >= 65536:
    raise ValueError('Scene data exceeds the 16-bit package limit; split the compositions.')
packed = base64.b64encode(struct.pack('>' + str(len(codes)) + 'H', *codes)).decode()
decoder = r'''
// LZW decoding of semantic JSON data. No eval, raster imagery, or network.
function decodeScenes(encoded) {
  const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const bytes=[]; let buffer=0, bits=0;
  for(const char of encoded){if(char==='=')break;const n=alphabet.indexOf(char);if(n<0)continue;buffer=(buffer<<6)|n;bits+=6;if(bits>=8){bits-=8;bytes.push((buffer>>bits)&255);}}
  const codes=[];for(let i=0;i<bytes.length;i+=2)codes.push((bytes[i]<<8)|bytes[i+1]);
  const dict=Array.from({length:256},(_,i)=>String.fromCharCode(i));
  let word=dict[codes[0]];const output=[word];
  for(let i=1;i<codes.length;i++){const code=codes[i];const entry=dict[code]!==undefined?dict[code]:code===dict.length?word+word[0]:null;if(entry===null)throw Error('Dados de composição inválidos.');output.push(entry);dict.push(word+entry[0]);word=entry;}
  return JSON.parse(output.join(''));
}
'''
ending = r'''
importDinepel(SCENES).then(result=>{
  const summary=JSON.stringify(result,null,2).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  figma.showUI('<html lang="pt-BR"><body style="font:14px Arial;padding:20px;color:#202221"><h2>DINEPEL · Resultado da importação</h2><p>'+result.status+' · Consulte os IDs e avisos abaixo.</p><textarea readonly style="width:100%;height:300px;font:11px monospace">'+summary+'</textarea><p>Confira as telas em tamanho normal antes de aprovar.</p></body></html>',{width:640,height:480});
}).catch(error=>{
  const message=String(error.message).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  figma.showUI('<body style="font:14px Arial;padding:20px"><h2>Importação interrompida</h2><p>'+message+'</p></body>',{width:600,height:220});
});
'''
(root / 'figma-importer/code.js').write_text(
    '// Generated from synthetic HTML compositions. No network access.\n'
    + decoder + 'const SCENES=decodeScenes(' + json.dumps(packed) + ');\n'
    + runtime + ending
)
print(f'Bundled {len(scenes)} editable compositions.')
