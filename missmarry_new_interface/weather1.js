// 必要檔案
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;//宣告xhr來使用
var xhr = new XMLHttpRequest();
var util=require('util');
let fs = require("fs");
//APPKEY
var Weather_APPID='CWB-C1AA8413-652F-403D-8A04-178A8577CE23';
var Geo_APPID='AIzaSyB4gLksvzD8WylzjZbVIjditqhCmVFw7G0';
//地理位置判定
var lat=23.707929;//測試用
var lng=120.542191;//測試用

var locationsName; 
var xiangzhenName;
xhr.open('get','https://maps.google.com/maps/api/geocode/json?latlng='+lat+','+lng+'&language=zh-TW&sensor=true&key='+Geo_APPID,false);
xhr.send(null);
// console.log('https://maps.google.com/maps/api/geocode/json?latlng='+lat+','+lng+'&language=zh-TW&sensor=true&key='+Geo_APPID);       
var  datalatlng = JSON.parse(xhr.responseText);// JSON.parse是string轉object,方便撈取資料
locationsName,xiangzhenName=find_geo_name(datalatlng);
    

//function
function find_geo_name(datalatlng){
    var xiangzhenValue=0;
    var locationsValue=0;

    //datalatlng.records.location[xiagzhenValue].locationName->weather
    while(datalatlng.results[0].address_components[xiangzhenValue].types[0]!="administrative_area_level_3"&&xiangzhenValue<4){
        xiangzhenValue++;

    }
  
    xiangzhenName=datalatlng.results[0].address_components[xiangzhenValue].long_name;
    while(datalatlng.results[0].address_components[locationsValue].types[0]!="administrative_area_level_1"&locationsValue<4){
        locationsValue++;

    }
    if(locationsValue>=4){
        locationsValue=0;
        while(datalatlng.results[0].address_components[locationsValue].types[0]!="administrative_area_level_2"&locationsValue<4){
            locationsValue++;
    
        }
    }
    // console.log(locationsValue);
    locationsName=datalatlng.results[0].address_components[locationsValue].long_name;
    
    // console.log(util.inspect(datalatlng, {showHidden:false, depth:null}));
  return locationsName,xiangzhenName;
}

//天氣判定


// console.log(locationsName);
const city=encodeURIComponent(locationsName);
var text = JSON.parse(fs.readFileSync("datafind.json", "utf-8"));//讀取文本datafind.json
var lValue=0;
var datastr1_cut,datastr2_cut;
var weather_in;
var today = new Date();
today=getDay(today);//取日期
// console.log(locationsName);
while(text[lValue].locationCity !=locationsName){
lValue++;
}
var find_type1=text[lValue].prodict[0].twoday;
var find_type2=text[lValue].prodict[1].week;
// console.log(lValue);


xhr.open('get','https://opendata.cwb.gov.tw/api/v1/rest/datastore/'+find_type1+'?Authorization='+Weather_APPID+'&format=JSON',false);
xhr.send(null);
var datastr1 = JSON.parse(xhr.responseText);// JSON.parse是string轉object,方便撈取資料
// console.log(util.inspect(datastr, {showHidden:false, depth:null}));//depth 防止多層資料

xhr.open('get','https://opendata.cwb.gov.tw/api/v1/rest/datastore/'+find_type2+'?Authorization='+Weather_APPID+'&format=JSON',false);
xhr.send(null);
var datastr2 = JSON.parse(xhr.responseText);// JSON.parse是string轉object,方便撈取資料

xiangzhen_weather_twoday_week(datastr1,datastr2);
//function
function getDay(today){
    
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today1 = yyyy+ '-' + mm + '-' + dd;
    // console.log(today1);
    return today1;
}
function write_in(data){
    
    data.replace(/\\/g,);
   
        fs.writeFile("weather.json", data, function(err) {
          console.log('寫入完成!');
        });
        
}
function write_add(data){
    var data1=JSON.stringify(data);
         fs.writeFile("weather.txt", data1, function(err) {
           console.log('寫入完成!');
         });
 }
function xiangzhen_weather_twoday_week(datastr1,datastr2){
    var xiangzhenValue2=0;
    while(datastr1.records.locations[0].location[xiangzhenValue2].locationName!=xiangzhenName){
        xiangzhenValue2++;
    }
    var xiangzhenValue3=0;
    while(datastr2.records.locations[0].location[xiangzhenValue3].locationName!=xiangzhenName){
        xiangzhenValue3++;
    }
    datastr1_cut=datastr1.records.locations[0].location[xiangzhenValue2];
    datastr2_cut=datastr2.records.locations[0].location[xiangzhenValue3];
    weather_in="{\"weather\":{\"locationName\" : \""+datastr1_cut.locationName+"\",";
   
    twoday_add(datastr1_cut,datastr2_cut);
    // console.log(weather_in);
}

function twoday_add(datastr1_cut,datastr2_cut){
    var di1=0,di2=0;
    var temp_in1="\"typeCover\":"+"[{\"type\":\"PoP6h\",\"PoP6hValue\":[";
    var temp_in2,temp_in3,temp_in4,temp_in5,temp_in6,temp_in7="";
    // var endday=todayaddDay(today,8);
    // console.log(datastr2_cut.weatherElement[9]);
    var endday=todayaddDay(today,8);
    
  while(di2<7){
    if(di1==0){
        var days=new Date();
        if(days.getHours()>=21){
           today= todayaddDay(today,1);
            
            
        }
        
        weather_in+="\"day\" :[ \""+today+"\",{\"time\" :[";
    
    
    // console.log(datastr1_cut.weatherElement[7]);
    for(var i=0;i<=4;i++){
        
        if(datastr1_cut.weatherElement[7].time[i].startTime.match(today)){
            
            weather_in+="\""+datastr1_cut.weatherElement[7].time[i].startTime+"\"";
            //PoP6h
            temp_in1+="\""+datastr1_cut.weatherElement[7].time[i].elementValue[0].value+"%\"";
           
            
            if(datastr1_cut.weatherElement[7].time[i+1].startTime.match(today)){
                weather_in+=",";
                temp_in1+=",";
                
                
            }else{
                weather_in+="],";
                temp_in1+="]},";
                
                
            }
            }
        }
        weather_in+=temp_in1;//end
    //Wx
    console.log(datastr1_cut.weatherElement[1]);
    temp_in1="{\"type\":\"Wx\",\"WxValue\":[";
    temp_in2="{\"type\":\"T\",\"TValue\":[";
    temp_in3="{\"type\":\"WS\",\"WSValue\":[";
    temp_in4="{\"type\":\"RH\",\"RHValue\":[";
    temp_in5="{\"type\":\"WeatherDescription\",\"WeatherDescriptionValue\":[";
    for(var i=0;i<=8;i++){
        if(datastr1_cut.weatherElement[1].time[i].startTime.match(today)){
            
            //Wx
            temp_in1+="\""+datastr1_cut.weatherElement[1].time[i].elementValue[0].value+"\"";
            //T
            temp_in2+="\""+datastr1_cut.weatherElement[3].time[i].elementValue[0].value+"\"";
             //WS
             temp_in3+="\""+datastr1_cut.weatherElement[8].time[i].elementValue[0].value+"公尺/秒\"";
             //RH
             temp_in4+="\""+datastr1_cut.weatherElement[5].time[i].elementValue[0].value+"%\"";
             //weatherDescription
             temp_in5+="\""+datastr1_cut.weatherElement[6].time[i].elementValue[0].value+"\"";
            if(datastr1_cut.weatherElement[1].time[i+1].startTime.match(today)){
             
                temp_in1+=",";
                temp_in2+=",";
                temp_in3+=",";
                temp_in4+=",";
                temp_in5+=",";
            }else{
                
                temp_in1+="]},";
                temp_in2+="]},";
                temp_in3+="]},";
                temp_in4+="]},";
                temp_in5+="]},";
            }
            
        }
    }
    // console.log(datastr2_cut.weatherElement[9])
    for(var i=0;i<3;i++){
        temp_in6="{\"type\":\"UVI\",\"UVIValue\":[";
        if(datastr2_cut.weatherElement[0].time[i].startTime.match(today)){
            temp_in6+="\""+datastr2_cut.weatherElement[9].time[i].elementValue[0].value+"\"";
        }
        if(datastr2_cut.weatherElement[0].time[i+1].startTime.match(today)){
            temp_in6+=",";
        }else{
            temp_in6+="]}]},";
        }
            
        }
       
    
    }//if 到這邊
    else{
            //weak
        today=todayaddDay(1,di2);
        temp_in1= "\""+today+"\",";
        temp_in2="{\"time\":[";
        temp_in3="\"typeCover\":[";
        temp_in4="{\"type\":\"PoP12h\",\"PoP12Value\":[";
        temp_in5="{\"type\":\"T\",\"TValue\":[";
        temp_in6="{\"type\":\"RH\",\"RHValue\":[";
        temp_in7="{\"type\":\"UVI\",\"UVIValue\":[";

        // console.log(datastr2_cut.weatherElement[1]); 
        var i=di2*2+1;
        
        
        
        
        while(i<=di2*2+2){
            
         
            if(datastr2_cut.weatherElement[0].time[i].startTime.match(today)){
            //time
            temp_in2+="\""+datastr2_cut.weatherElement[0].time[i].startTime+"\"";
           
            //PoP12h
            temp_in4+="\""+datastr2_cut.weatherElement[0].time[i].elementValue[0].value+"\"";
            //T
            temp_in5+="\""+datastr2_cut.weatherElement[1].time[i].elementValue[0].value+"\"";
            //RH
            temp_in6+="\""+datastr2_cut.weatherElement[2].time[i].elementValue[0].value+"\"";
            
            
            }
            if(datastr2_cut.weatherElement[0].time[i].endTime.match("06:00:00")){
                temp_in2+="],";
                temp_in4+="]},";
                temp_in5+="]},";
                temp_in6+="]},";
                 
                
            }else{
                temp_in2+=",";
                temp_in4+=",";
                temp_in5+=",";
                temp_in6+=",";
                
                
                
            }
            if(datastr2_cut.weatherElement[0].time[i].endTime.match("18:00:00")){
                //UVI
            temp_in7+="\""+datastr2_cut.weatherElement[9].time[di2].elementValue[0].value+"\"";
            temp_in7+="]}]},";
            }
           
             i++;
        }
    }//else
    
    weather_in+=temp_in1+temp_in2+temp_in3+temp_in4+temp_in5+temp_in6+temp_in7;//end

    di1++;
    di2++;
    

    // console.log( weather_in);
  }
  write_in(weather_in+"{\"none\":\"NO\"}]}}");
    
    
    


}
function todayaddDay(theday,n){
    var days = new Date();
    days=days.setDate(days.getDate()+n);
    theday=new Date(days);
    theday=getDay(theday);
    return theday;
}
