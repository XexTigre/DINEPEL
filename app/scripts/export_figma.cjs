const fs=require('fs'),path=require('path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const appRoot=path.resolve(__dirname,'..');
process.chdir(appRoot);
fs.mkdirSync('test-results',{recursive:true});
const extract=()=>{
 const round=n=>Math.round(n*100)/100;
 const root=document.querySelector('.shell');
 function walk(el,parentRect){
   const cs=getComputedStyle(el),r=el.getBoundingClientRect();
   if(cs.display==='none'||cs.visibility==='hidden'||!r.width||!r.height||el.tagName==='SCRIPT'||el.tagName==='STYLE')return null;
   const box={x:round(r.x-parentRect.x),y:round(r.y-parentRect.y),width:round(r.width),height:round(r.height)};
   const spec={name:(el.getAttribute('aria-label')||el.id||el.className?.baseVal||el.className||el.tagName).toString().slice(0,100),tag:el.tagName,...box,background:cs.backgroundColor,color:cs.color,radius:parseFloat(cs.borderRadius)||0,stroke:cs.borderTopWidth!=='0px'?cs.borderTopColor:cs.borderBottomColor,strokeWidth:Math.max(parseFloat(cs.borderTopWidth),parseFloat(cs.borderBottomWidth)),borderWidths:[cs.borderTopWidth,cs.borderRightWidth,cs.borderBottomWidth,cs.borderLeftWidth].map(parseFloat),padding:[cs.paddingTop,cs.paddingRight,cs.paddingBottom,cs.paddingLeft].map(parseFloat),gap:parseFloat(cs.gap)||0,align:cs.alignItems,justify:cs.justifyContent,component:el.dataset.component||null,children:[]};
   const isFlex=cs.display==='flex'||cs.display==='inline-flex';
   if(isFlex&&cs.flexWrap==='nowrap')spec.layout=cs.flexDirection.startsWith('column')?'VERTICAL':'HORIZONTAL';
   if(el.tagName==='TR')spec.layout='HORIZONTAL';
   if(el.tagName==='TBODY'||el.tagName==='THEAD')spec.layout='VERTICAL';
   if(el.tagName==='TABLE')spec.layout='VERTICAL';
   if(el.tagName==='SVG'){
     const use=el.querySelector('use'),symbol=use?document.querySelector(use.getAttribute('href')):null;
     spec.svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${r.width}" height="${r.height}" viewBox="0 0 24 24" fill="none" stroke="${cs.color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${symbol?symbol.innerHTML:el.innerHTML}</svg>`;return spec;
   }
   const font={size:parseFloat(cs.fontSize),weight:parseInt(cs.fontWeight)||400,lineHeight:parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.5,spacing:parseFloat(cs.letterSpacing)||0,italic:cs.fontStyle==='italic',align:cs.textAlign};
   if(el.tagName==='INPUT'||el.tagName==='SELECT'){
     const text=el.tagName==='SELECT'?el.options[el.selectedIndex]?.text:el.value||el.placeholder;
     spec.children=[{name:'Valor do campo',tag:'TEXT',text:text||'',x:spec.padding[3],y:(r.height-font.lineHeight)/2,width:Math.max(1,r.width-spec.padding[1]-spec.padding[3]),height:font.lineHeight,color:cs.color,font}];return spec;
   }
   for(const child of el.childNodes){
     if(child.nodeType===3&&child.textContent.trim()){
       const range=document.createRange();range.selectNodeContents(child);const cr=range.getBoundingClientRect();if(!cr.width||!cr.height)continue;
       let text=child.textContent.replace(/\s+/g,' ').trim();if(cs.textTransform==='uppercase')text=text.toUpperCase();
       spec.children.push({name:text.slice(0,60),tag:'TEXT',text,x:round(cr.x-r.x),y:round(cr.y-r.y),width:round(Math.max(1,cr.width+1)),height:round(cr.height),color:cs.color,font});
     }else if(child.nodeType===1){const item=walk(child,r);if(item)spec.children.push(item);}
   }
   if(cs.display==='grid'&&spec.children.length){
     const rows=[];
     for(const child of spec.children){let row=rows.find(a=>Math.abs(a[0].y-child.y)<2);if(!row){row=[];rows.push(row);}row.push(child);}
     if(rows.length===1){spec.layout='HORIZONTAL';spec.align='flex-start';}
     else{
       spec.layout='VERTICAL';spec.align='flex-start';
       spec.children=rows.map((items,i)=>{const left=Math.min(...items.map(x=>x.x)),top=Math.min(...items.map(x=>x.y)),right=Math.max(...items.map(x=>x.x+x.width)),bottom=Math.max(...items.map(x=>x.y+x.height));return {name:'Linha '+(i+1),tag:'DIV',x:left,y:top,width:right-left,height:bottom-top,layout:'HORIZONTAL',align:'flex-start',gap:parseFloat(cs.columnGap)||0,padding:[0,0,0,0],children:items.map(x=>({...x,x:x.x-left,y:x.y-top}))};});
     }
   }
   return spec;
 }
 const scene=walk(root,root.getBoundingClientRect());scene.x=0;scene.y=0;
 return scene;
};
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox','--no-zygote','--single-process','--disable-gpu','--disable-software-rasterizer']}: {})});
 const page=await browser.newPage({viewport:{width:1440,height:1050}});await page.goto('file://'+path.resolve('prototype/index.html'));await page.evaluate(()=>localStorage.clear());await page.reload();const scenes=[];
 for(const [route,name,id] of [['catalogo','01 · Catálogo de peças'],['produto','02 · Ficha da peça','peca-demo-001'],['empresas','03 · Empresas e filiais'],['empresa','04 · Ficha da empresa','empresa-demo-a'],['marcas','05 · Marcas'],['estoque','06 · Estoque por filial'],['importacoes','07 · Importações'],['historico','08 · Histórico'],['arquitetura','09 · Estrutura dos dados']]){
   await page.evaluate(([r,i])=>goto(r,i),[route,id||'']);const spec=await page.evaluate(extract);spec.name=name;scenes.push(spec);
 }
 await page.setViewportSize({width:390,height:900});await page.evaluate(()=>goto('catalogo'));let mobile=await page.evaluate(extract);mobile.name='10 · Catálogo mobile';scenes.push(mobile);
 await page.setViewportSize({width:1440,height:1050});await page.evaluate(()=>goto('catalogo'));await page.click('[data-action="newProduct"]');await page.locator('[name="name"]').fill('Suporte do conjunto');await page.locator('[name="code"]').fill('PL-100');await page.click('#form button[type="submit"]');
 // A separate editable modal is captured from its native DOM subtree.
 const modal=await page.evaluate(()=>{const el=document.querySelector('#dialog');el.classList.add('shell');el.style.display='block';el.style.position='static';el.style.width='590px';el.style.maxHeight='none';el.style.minHeight='0';document.querySelector('body>.shell').classList.remove('shell');return true;});
 const dup=await page.evaluate(extract);dup.name='11 · Cadastro com duplicidade';scenes.push(dup);
 fs.writeFileSync('test-results/figma-scenes.json',JSON.stringify(scenes));
 console.log({scenes:scenes.length,bytes:fs.statSync('test-results/figma-scenes.json').size});await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
