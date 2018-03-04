/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


 var modal = document.getElementById('myModal');
 var modal2 = document.getElementById('driveModal');

 // Get the button that opens the modal
 //var btn = document.getElementById("myBtn");

 // Get the <span> element that closes the modal
 var span = document.getElementsByClassName("close")[0];

 var accept = document.getElementById("accept-drive");

 var decline = document.getElementById("decline-drive");
 
 var myOrder = null;

function handleGivenOrder(order)
{
    console.log("test");
    modal.style.display = "block";
    document.getElementById("modalKund").innerHTML = "Ja.";
    document.getElementById("modalKund2").innerHTML = "Ja.";
    var tmp;
    if(order.frompos == "Map selection")
        {
            tmp = order.fromLatLong;
        }
        else tmp = order.frompos;
    document.getElementById("modalFrån").innerHTML = tmp;
    document.getElementById("modalFrån2").innerHTML = tmp;
    if(order.destpos == "Map selection")
        {
            tmp= order.destLatLong;
        }
        else tmp = order.destpos;
    document.getElementById("modalTill").innerHTML = tmp;
    document.getElementById("modalTill2").innerHTML = tmp;
    myOrder = order;
}

accept.onclick = function() {
    modal.style.display = "none";
    vm.acceptOrder(myOrder);
    modal2.style.display = "block";
}

function resetTaxi()
{
    vm.quit();
    if (vm.taxiLocation === null) {
        vm.taxiLocation = L.marker(vm.pos, {icon: vm.taxiIcon, draggable: true}).addTo(vm.map);
        vm.taxiLocation.on("drag", vm.moveTaxi);
        socket.emit("addTaxi", { taxiId: vm.taxiId,
                                latLong: vm.pos
                                });
      }
    modal2.style.display = "none";
}
function releaseRide()
{
    socket.emit("orderTaxi", myOrder);
    resetTaxi();
    modal.style.display = "none";
    modal2.style.display = "none";
}

decline.onclick = function() {
    releaseRide();
}


 // When the user clicks on <span> (x), close the modal
 /*span.onclick = function() {
     modal.style.display = "none";
 }*/

 // When the user clicks anywhere outside of the modal, close it
 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
     }
 }
