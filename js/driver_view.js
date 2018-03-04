/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var modal = document.getElementById('myModal');

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
   var tmp;
   if(order.frompos == "Map selection")
       {
           tmp = order.fromLatLong;
       }
       else tmp = order.frompos;
   document.getElementById("modalFrån").innerHTML = tmp;
   if(order.destpos == "Map selection")
       {
           tmp= order.destLatLong;
       }
       else tmp = order.destpos;
   document.getElementById("modalTill").innerHTML = tmp;
   myOrder = order;
}

accept.onclick = function() {
   modal.style.display = "none";
   transition('id_driver_waiting','id_driver_has_customer');
   vm.acceptOrder(myOrder);
}

decline.onclick = function() {
   socket.emit("orderTaxi", myOrder);
   vm.quit();
   if (vm.taxiLocation === null) {
       vm.taxiLocation = L.marker(vm.pos, {icon: vm.taxiIcon, draggable: true}).addTo(vm.map);
       vm.taxiLocation.on("drag", vm.moveTaxi);
       socket.emit("addTaxi", { taxiId: vm.taxiId,
                               latLong: vm.pos
                               });
     }
   modal.style.display = "none";
}

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
