var sb_menuLoc;//커스터마이징 메뉴 위치
var sb_loc;//테이블,그래프 등 기능사용할 위치
var sb_rangeObj=new Array();//이전에 선택했던 id값 저장됨

//마우스 드래그박스에 사용
var sb_dragBoxId="sb_dragBox";//드래그박스 div id값
var sb_xStartLoc;//첫클릭 x좌표
var sb_yStartLoc;//첫클릭 y좌표
var sb_dragRang={};

//css를 javascript로 적용(body하단에 javascript선언 해야되)
function sb_tb_cssTableUse(url){
	var cssLink=document.createElement("link");
	cssLink.href=url;
	cssLink.rel="stylesheet";
	cssLink.type="text/css";
	document.body.appendChild(cssLink);
}
//커스터 마이징 메뉴추가
function sb_MenuADD(locId){
	sb_menuLoc=document.getElementById(locId);//메뉴 넣을 위치
		sb_menuLoc.innerHTML=
		"<div class='sb_cmManuBar'>"
			+"<div id='sb_fontSizeTot'>"//글자크기
				+"<button id='sb_fontSizeBtn' class='sb_cm_btn'><img src='rk_img/font_size.png'/ title='글자크기'></button>"
				+"<input id='sb_fontSizeNum' type='text' value='13' title='글자크기'>"
			+"</div>"
			
			+"<div id='sb_fontWeightTot'>"//글자두께
				+"<button id='sb_fontWeightBtn' class='sb_cm_btn'><img src='rk_img/font_weight.png'/ title='글자두께'></button>"
			+"</div>"
			+"<div id='sb_fontSortTot'>"//글자 정렬
				+"<button id='sb_fontSortBtn_left' class='sb_cm_btn'><img src='rk_img/font_left.png'/ title='왼쪽 정렬'></button>"
				+"<button id='sb_fontSortBtn_center' class='sb_cm_btn'><img src='rk_img/font_center.png'/ title='가운데 정렬'></button>"
				+"<button id='sb_fontSortBtn_right' class='sb_cm_btn'><img src='rk_img/font_right.png'/ title='오른쪽 정렬'></button>"
			+"</div>"
			+"<div id='sb_fontColorTot1'>"
				+"<div id='sb_fontColorTot2'>"//글자색상
					+"<button id='sb_fontColorBtn' class='sb_cm_btn'><img src='rk_img/font_color.png'/ title='글자색상'></button>"
					+"<div id='sb_fontColorDiv' style='background-color:#000' title='색상변경'></div>"
				+"</div>"
				+"<div id='sb_fontColor_palettet'></div>"
			+"</div>"
			+"<div id='sb_celBgColorTot1'>"
				+"<div id='sb_celBgColorTot2'>"//배경색상
					+"<button id='sb_celBgColorBtn' class='sb_cm_btn'><img src='rk_img/back_color.png'/ title='글자색상'></button>"
					+"<div id='sb_celBgColorDiv' style='background-color:#000' title='색상변경'></div>"
				+"</div>"
				+"<div id='sb_celBgColor_palettet'></div>"
			+"</div>"
			+"<div id='sb_fontOrderTot'>"//오름차순 내림차순
				+"<button id='sb_fontAscBtn' class='sb_cm_btn'><img src='rk_img/asc.png'/ title='오름차순'></button>"
				+"<button id='sb_fontDescBtn' class='sb_cm_btn'><img src='rk_img/desc.png'/ title='내림차순'></button>"
			+"</div>"
		+"</div>";
}

//커스터 마이징 기능 작동
function sb_MenuUse(locId){
	sb_tb_EventDragRange(locId);//셀 드래그 기능(테이블)
	sb_tb_fontSize();//글자크기 변경(테이블)
	sb_tb_fontWeight();//글자두께 변경(테이블)
	sb_tb_fontSort();//글자정렬 변경(테이블)
	sb_tb_fontColor();//글자색 변경(테이블)
	sb_tb_bgColor();//셀배경색 변경(테이블)
	sb_tb_colorPalette();//palette창 열기(테이블)
	sb_tb_sortAscDesc();//오름차순,내림차순
}

//커스터마이징 모드 종료
function sb_MenuClear(){
	//커스터마이징 메뉴 html삭제
	sb_menuLoc.innerHTML="";
	
	//중시시켰던 이벤트 작동 복구
	document.ondragstart = new Function('return true');// 드래그 가능
	document.onselectstart = new Function('return true');// 선택 가능
	
	//이벤트 효과 초기화
	sb_loc="";
	sb_tb_clearColor();//모든 색상 이전으로 원상복구
	
	//전역변수중 데이터 많은 것 초기화
	sb_rangeObj=new Array();
}
//모든 색상 이전으로 원상복구
function sb_tb_clearColor(){
	for(key in sb_rangeObj){//선택된 셀들 찿음
		if(document.getElementById(key)){
			//document.getElementById(key).style.backgroundColor="";//선택된 셀들 style값 초기화;
			document.getElementById(key).style.backgroundColor=sb_rangeObj[key]["beforbgColor"];//셀해제시 이전색상값 복귀
		}
	}
}
//드래그 이벤트 효과
//드래그 이벤트(테이블)(드래그로 범위잡고 원하는기능적용)
function sb_tb_EventDragRange(locId){
	sb_loc=document.getElementById(locId);//테이블,그래프 등 기능사용할 위치
	//이벤트 작동 중지
	document.ondragstart = new Function('return false');// 드래그 방지
	document.onselectstart = new Function('return false');// 선택 방지
	
	//마우스누른상태일 때(mousemove이벤트 시작)
	sb_loc.addEventListener("mousedown",function(ev1){//마우스누른 이벤트시작
		//마우스 왼쪽 버튼 누를때만 작동
		if(ev1.button==0){//마우스(왼쪽 0,오른쪽2)
			if(!sb_loc){//커스터마이징 모드 중지시 mouseup 종료
				this.removeEventListener("mousedown",arguments.callee);
			}else{
				sb_tb_oneData();//셀하나선택
				sb_tb_dragBox_make();//드래그박스 생성
				//마우스 누르고 있는 상태에서 움직일때 함수실행
				sb_loc.addEventListener("mousemove",sb_tb_dragBox_move);//마우스이동시 이벤트시작
			}
		}
	});
	//마우스를 뗏을 떄(mousemove이벤트 종료)
	sb_loc.addEventListener("mouseup",function(ev1){//마우스 뗏을때
		if(ev1.button==0){//마우스(왼쪽 0,오른쪽2)
			if(!sb_loc){//커스터마이징 모드 중지시 mouseup 종료
				this.removeEventListener("mouseup",arguments.callee);
			}else{
				sb_loc.removeEventListener("mousemove",sb_tb_dragBox_move);//마우스이동시 이벤트중지
				sb_tb_dragBox_remove();//드래그박스 제거
				sb_tb_manyData();//셀여러개선택,임시저장(테이블)
			}
		}
	});
	//마우스가 테이블 범위 밖으로 나갔을때(mousemove이벤트 종료)
	sb_loc.addEventListener("mouseleave",function(ev1){//마우스누른상태해제 이벤트시작
		if(ev1.button==0){//마우스(왼쪽 0,오른쪽2
			if(!sb_loc){//커스터마이징 모드 중지시 mouseleave이벤트 종료
				this.removeEventListener("mouseleave",arguments.callee);
			}else{
				sb_loc.removeEventListener("mousemove",sb_tb_dragBox_move);//마우스이동시 이벤트중지
				sb_tb_dragBox_remove();//드래그박스 제거
			}
		}
	});
}
//셀하나선택,임시저장(테이블)
function sb_tb_oneData(){
	if(sb_rangeObj){//선택된 셀이 있다면
		sb_tb_clearColor();//모든 색상 이전으로 원상복구
		sb_rangeObj={};//선택된 셀들 id값 모두 지워
	}
	//sb_rangeObj[event.target.id]=event.target;//선택된 셀 id값과 모든 정보를 담는다(object에)
	if(!sb_rangeObj[event.target.id]){//id값을 처음 넣을때 이전색상값을 넣어줌(셀해제시 이전색상값 복귀)
		sb_rangeObj[event.target.id]={"beforbgColor":event.target.style.backgroundColor};//이전색상저장
	}
	event.target.style.backgroundColor="#EFF8FB";//선택된 셀 background-color값 설정
	
}
//셀여러개선택,임시저장(테이블)
function sb_tb_manyData(){
	var tableTag=document.getElementById(newTableId);//태이블 태그를 가져온다(left, top위치를 가져오기위해)
	var ths=sb_loc.getElementsByTagName("th");
	var tds=sb_loc.getElementsByTagName("td");

	sb_tb_manyData2(tableTag,ths);//th태그
	sb_tb_manyData2(tableTag,tds);//td태그
	
}
function sb_tb_manyData2(tableTag,thd){
	//tr태그
	for(var i=0; i<thd.length; i++){
		var tbLeftLocS=(Number(thd[i].offsetLeft)+Number(tableTag.offsetLeft));//좌측시작+태이블left값
		var tbLeftLocE=((Number(thd[i].offsetLeft)+Number(thd[i].offsetWidth))+Number(tableTag.offsetLeft));//(좌측시작+넓이)+태이블left값
		var tbTopLocS=(Number(thd[i].offsetTop)+Number(tableTag.offsetTop));//상단시작+태이블top값
		var tbTopLocE=((Number(thd[i].offsetTop)+Number(thd[i].offsetHeight))+Number(tableTag.offsetTop));//(상단시작+높이)+태이블top값
		
		//드래그 범위내에있는 태그들 선택 
		if(
			(
				(
					(tbLeftLocS <= sb_dragRang["leftLocS"] && sb_dragRang["leftLocS"] <= tbLeftLocE) //내용좌측시작 < 드래그좌측시작 < 내용우측끝
					||
					(tbLeftLocS <= sb_dragRang["leftLocE"] && sb_dragRang["leftLocE"] <= tbLeftLocE) //내용좌측시작 < 드래그좌측종료 < 내용우측끝
				)
				||
				( 
					//3칸이상 포함할 때 가운데 있는 데이터도 포함시켜주기 위해
					(sb_dragRang["leftLocS"] <= tbLeftLocS && tbLeftLocS <= sb_dragRang["leftLocE"])
					||
					(sb_dragRang["leftLocS"] <= tbLeftLocE && tbLeftLocE <= sb_dragRang["leftLocE"])
				)
			)
			&&
			(
				(
					(tbTopLocS <= sb_dragRang["topLocS"]  && sb_dragRang["topLocS"] <= tbTopLocE) //내용상단시작 < 드래그상단시작 < 내용상단끝
					||
					(tbTopLocS <= sb_dragRang["topLocE"]  && sb_dragRang["topLocE"] <= tbTopLocE) //내용상단시작 < 드래그상단종료 < 내용상단끝
				)
				||
				(
					//3칸이상 포함할 때 가운데 있는 데이터도 포함시켜주기 위해
					(sb_dragRang["topLocS"] <= tbTopLocS && tbTopLocS <= sb_dragRang["topLocE"])
					||
					(sb_dragRang["topLocS"] <= tbTopLocE && tbTopLocE <= sb_dragRang["topLocE"])
				)
			)
		){ 
			if(!sb_rangeObj[thd[i].id]){//id값을 처음 넣을때 이전색상값을 넣어줌(셀해제시 이전색상값 복귀)
				sb_rangeObj[thd[i].id]={"beforbgColor":thd[i].style.backgroundColor};//이전색상저장
			}
			thd[i].style.backgroundColor="#EFF8FB";
		}
	}
}
//마우스 드래그시 박스형태 생성
function sb_tb_dragBox_make(){
	var dragBox=document.createElement("div");
	dragBox.setAttribute("id",sb_dragBoxId);
	dragBox.setAttribute("style","left:"+event.clientX+"px; top:"+event.clientY+"px;");
	sb_loc.appendChild(dragBox);//테이블 테그안에 넣는다
	
	//마우스 클릭한 x,y좌표(시작점)
	sb_xStartLoc=event.clientX;
	sb_yStartLoc=event.clientY;
}
//마우스 드래그시 박스형태 삭제
function sb_tb_dragBox_remove(){
	var dragBox=document.getElementById(sb_dragBoxId);
	if(dragBox){//이전에 삭제된 경우 다시 삭제 못하게 하기 위해
		//드래그한 최종범위 값을 저장
		var leftLocS=dragBox.offsetLeft;//좌측시작
		var leftLocE=Number(dragBox.offsetLeft)+Number(dragBox.offsetWidth);//좌측종료
		var topLocS=dragBox.offsetTop;//위시작
		var topLocE=Number(dragBox.offsetTop)+Number(dragBox.offsetHeight);//위종료
		
		//전역변수로 선언한 object에 범위값을 넣는다
		sb_dragRang["leftLocS"]=leftLocS;
		sb_dragRang["leftLocE"]=leftLocE;
		sb_dragRang["topLocS"]=topLocS;
		sb_dragRang["topLocE"]=topLocE;

		sb_loc.removeChild(dragBox);
	}
}
//마우스 드래그시 박스형태 작동(범위변경)
function sb_tb_dragBox_move(){
	var dragBox=document.getElementById(sb_dragBoxId);
	
	//드래그 박스 넓이,높이
	var wid;//넓이
	var hei;//높이

	//마우스 오른쪽 -> 왼쪽으로 드래그시(가로)
	if(event.clientX < sb_xStartLoc){//드래그이동 위치 < 첫클릭 위치
		dragBox.style.left=event.clientX+"px";
		wid=sb_xStartLoc-event.clientX;
	//마우스 왼쪽 -> 오른쪽으로 드래그시(가로)
	}else if(event.clientX > sb_xStartLoc){
		wid=event.clientX-sb_xStartLoc;
	}else{
		wid=0;
	}
	
	//마우스 오른쪽 -> 왼쪽으로 드래그시(세로)
	if(event.clientY < sb_yStartLoc){
		dragBox.style.top=event.clientY+"px";
		hei=sb_yStartLoc-event.clientY;
	//마우스 왼쪽 -> 오른쪽으로 드래그시(세로)
	}else if(event.clientY > sb_yStartLoc){
		hei=event.clientY-sb_yStartLoc;
	}else{
		hei=0;
	}

	//드래그박스 넓이,높이 표기
	dragBox.style.width=wid+"px";
	dragBox.style.height=hei+"px";
}

//커스터마이징 기능
//글자크기 변경(테이블)
function sb_tb_fontSize(){
	var fsBtn=document.getElementById("sb_fontSizeBtn");//글자크기 버튼
	var fsSize=document.getElementById("sb_fontSizeNum");//글자크기 사이즈
	fsBtn.addEventListener("click",function(){
		for(key in sb_rangeObj){
			var getIdStyle=document.getElementById(key).style;
			getIdStyle.fontSize=fsSize.value+"px";
			//saveDataStyle(key,getIdStyle);
		}
	});
	fsSize.addEventListener("keyup",function(ev){
		if(ev.keyCode==13){
			for(key in sb_rangeObj){
				var getIdStyle=document.getElementById(key).style;
				getIdStyle.fontSize=fsSize.value+"px";
				//saveDataStyle(key,getIdStyle);
			}
		}
	});
}
//글자두께 변경(테이블)
function sb_tb_fontWeight(){
	var fwBtn=document.getElementById("sb_fontWeightBtn");//글자두께 버튼
	fwBtn.addEventListener("click",function(){
		for(key in sb_rangeObj){
			var fwVal=document.getElementById(key).style;
			
			if(fwVal.fontWeight=="bold"){
				fwVal.fontWeight="normal";
			}else{
				fwVal.fontWeight="bold";
			}
		}
	});
}
//글자정렬 변경(테이블)
function sb_tb_fontSort(){
	var fslBtn=document.getElementById("sb_fontSortBtn_left");//글자정렬 왼쪽버튼
	var fscBtn=document.getElementById("sb_fontSortBtn_center");//글자정렬 가운데버튼
	var fsrBtn=document.getElementById("sb_fontSortBtn_right");//글자정렬 오른쪽버튼
	fslBtn.addEventListener("click",function(){
		for(key in sb_rangeObj){
			var fslVal=document.getElementById(key).style;
			fslVal.textAlign="left";
		}
	});
	fscBtn.addEventListener("click",function(){
		for(key in sb_rangeObj){
			var fscVal=document.getElementById(key).style;
			fscVal.textAlign="center";
		}
	});
	fsrBtn.addEventListener("click",function(){
		for(key in sb_rangeObj){
			var fsrVal=document.getElementById(key).style;
			fsrVal.textAlign="right";
		}
	});
}
//글자색 변경(테이블)
function sb_tb_fontColor(){
	var fcBtn=document.getElementById("sb_fontColorBtn");//글자색 변경버튼
	var fcDiv=document.getElementById("sb_fontColorDiv");//글자색 지정된 div
	fcBtn.addEventListener("click",function(){
		for(key in sb_rangeObj){
			var fcVal=document.getElementById(key).style;
			fcVal.color=fcDiv.style.backgroundColor;
		}
	});
}
//셀배경색 변경(테이블)
function sb_tb_bgColor(){
	var fcBtn=document.getElementById("sb_celBgColorBtn");//셀배경색 변경버튼
	var fcDiv=document.getElementById("sb_celBgColorDiv");//글자색 지정된 div
	fcBtn.addEventListener("click",function(){
		for(key in sb_rangeObj){
			var fcVal=document.getElementById(key).style;
			fcVal.backgroundColor=fcDiv.style.backgroundColor;
			sb_rangeObj[key]={"beforbgColor":fcDiv.style.backgroundColor};//색상 저장(안하면 원래배경색으로 복귀함)
		}
	});
}
//글자색 palette창 열기(테이블)
function sb_tb_colorPalette(){
	var fcDiv=document.getElementById("sb_fontColorDiv");//글자색 지정된 div
	var bgDiv=document.getElementById("sb_celBgColorDiv");//글자배경색 지정된 div
	
	fcDiv.addEventListener("click",function(){
		rk_colorPalette_init("sb_fontColor_palettet");//palette창을 호출할 div
		rk_openPalette();//palettet 창띄우기
		
		//div배경화면에 색상보여짐 설정(rk_colorPalette_v1.0.js)
		rk_colorVal=[
			{"id":"sb_fontColorDiv","type":"bk"}
		];
	});
	bgDiv.addEventListener("click",function(){
		rk_colorPalette_init("sb_celBgColor_palettet");//palette창을 호출할 div
		rk_openPalette();//palettet 창띄우기
		
		//div배경화면에 색상보여짐 설정(rk_colorPalette_v1.0.js)
		rk_colorVal=[
			{"id":"sb_celBgColorDiv","type":"bk"}
		];
	});	
}
//오름차순 내림차순
function sb_tb_sortAscDesc(){
	var ascBtn=document.getElementById("sb_fontAscBtn");
	var descBtn=document.getElementById("sb_fontDescBtn");
	
	//오름차순버튼 클릭시
	ascBtn.addEventListener("click",function(){
		//cel값을 하나만 선택하게
		var keyLength=Object.keys(sb_rangeObj).length;
		if(keyLength>1){
			alert("셀 하나만 선택해주세요");
		}else if(keyLength==0){
			alert("셀을 선택해주세요");
		}else{
			sb_tb_sortAscDescCal("asc",Object.keys(sb_rangeObj));//key값
		}
	});
	//내림차순버튼 클릭시
	descBtn.addEventListener("click",function(){
		//cel값을 하나만 선택하게
		var keyLength=Object.keys(sb_rangeObj).length;
		if(keyLength>1){
			alert("셀 하나만 선택해주세요");
		}else if(keyLength==0){
			alert("셀을 선택해주세요");
		}else{
			sb_tb_sortAscDescCal("desc",Object.keys(sb_rangeObj));//key값
		}
	});
}
//오름차순 내림차순 계산
function sb_tb_sortAscDescCal(type,key){
	var id=key[0].split("_");//con_아이디값_01 이런식으로 저장되있음

	var keyLoc;//데이터에서 위 id값이 몇번째 배열에 있는지
	for(var i=0; i<sb_tb_dataSet[0].length; i++){
		if(sb_tb_dataSet[0][i].colId==id[1]){
			keyLoc=i;
		}
	}
	
	//오름차순
	if(type=="asc"){
		sb_tb_dataSet.sort(function(a1,b1){
			//숫자형 타입
			if(typeof(a1[keyLoc]["value"])=="number" || typeof(b1[keyLoc]["value"])=="number"){
				return a1[keyLoc]["value"] - b1[keyLoc]["value"];
			//문자열 타입
			}else if(typeof(a1[keyLoc]["value"])=="string" || typeof(b1[keyLoc]["value"])=="string"){
				if(a1[keyLoc]["value"] < b1[keyLoc]["value"]) return -1;
				else if(a1[keyLoc]["value"] > b1[keyLoc]["value"]) return 1;
				else return 0;
			}
		});
	//내림차순
	}else if(type=="desc"){
		sb_tb_dataSet.sort(function(a1,b1){
			//숫자형 타입
			if(typeof(a1[keyLoc]["value"])=="number" || typeof(b1[keyLoc]["value"])=="number"){
				return b1[keyLoc]["value"] - a1[keyLoc]["value"];
			//문자열 타입
			}else if(typeof(a1[keyLoc]["value"])=="string" || typeof(b1[keyLoc]["value"])=="string"){
				if(a1[keyLoc]["value"] > b1[keyLoc]["value"]) return -1;
				else if(a1[keyLoc]["value"] < b1[keyLoc]["value"]) return 1;
				else return 0;
			}
		});
	}
	
	//스타일 정보를 저장
	saveDataStyle();
	//테이블 값 새로출력
	newTbody.innerHTML="";//이전테이블값 초기화
	sb_tb_Content(function(row){});
}
//스타일 정보를 저장(테이블 초기화 혹은 오름,내림차순시 기존 출력데이터를 지우고 새로 뿌리기때문)
function saveDataStyle(){
	for(var i=0; i<sb_tb_dataSet.length; i++){
		for(var j=0; j<sb_tb_dataSet[i].length; j++){
			
			var getIdStyle=document.getElementById(sb_tb_dataSet[i][j].id).style;
			var empStyle="";//스타일 임시저장

			if(getIdStyle.fontSize){//글자크기
				empStyle+="font-size:"+getIdStyle.fontSize+";";
			}if(getIdStyle.fontWeight){//글자두께
				empStyle+="font-weight:"+getIdStyle.fontWeight+";";
			}if(getIdStyle.textAlign){//글자정렬
				empStyle+="text-align:"+getIdStyle.textAlign+";";
			}if(getIdStyle.color){//글자색
				empStyle+="color:"+getIdStyle.color +";";
			}if(getIdStyle.backgroundColor){//배경색
				empStyle+="background-color :"+getIdStyle.backgroundColor +";";
			}
			sb_tb_dataSet[i][j].style=empStyle;
		}
	}

}