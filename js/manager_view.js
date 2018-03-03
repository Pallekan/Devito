/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var myIO = io();
var lpos = 0;
var rpos = 0;
var selected = null;
var selectedID = -1;
var selectedIsLeft = false;
var taxiarr = new Array();
var taskarr = new Array();
function tmp()
{
    myIO.on("makeOrder",function(data){
        taskarr[lpos] = data;
        addItem(true,data.from+"-"+data.to+": "+data.time);
        console.log(data);
    });
    
}
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

function connectSelections(id,isLeft)
{
    //tmp
    changeSelection(id,isLeft);
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