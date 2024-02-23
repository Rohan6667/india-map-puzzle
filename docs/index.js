import svgpath from"https://cdn.jsdelivr.net/npm/svgpath@2.6.0/+esm";const htmlLang=document.documentElement.lang,ttsLang=getTTSLang(htmlLang);let correctCount=0;const audioContext=new AudioContext,audioBufferCache={};loadAudio("modified","/india-map-puzzle/mp3/decision50.mp3"),loadAudio("correct","/india-map-puzzle/mp3/correct3.mp3"),loadAudio("correctAll","/india-map-puzzle/mp3/correct1.mp3");let ttsVoices=[];loadVoices(),loadConfig();function loadConfig(){localStorage.getItem("darkMode")==1&&document.documentElement.setAttribute("data-bs-theme","dark")}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),document.documentElement.setAttribute("data-bs-theme","light")):(localStorage.setItem("darkMode",1),document.documentElement.setAttribute("data-bs-theme","dark"))}async function playAudio(e,t){const s=await loadAudio(e,audioBufferCache[e]),n=audioContext.createBufferSource();if(n.buffer=s,t){const e=audioContext.createGain();e.gain.value=t,e.connect(audioContext.destination),n.connect(e),n.start()}else n.connect(audioContext.destination),n.start()}async function loadAudio(e,t){if(audioBufferCache[e])return audioBufferCache[e];const s=await fetch(t),o=await s.arrayBuffer(),n=await audioContext.decodeAudioData(o);return audioBufferCache[e]=n,n}function unlockAudio(){audioContext.resume()}function loadVoices(){const e=new Promise(e=>{let t=speechSynthesis.getVoices();if(t.length!==0)e(t);else{let n=!1;speechSynthesis.addEventListener("voiceschanged",()=>{n=!0,t=speechSynthesis.getVoices(),e(t)}),setTimeout(()=>{n||document.getElementById("noTTS").classList.remove("d-none")},1e3)}});e.then(e=>{ttsVoices=e.filter(e=>e.lang==ttsLang)})}function speak(e){speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(e);return t.voice=ttsVoices[Math.floor(Math.random()*ttsVoices.length)],t.lang=ttsLang,speechSynthesis.speak(t),t}function getRandomInt(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e))+e}function getStateId(e){const t=map.contentDocument,n=[...t.querySelectorAll(".main")];return n.indexOf(e)}function movePathPoints(e,t,n){e=e.cloneNode(!0);const s=svgpath(e.getAttribute("d"));return s.translate(-t,-n),e.setAttribute("d",s.toString()),e}function movePolygonPoints(e,t,n){e=e.cloneNode(!0);const s=e.getAttribute("points").split(" ").map(Number),o=s.map((e,s)=>s%2==0?e-n:e-t);return e.setAttribute("points",o.join(" ")),e}function moveGroupPoints(e,t,n){return e=e.cloneNode(!0),e.querySelectorAll("path, polygon").forEach(e=>{switch(e.tagName){case"path":e.replaceWith(movePathPoints(e,t,n));break;case"polygon":e.replaceWith(movePolygonPoints(e,t,n));break}}),e}function movePoints(e,t,n){switch(e.tagName){case"path":return movePathPoints(e,t,n);case"polygon":return movePolygonPoints(e,t,n);case"g":return moveGroupPoints(e,t,n);default:throw new Error("not supported")}}function getPieceSvg(e,t){const i="http://www.w3.org/2000/svg",n=document.createElementNS(i,"svg"),a=e.getBBox(),{x:r,y:c,width:s,height:o}=a;n.setAttribute("width",s*t),n.setAttribute("height",o*t),n.setAttribute("viewBox",`0 0 ${s} ${o}`),n.setAttribute("fill","black"),n.setAttribute("opacity","0.8");const l=movePoints(e,r,c);return n.appendChild(l),n}function checkSpinnedPosition(e,t,n){let o=Math.abs(n.angle+t.angle);if(o>180&&(o=360-o),o>angleThreshold)return!1;const i=t.getCenterPoint(),s=e.getBoundingClientRect(),r=s.left+s.width/2,c=s.top+s.height/2,a=n.width/s.width,l=a*n.scaleX*t.scaleX,d=a*n.scaleY*t.scaleY;return!(Math.abs(i.x-r)>positionThreshold)&&!(Math.abs(i.y-c)>positionThreshold)&&!(Math.abs(l-1)>scaleThreshold)&&!(Math.abs(d-1)>scaleThreshold)}function checkPosition(e,t){const n=e.getBoundingClientRect(),s=t.width*t.scaleX,o=t.height*t.scaleY,i=t.left-s/2,a=t.top-o/2;return!(Math.abs(i-n.x)>positionThreshold)&&!(Math.abs(a-n.y)>positionThreshold)&&!(Math.abs(s-n.width)>positionThreshold)&&!(Math.abs(o-n.height)>positionThreshold)}function addStateText(e){clearTimeout(stateTimer),canvas.remove(stateText);const t=canvas.width/stateTextLength;stateText=new fabric.Text(e,{fontSize:t,fontFamily:"serif",left:canvas.width/2,top:canvas.height/2,originX:"center",originY:"center",selectable:!1,fill:"blue"}),canvas.add(stateText),canvas.sendToBack(stateText),stateTimer=setTimeout(()=>{canvas.remove(stateText)},2e3)}function setMovableOption(e,t){switch(t){case 0:case 1:case 2:e.setControlsVisibility({bl:!1,br:!1,ml:!1,mt:!1,mr:!1,mb:!1,tl:!1,tr:!1,mtr:!1}),e.hasBorders=!1;break;case 3:case 4:case 5:{const t=e.left+e.width/2,n=e.top+e.height/2;e.set({originX:"center",originY:"center",left:t,top:n,angle:Math.random()*360,selectable:!1});break}case 6:case 7:case 8:{e.setControlsVisibility({mtr:!1});const t=(.5+Math.random())*canvas.width/10,n=(.5+Math.random())*canvas.height/10;e.set({scaleX:t/e.width,scaleY:n/e.height});break}case 9:case 10:case 11:{const t=(.5+Math.random())*canvas.width/10,n=(.5+Math.random())*canvas.height/10;e.set({scaleX:t/e.width,scaleY:n/e.height});const s=e.left+e.width/2,o=e.top+e.height/2;e.set({originX:"center",originY:"center",left:s,top:o,angle:Math.random()*360,selectable:!1});break}}}function addControlRect(e,t){e.setCoords();const o=e.getBoundingRect(),n=Math.max(o.width,o.height),i=new fabric.Rect({originX:"center",originY:"center",left:e.left,top:e.top,width:n,height:n,opacity:0,selectable:!1});canvas.add(i);const s=new fabric.Group([i,e],{originX:"center",originY:"center",width:n,height:n,opacity:e.opacity,transparentCorners:!1,cornerStyle:"circle"});return t<9&&s.setControlsVisibility({bl:!1,br:!1,ml:!1,mt:!1,mr:!1,mb:!1,tl:!1,tr:!1}),canvas.add(s),s}function addScoreText(){const e=((Date.now()-startTime)*1e3/1e6).toFixed(3),t=`${e} sec!`,n=canvas.width/8;scoreText=new fabric.Text(t,{fontSize:n,left:canvas.width/2,top:canvas.height/2,originX:"center",originY:"center",selectable:!1,fill:"blue"}),setTimeout(()=>{canvas.add(scoreText),canvas.sendToBack(scoreText)},2e3)}function setCorrectPiece(e){e.setAttribute("fill","violet"),correctCount+=1,correctCount==stateNames.length?(playAudio("correctAll"),addScoreText()):playAudio("correct",.3);const n=getStateId(e),t=stateNames[n];addStateText(t),speak(t)}function adjustElementPosition(e){const s=e.width*e.scaleX,o=e.height*e.scaleY,t=s/2,n=o/2;if(e.left<t)e.set({left:t});else if(canvas.width<e.left+t){const n=canvas.width-t;e.set({left:n})}if(e.top<n)e.set({top:n});else if(canvas.height<e.top+n){const t=canvas.height-n;e.set({top:t})}e.setCoords()}function setPieceGuideEvent(e,t){let n=0;t.on("mousedown",t=>{document.getElementById("guide").replaceChildren();const s=Date.now();if(s-n<200){const n=t.e,s=n instanceof TouchEvent?n.touches[0]:n,o=s.pageX,i=s.pageY-30,a=getStateId(e),r=stateNames[a],c=`
        <div class="tooltip show" role="tooltip"
          style="position:absolute; inset:0px auto auto 0px; transform:translate(${o}px,${i}px);">
          <div class="tooltip-inner">${r}</div>
        </div>
      `;document.getElementById("guide").innerHTML=c}n=s})}function setMovable(e,t,n){new fabric.loadSVGFromString(t.outerHTML,(t,s)=>{const o=fabric.util.groupSVGElements(t,s);if(o.set({left:getRandomInt(0,canvas.width/2),top:getRandomInt(0,canvas.height/2)}),o.set({left:o.left+o.width/2,top:o.top+o.height/2,originX:"center",originY:"center",transparentCorners:!1,cornerStyle:"circle"}),setMovableOption(o,n),canvas.add(o),o.selectable)setPieceGuideEvent(e,o),o.on("modified",()=>{playAudio("modified"),checkPosition(e,o)?(canvas.remove(o),setCorrectPiece(e)):adjustElementPosition(o)});else{const t=addControlRect(o,n);setPieceGuideEvent(e,t),t.on("modified",()=>{playAudio("modified"),o.set("angle",o.angle+t.angle),o.setCoords();const n=o.getBoundingRect(),s=Math.max(n.width,n.height);t.set({angle:0,width:s,height:s}),checkSpinnedPosition(e,t,o)?(t.getObjects().forEach(e=>{canvas.remove(e)}),canvas.remove(t),setCorrectPiece(e)):adjustElementPosition(t)})}})}function getSVGScale(e,t){const n=t.querySelector("svg"),s=n.getAttribute("viewBox").split(" ")[2],o=e.getBoundingClientRect();return o.width/Number(s)}function shuffleSVG(){canvas.clear();const t=document.getElementById("gradeOption").selectedIndex,n=map.contentDocument,s=getSVGScale(map,n),e=n.querySelectorAll(".main");switch(e.forEach(e=>{e.removeAttribute("fill");const n=getPieceSvg(e,s);setMovable(e,n,t)}),t%3){case 0:e.forEach(e=>{e.setAttribute("fill","#fefee4"),e.setAttribute("stroke-width",1)});break;case 1:e.forEach(e=>{e.setAttribute("fill","#fefee4"),e.setAttribute("stroke-width",0)});break;case 2:e.forEach(e=>{e.setAttribute("fill","none"),e.setAttribute("stroke-width",0)});break}}function startGame(){canvas||(canvas=initCanvas()),canvas.remove(scoreText),shuffleSVG(),correctCount=0,startTime=Date.now()}function setMapGuideMouseEvent(e){let t=0;e.on("mouse:down",e=>{const n=Date.now();if(n-t<200&&!e.target){const t=e.e,n=findPieceNodes(t.offsetX,t.offsetY);n.forEach(e=>setMapGuideTooltip(t,e))}t=n})}function setMapGuideTouchEvent(e){let t=0;e.wrapperEl.addEventListener("touchstart",n=>{const s=Date.now();if(s-t<200){const t=n.changedTouches[0],s=e.findTarget(t);if(!s){const e=map.getBoundingClientRect(),n=t.pageX-e.left,s=t.pageY-e.top,o=findPieceNodes(n,s);o.forEach(e=>setMapGuideTooltip(t,e))}}t=s})}function findPieceNodes(e,t){const n=map.contentDocument.elementsFromPoint(e,t),s=n.filter(e=>e.classList.contains("main"));return s}function setMapGuideTooltip(e,t){const o=e.pageX,i=e.pageY-30,a=getStateId(t),r=stateNames[a],c=`
    <div class="tooltip show" role="tooltip"
      style="position:absolute; inset:0px auto auto 0px; transform:translate(${o}px,${i}px);">
      <div class="tooltip-inner">${r}</div>
    </div>
  `,n=document.getElementById("guide");n.insertAdjacentHTML("beforeend",c);const s=n.lastElementChild;s.onclick=()=>{s.remove()}}function initCanvas(){const e=map.getBoundingClientRect(),t=new fabric.Canvas("canvas",{left:e.left,top:e.top,width:e.width,height:e.height});return fabric.isTouchSupported?setMapGuideTouchEvent(t):setMapGuideMouseEvent(t),t.selection=!1,document.getElementById("canvas").parentNode.style.position="absolute",t}function resizePieces(){const t=map.getBoundingClientRect(),e=t.width/canvas.getWidth();canvas.setDimensions({width:t.width,height:t.height}),canvas.getObjects().forEach(t=>{t.left*=e,t.top*=e,t.scaleX*=e,t.scaleY*=e,t.setCoords()})}function calcStateTextLength(e,t){const n=Math.max(...t.map(e=>e.length));switch(e){case"ja":return n;case"en":return Math.ceil(n/1.5)}}function changeLang(){const e=document.getElementById("lang"),t=e.options[e.selectedIndex].value;location.href=`/india-map-puzzle/${t}/`}function getTTSLang(e){switch(e){case"en":return"en-US";case"ja":return"ja-JP"}}async function initStatesInfo(e){const t=await fetch(`/india-map-puzzle/data/${e}.lst`),n=await t.text();stateNames=n.trimEnd().split(`
`),stateTextLength=calcStateTextLength(e,stateNames)}const map=document.getElementById("map"),positionThreshold=20,scaleThreshold=.3,angleThreshold=20;let canvas,stateNames,stateText,stateTextLength,stateTimer,startTime,scoreText;initStatesInfo(htmlLang),document.getElementById("startButton").onclick=startGame,document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("lang").onchange=changeLang,document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0}),globalThis.addEventListener("resize",()=>{if(!canvas)return;resizePieces(),stateText&&stateText.set({left:canvas.width/2,top:canvas.height/2}),scoreText&&scoreText.set({left:canvas.width/2,top:canvas.height/2})})