/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var myData = new Data();
var orderArr = new Array();
var taxiArr = new Array();
var lpos = 0;
var rpos = 0;
var selected = null;
var leftID = -1;
var selectedIsLeft = false;
var selectedMatch = null;
var rightID = -1;
var driverMappings = new Array();
function addItem(isLeft,text)
{
    var item;
    var tmpStr;
    var num;
    if(isLeft)
    {
        item = document.getElementById("leftTable");
        tmpStr = "tbl"+lpos;
        num = lpos;
        lpos++;
    }
    else
    {
        item = document.getElementById("rightTable");
        tmpStr = "tbr"+rpos;
        num = rpos;
        rpos++;
    }
    item.innerHTML = item.innerHTML + "<tr><td class='table_inner_entry' id='"+tmpStr+"' onclick='selectItem("+num+","+isLeft+")'>"+text+"</td></tr>";
}
function selectItem(id,isLeft)
{
    if(selectedIsLeft == isLeft)
    {
        changeSelection(id,isLeft);
    }
    else
    {
        connectSelections(id,isLeft);
    }
    if(isLeft)
    {
        var item = orderArr[id];
        document.getElementById("orderInfoBox").innerHTML = "<table><tr><td>Körningsinfo: <br>Passagerarantal: "+item.passengers+"</td></tr><tr><td>Åktid: "+item.gotime+"</td></tr><tr><td>Avrese-punkt: "+item.frompos+"</td></tr><tr><td>Destination: "+item.destpos+"</td></tr><tr><td>Specialbehov: "+item.specneeds+"</td></tr>";
        document.getElementById("orderInfoBox").style.display = "table-cell";
    }
    else
    {
        document.getElementById("taxiInfoBox").innerHTML = "<table><tr><td>Taxi-info:</td></tr><tr><td>Förare: <span id='idInfoDriver'>Cave Johnson</span></td></tr><tr><td>Registreringsnummer: <span id='idInfoLicense'>ABC123</span></td></tr><tr><td>Biltyp: <span id='idInfoType'>Volvo v70</span></td></tr><tr><td>Specialutrustning: <span id='idInfoSpecials'>Rullstol</span>";
        document.getElementById("taxiInfoBox").style.display = "table-cell";
    }
}
function makeReadableTime(input)
{
    return input[0]+":"+input[1]+" - "+(new Date().getDate()+Number(input[2]));
    /*
    var time = input.toString();
    var tmp = time.split(",");
    tmp = tmp[2].split("T");
    tmp[1] = tmp[1].split(".");
    return tmp[0]+" "+tmp[1][0];
    */
}
function handleTaxiAdd(taxi)
{
    taxiArr[rpos] = taxi;
    driverMappings[taxi.taxiId] = rpos; 
    addItem(false,"Taxi "+taxi.taxiId);
}
function removeTaxi(taxiId)
{
    var myItem = document.getElementById("tbr"+driverMappings[taxiId]);
    if(!(myItem == selected || myItem == selectedMatch))
    {
        myItem.style.display="none";
    }
    else
    {
        selected.style.backgroundColor="white";
        selectedMatch.style.backgroundColor="white";
        leftID = -1;
        rightID = -1;
        selected = null;
        selectedMatch = null;
        document.getElementById("connectButton").disabled = true;
    }
}
function handleOrderAdd(order)
{
    orderArr[lpos] = order;
    addItem(true,makeReadableTime(order.gotime)+": "+ifMapSelection(true,order)+" to "+ifMapSelection(false,order));
}
function performConnection()
{
    //Do stuff here.
    vm.assignTaxi(orderArr[leftID],taxiArr[rightID].taxiId);
    
    //Selection reset.
    selected.style.display="none";
    selectedMatch.style.display="none";
    leftID = -1;
    rightID = -1;
    selected = null;
    selectedMatch = null;
}
function connectSelections(id,isLeft)
{
    if(isLeft)
    {
        leftID = id;
    }
    else
    {
        rightID = id;
    }
    if(selectedMatch != null)
    {
        selectedMatch.style.backgroundColor = "white";
    }
    var tmpStr;
    if(isLeft)
    {
        tmpStr = "tbl"+id;
    }
    else
    {
        tmpStr = "tbr"+id;
    }
    selectedMatch = document.getElementById(tmpStr);
    selectedMatch.style.backgroundColor = "pink";
    document.getElementById("connectButton").disabled = false;
}

function changeSelection(id,isLeft)
{
    selectedIsLeft = isLeft;
    if(isLeft)
    {
        leftID = id;
    }
    else
    {
        rightID = id;
    }
    if(selected != null)
    {
        selected.style.backgroundColor = "white";
    }
    var tmpStr;
    if(isLeft)
    {
        tmpStr = "tbl"+id;
    }
    else
    {
        tmpStr = "tbr"+id;
    }
    selected = document.getElementById(tmpStr);
    selected.style.backgroundColor = "lightgreen";
}