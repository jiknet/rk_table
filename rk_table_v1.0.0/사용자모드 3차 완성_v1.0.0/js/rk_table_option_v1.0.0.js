var locHtml="";//태이블태그 들어갈 div
var newTable="";//태이블태그
var newThead="";//테이블 제목태그
var newTbody="";//테이블 데이터태그
var newTableId="sb_table";

var sb_tb_dataSet=new Array();//데이터 id, value, style, rowspan, colspan 등등 값들을 통합셋팅

//데이터값 저장
function sb_tb_dataSave(val){
	var dataSet=new Array();//1차원배열 선언
	var count=0;
	for(i in val){
		dataSet[i]=new Array();//2차원 배열선언
		
		for(key in val[i]){
			dataSet[i][count]={};//object형 선언
			//object형식으로 값을 넣는다
			dataSet[i][count]["id"]="con_"+key+"_"+i;
			dataSet[i][count]["rowLoc"]=i;//가로줄의 몇번쨰 줄인지
			dataSet[i][count]["colId"]=key;//세로줄의 몇번쨰 줄인지
			dataSet[i][count]["value"]=val[i][key];
			dataSet[i][count]["style"]="";
			dataSet[i][count]["colspan"]="";
			dataSet[i][count]["rowspan"]="";
			
			count++;
		}
		count=0;
	}
	sb_tb_dataSet=dataSet;//데이터 셋팅 object형식을 전역변수에 저장
}
//css를 javascript로 적용(body하단에 javascript선언 해야되)
function sb_tb_cssTableOption(url){
	var cssLink=document.createElement("link");
	cssLink.href=url;
	cssLink.rel="stylesheet";
	cssLink.type="text/css";
	document.body.appendChild(cssLink);
}
//div에 태이블태그 넣기, class명 넣기
function sb_tb_Loc(locId){
	locHtml=document.getElementById(locId);//태이블태그 들어갈 div
	newTable=document.createElement("table");//태이블태그
	newTable.setAttribute("class",newTableId);//class=tg
	newTable.setAttribute("id",newTableId);//class=tg
	//이거 추가야해야 엑셀, 인쇄할 때 테두리 추가됨
	newTable.setAttribute("border",'1');
	newTable.setAttribute("cellspacing", '0');
	newTable.setAttribute("cellpadding", '0');
	
	locHtml.appendChild(newTable);//div에 table태그 넣기
}
//해더값 넣기(2줄 이상일 때)
function sb_tb_Header(headerTot){
	newThead=document.createElement("thead");//thead태그
	newTable.appendChild(newThead);//table태그에 thead태그넣기
	
	//타이틀 1줄일 경우 2중배열 아닌 상태로 데이터 넘겼을 경우 2중배열을 만들어줘야 아래 for문이 정상적으로 돌아감
	if(headerTot[0].length==null){
		var tempData=[];
		tempData.push(headerTot)
		headerTot=tempData;	
	}
	
	for(var i=0; i<headerTot.length; i++){
		var newTr=document.createElement("tr");//tr태그
		for(var j=0; j<headerTot[i].length; j++){
			var newTh=document.createElement("th");//th태그
				newTh.setAttribute("id","hd_"+headerTot[i][j]["id"]+"_"+i+j);//고유 id값 부여(커스터마이징에 사용)(ex> hd_dept_01)
				newTh.setAttribute("style","background-color:#F2F2F2");//css가 아닌 javascript에서 배경색 넣어야 style값 읽을수 있어
			if(headerTot[i][j]["colspan"]){
				newTh.setAttribute("colspan",headerTot[i][j]["colspan"]);//colspan값
			}if(headerTot[i][j]["rowspan"]){
				newTh.setAttribute("rowspan",headerTot[i][j]["rowspan"]);//rowspan
			}
			newTh.innerHTML=headerTot[i][j]["name"];//타이틀명
			newTr.appendChild(newTh);//tr태그에 th태그 넣기
		}
		newThead.appendChild(newTr);//thead태그에 tr태그넣기
	}
}
//완성본(innerHTML로 넣기)
function sb_tb_Content(fctRow){//데이터, 콜백(출력시 데이터 값 수정가능)
	newTbody=document.createElement("tbody");
	newTbody.setAttribute("id","sb_tbody");//id값 넣어주기(오름,내림차순 사용시)
	newTable.appendChild(newTbody);
	
	for(var i=0; i<sb_tb_dataSet.length; i++){
		var newTr=document.createElement("tr");
		for(var j=0; j<sb_tb_dataSet[i].length; j++){
			var dataSet=sb_tb_dataSet[i][j];//정리
			fctRow(dataSet);//콜백 함수
			newTr.innerHTML+="<td id='"+dataSet.id+"' style='"+dataSet.style+"' rowspan='"+dataSet.rowspan+"' colspan='"+dataSet.colspan+"'>"+dataSet.value+"</td>";
		}
		newTbody.appendChild(newTr);
	}
}