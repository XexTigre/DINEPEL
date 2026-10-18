/* Native Figma Plugin API. Append the generated SCENES constant when packaging. */
async function importDinepel(scenes) {
  const pageName='DINEPEL · Base de peças v0.1';
  const ledger={createdNodeIds:[],variableIds:[],styleIds:[],screens:[],componentIds:[],warnings:[],status:'started'};
  const add=n=>{ledger.createdNodeIds.push(n.id);return n;};
  const previous=figma.root.children.find(p=>p.name===pageName);
  if(previous){await figma.setCurrentPageAsync(previous);const marker=previous.findOne(n=>n.name==='DINEPEL · Importação concluída');if(marker){figma.viewport.scrollAndZoomIntoView(previous.children.filter(n=>n.type==='FRAME'));return {...ledger,status:'already_imported',pageId:previous.id};}throw Error('Existe uma importação anterior incompleta nesta página. Preserve-a e execute em outro arquivo para não sobrescrever trabalho.');}
  const available=await figma.listAvailableFontsAsync();
  const family=['Open Sans','Arial','Liberation Sans','Inter'].find(f=>available.some(x=>x.fontName.family===f&&x.fontName.style==='Regular'));
  if(!family)throw Error('Nenhuma fonte compatível está disponível.');
  const regular=available.find(x=>x.fontName.family===family&&x.fontName.style==='Regular').fontName;
  const bold=available.find(x=>x.fontName.family===family&&['Bold','Semi Bold','Semibold'].includes(x.fontName.style))?.fontName||regular;
  await Promise.all([figma.loadFontAsync(regular),figma.loadFontAsync(bold)]);
  if(family!=='Open Sans')ledger.warnings.push('Fonte substituída por '+family+'. Confira quebras de linha.');
  const page=add(figma.createPage());page.name=pageName;await figma.setCurrentPageAsync(page);ledger.pageId=page.id;
  const collection=figma.variables.createVariableCollection('DINEPEL v0.1 / Cores');const mode=collection.modes[0].modeId;ledger.collectionId=collection.id;
  const palette=new Map(),components=new Map(),styles=new Map(),numbers=new Map();
  const layoutCollection=figma.variables.createVariableCollection('DINEPEL v0.1 / Layout');ledger.layoutCollectionId=layoutCollection.id;
  function number(value,scope){const key=scope+'/'+value;let v=numbers.get(key);if(!v){v=figma.variables.createVariable(key,layoutCollection,'FLOAT');v.scopes=[scope==='spacing'?'GAP':'CORNER_RADIUS'];v.setValueForMode(layoutCollection.modes[0].modeId,value);v.setVariableCodeSyntax('WEB',`var(--${scope}-${value})`);ledger.variableIds.push(v.id);numbers.set(key,v);}return v;}
  const color=s=>{if(!s)return null;const m=s.match(/[\d.]+/g);if(!m||m.length<3)return null;return {r:+m[0]/255,g:+m[1]/255,b:+m[2]/255,opacity:m.length>3?+m[3]:1};};
  const semantics={'246,245,242':'background','255,255,255':'surface','32,34,33':'ink','98,103,97':'muted','222,223,217':'line','181,45,50':'red','252,235,236':'red-soft','39,98,66':'green','234,243,236':'green-soft','119,85,28':'amber','252,243,223':'amber-soft','32,38,35':'nav'};
  function paint(css){const c=color(css);if(!c||c.opacity===0)return null;const key=[c.r,c.g,c.b].map(x=>Math.round(x*255)).join(',');let v=palette.get(key);if(!v){const primitive=figma.variables.createVariable('primitive/'+key,collection,'COLOR');primitive.scopes=[];primitive.setValueForMode(mode,{r:c.r,g:c.g,b:c.b});primitive.setVariableCodeSyntax('WEB',`rgb(${key})`);ledger.variableIds.push(primitive.id);v=figma.variables.createVariable(semantics[key]?'color/'+semantics[key]:'color/aux-'+palette.size,collection,'COLOR');v.scopes=['FRAME_FILL','SHAPE_FILL','TEXT_FILL','STROKE_COLOR'];v.setValueForMode(mode,{type:'VARIABLE_ALIAS',id:primitive.id});v.setVariableCodeSyntax('WEB',`var(--${semantics[key]||'aux-'+palette.size})`);ledger.variableIds.push(v.id);palette.set(key,v);}return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:c.r,g:c.g,b:c.b},opacity:c.opacity},'color',v);}
  function setFill(n,css){const p=paint(css);n.fills=p?[p]:[];}
  function text(s,parent){const n=add(figma.createText());parent.appendChild(n);const font=s.font||{size:12,weight:400,lineHeight:18,spacing:0};n.fontName=font.weight>=600?bold:regular;n.characters=s.text||'';n.fontSize=font.size;n.lineHeight={unit:'PIXELS',value:font.lineHeight};n.letterSpacing={unit:'PIXELS',value:font.spacing||0};setFill(n,s.color||'rgb(32,34,33)');n.resize(Math.max(1,s.width+2),Math.max(1,s.height));n.textAutoResize='HEIGHT';n.textAlignHorizontal=font.align==='center'?'CENTER':font.align==='right'?'RIGHT':'LEFT';const key=font.size+'/'+(font.weight>=600?'bold':'regular');let style=styles.get(key);if(!style){style=figma.createTextStyle();style.name='DINEPEL v0.1 / '+key;style.fontName=n.fontName;style.fontSize=font.size;style.lineHeight={unit:'PIXELS',value:font.lineHeight};styles.set(key,style);ledger.styleIds.push(style.id);}n.textStyleId=style.id;n.name=s.name||'Texto';return n;}
  function setBox(n,s){n.name=s.name||s.tag||'Grupo';n.resize(Math.max(1,s.width),Math.max(1,s.height));n.clipsContent=s.name==='table-wrap';setFill(n,s.background);n.cornerRadius=s.radius||0;const p=paint(s.stroke);if(s.strokeWidth>0&&p){n.strokes=[p];n.strokeWeight=s.strokeWidth;if(s.borderWidths){[n.strokeTopWeight,n.strokeRightWeight,n.strokeBottomWeight,n.strokeLeftWeight]=s.borderWidths;}}else n.strokes=[];
    if(s.radius>0)n.setBoundVariable('cornerRadius',number(s.radius,'radius'));
    if(s.layout){n.layoutMode=s.layout;n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';n.itemSpacing=s.gap||0;if(s.gap>0)n.setBoundVariable('itemSpacing',number(s.gap,'spacing'));const p=s.padding||[0,0,0,0];[n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft]=p;['paddingTop','paddingRight','paddingBottom','paddingLeft'].forEach((key,i)=>{if(p[i]>0)n.setBoundVariable(key,number(p[i],'spacing'));});n.primaryAxisAlignItems=s.justify==='space-between'?'SPACE_BETWEEN':s.justify==='center'?'CENTER':s.justify==='flex-end'?'MAX':'MIN';n.counterAxisAlignItems=s.align==='center'?'CENTER':s.align==='flex-end'?'MAX':'MIN';}
  }
  let componentIndex=0;
  function signature(s){return JSON.stringify(s,(key,val)=>['x','y','name'].includes(key)?undefined:val);}
  function render(s,parent,noComponent=false){
    let n;
    if(s.tag==='TEXT'){n=text(s,parent);}
    else if(s.svg){n=add(figma.createNodeFromSvg(s.svg));parent.appendChild(n);n.name='Ícone / '+s.name;n.resize(s.width,s.height);for(const child of n.findAll())ledger.createdNodeIds.push(child.id);}
    else if(s.component&&!noComponent){const key=signature(s);let def=components.get(key);if(!def){def=add(figma.createComponent());page.appendChild(def);setBox(def,s);def.name='DINEPEL / '+s.component+' / '+(++componentIndex);def.description='Componente editável reutilizado nas telas DINEPEL v0.1.';def.x=-2400+(componentIndex%5)*360;def.y=Math.floor(componentIndex/5)*160;for(const child of s.children||[])render(child,def);for(const t of def.findAllWithCriteria({types:['TEXT']})){const prop=def.addComponentProperty('Texto '+t.id,'TEXT',t.characters);t.componentPropertyReferences={characters:prop};}components.set(key,def);ledger.componentIds.push(def.id);}n=add(def.createInstance());parent.appendChild(n);n.name=s.name;for(const child of n.findAll())ledger.createdNodeIds.push(child.id);}
    else{n=add(figma.createFrame());parent.appendChild(n);setBox(n,s);for(const child of s.children||[])render(child,n);}
    if(parent.type!=='PAGE'&&parent.layoutMode!=='NONE'){n.layoutSizingHorizontal='FIXED';n.layoutSizingVertical='FIXED';}else{n.x=s.x||0;n.y=s.y||0;}
    return n;
  }
  for(let i=0;i<scenes.length;i++){const s=scenes[i];const root=add(figma.createFrame());page.appendChild(root);setBox(root,s);root.name=s.name;root.x=200+(i%3)*1660;root.y=200+Math.floor(i/3)*1800;setFill(root,'rgb(246,245,242)');for(const child of s.children||[])render(child,root);const descendants=root.findAll();ledger.screens.push({id:root.id,name:root.name,descendants:descendants.length,text:descendants.filter(n=>n.type==='TEXT').length,instances:descendants.filter(n=>n.type==='INSTANCE').length});}
  const marker=add(figma.createText());marker.fontName=regular;marker.characters='DINEPEL v0.1 · 11 composições editáveis. Exemplos fictícios. Prévia e importador não conectam um banco de produção.';marker.fontSize=18;marker.name='DINEPEL · Importação concluída';marker.x=200;marker.y=60;
  figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync(ledger.screens[0].id)]);ledger.status='completed';ledger.fontFamily=family;
  return ledger;
}
