/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function transition(from,to)
{
    document.getElementById(from).style.display='none';
    document.getElementById(to).style.display='block';
}

function ifMapSelection(isDest,order)
{
    if(isDest)
    {
        if(order.destpos == "Map selection")
        {
            return "Map: order "+order.orderId;
        }
        else return order.destpos;
    }
    else
    {
        if(order.frompos == "Map selection")
        {
            return "Map: order "+order.orderId;
        }
        else return order.frompos;
    }
}
