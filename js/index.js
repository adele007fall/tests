(() => {
    let Y = 0; // Yoffset 
    let prevY = 0;  // 이전 스크롤 높이
    let curY = 0;   //현재 스크롤 
    let enterFlag = false;  // 섹션 변경 플래그 

    const sceneInfo = [
        {
            type:'A', // TYPE 이 A이면 STICKY B 이면 NORMAL
            x: 5,
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#section0'),
                desc_1: document.querySelector('#section0 .desc_1'),
                desc_2: document.querySelector('#section0 .desc_2'),
                desc_3: document.querySelector('#section0 .desc_3'),
                desc_4: document.querySelector('#section0 .desc_4'),
                canvas: document.querySelector('#video_0'),
                context: document.querySelector('#video_0').getContext('2d'),
                videoImages: []
            },
            vals: {
                videoCount: 1018,
                videoSeq: [0,1017],
                dsc_1_oc : [0,1, { start:0.1, end: 0.2 }],
                dsc_2_oc : [1,0, { start:0.3, end: 0.4 }],
                dsc_1_oc_off : [1,0, { start:0.25, end: 0.3 }]
            }
        }, 
        {
            type:'B',
            x: 3,
            scrollHeight: 0,
            objs:{
                container : document.querySelector('#section1')
            }
        },
        {
            type:'A',
            x: 5,
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#section2')
            }
        },
        {
            type:'B',
            x: 5,
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#section3')
            }
        }
    ];
    

    function canvasImgs(){
        let img;
        for(let i = 1; i<sceneInfo[0].vals.videoCount; i++){ 
            img = new Image();
            if(i.toString().length < 2){
                img.src = `../imgs/pexels-mart-production-7565881${" 000"+i}.JPG`; 
            }
            else if(i.toString().length < 3){ 
                img.src = `../imgs/pexels-mart-production-7565881${" 00" + i}.JPG`;
            }else if(i.toString().length <4){ 
                img.src = `../imgs/pexels-mart-production-7565881${" 0"+ i}.JPG`;
            }else if(i.toString().length <5){ 
                img.src = `../imgs/pexels-mart-production-7565881${" "+i}.JPG`;
            } 
            sceneInfo[0].objs.videoImages.push[img];
        }
    }
    canvasImgs();

    function calc(val, scrolled){   // 섹션별 스크롤 된 높이 값에 따른 속성부여
        let returnVal; 
        let Ratio = scrolled / sceneInfo[curY].scrollHeight;
        if(val.length > 2){
            const start = val[2].start * sceneInfo[curY].scrollHeight;
            const end = val[2].end * sceneInfo[curY].scrollHeight;
            const AtoB = end - start; 
            if(scrolled >= start && scrolled <= end){
                returnVal = (scrolled - start ) / AtoB * (val[1]-val[0]) + val[0];
            }else if(scrolled < start){
                returnVal = val[0]
            }else if(scrolled > end){
                returnVal = val[1]
            }
        }else{ 
            returnVal = Ratio * (val[1]-val[0]) + val[0];
        }
        return returnVal;
    }

    function swichScroll(){ //  스위치문 사용
        Y = window.pageYOffset;
        const objs = sceneInfo[curY].objs;
        const vals = sceneInfo[curY].vals;
        const curYoffset = Y-prevY;  
        const scrollHeight = sceneInfo[curY].scrollHeight;
        const curRatio = curYoffset / scrollHeight;

        switch (curY) {
            case 0:  
            let seq = Math.round(calc(vals.videoSeq, curYoffset));   
                objs.context.drawImage(objs.videoImages[seq], 0, 0); 
                const desc_1_on = calc(vals.dsc_1_oc, curYoffset);
                const desc_1_off =  calc(vals.dsc_1_oc_off, curYoffset);
                if(curRatio <= 0.22){
                    objs.desc_1.style.opacity = desc_1_on   
                }else{
                    objs.desc_1.style.opacity = desc_1_off   
                }
                break;            
            case 1:
                console.log("1Play") 
                break;
            case 2:
                console.log("2Play")
                break;            
            case 3:
                console.log("3Play")
                break;        
        }
    }
    function Layout(){  // 섹션 높이값 세팅, 
 
        for(let i=0; i < sceneInfo.length; i++){ 
            // 높이값 지정
            if(sceneInfo[i].type === "A"){
                sceneInfo[i].scrollHeight = sceneInfo[i].x * window.innerHeight;                
            }else if(sceneInfo[i].type === "B"){
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }  
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        let totalY = 0;
        
        Y = window.pageYOffset;
        for(let i = 0; i < sceneInfo.length; i++){
            totalY += sceneInfo[i].scrollHeight;
            if(totalY >= window.pageYOffset){
                curY = i;
                break;
            }
        }        
        swichScroll();  
    }
    
    function scrollLoop(){  //스크롤시 id값 추가
        enterFlag = false;
        prevY = 0;  
        Y = window.pageYOffset;    
        for(let i = 0; i <curY; i++){
            prevY += sceneInfo[i].scrollHeight;
        }
        if(Y > prevY + sceneInfo[curY].scrollHeight){ 
            enterFlag = true;
            curY++;
        }else if(Y < prevY){
            enterFlag = true; 
            if(curY === 0){
                return;
            }else{
                curY--;
            }
        }
        document.querySelector('.container').setAttribute('id',`active_${curY}`)
 
        if(enterFlag){
            return;
        }  
        swichScroll(); 
    }
    
    window.addEventListener('load',Layout); 
    window.addEventListener('resize', Layout);  // 리사이즈시 높이값 조절
    window.addEventListener('scroll',function(){
        scrollLoop(); 
    })
})();
    