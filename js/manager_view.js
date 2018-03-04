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
var selectedID = -1;
var selectedIsLeft = false;
var selectedMatch = null;
var matchID = -1;
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
//1h hittills.
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
}
function ifMapSelection(isDest,order)
{
    if(isDest)
    {
        if(order.destpos == "Map selection")
        {
            return order.destLatLong;
        }
        else return order.destpos;
    }
    else
    {
        if(order.frompos == "Map selection")
        {
            return order.fromLatLong;
        }
        else return order.frompos;
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
function handleOrderAdd(order)
{
    addItem(true,makeReadableTime(order.gotime)+": "+ifMapSelection(true,order)+"-"+ifMapSelection(false,order));
}
function connectSelections(id,isLeft)
{
    matchID = id;
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
}

function changeSelection(id,isLeft)
{
    selectedIsLeft = isLeft;
    selectedID = id;
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