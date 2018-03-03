/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
        var myIO = io();
        function Order(from,to,time)
        {
            this.from = from;
            this.to = to;
            this.time = time;
        }
        function test()
        {
            myIO.emit("makeOrder",new Order("a","b",5));
        }
        
        function getSpecials()
        {
            var str = "";
            var tmp = document.getElementsByClassName('behov_alternativ');
            for(var i = 0; i < tmp.length; ++i)
            {
                if(tmp[i].checked)
                {
                    str += tmp[i].value +", ";
                }
            }
            return str.substr(0,str.length-2);
        }
        var taxiWaitCycle = null;
        function moveAndLaunch(arg1,arg2)
        {
            transition(arg1,arg2);
            startTaxiClock();
            document.getElementById('errorNotice').innerHTML = '';
        }
        function setNowPoint()
        {
            var date = new Date();
            if(date.getMinutes() > 54)
            {
                document.getElementById("orderHourOptions").value = date.getHours()+1;
                document.getElementById("orderMinuteOptions").value = (date.getMinutes()+5-60+(5-date.getMinutes()%5));
            }
            else
            {
                document.getElementById("orderHourOptions").value = date.getHours();
                document.getElementById("orderMinuteOptions").value = date.getMinutes()+5+(5-date.getMinutes()%5);
            }
            document.getElementById("dayOptions").value = 0;
        }
        function onlyPermitIfFilledIn(fun,arg1,arg2)
        {
            if(document.getElementById('orderInfoFrom').value == "")
            {
                document.getElementById("errorNotice").innerHTML = "Ogiltig avrese-plats. Vänligen skriv in en giltig upplockningsplats.";
                return;
            }
            if(document.getElementById('orderInfoTo').value == "")
            {
                document.getElementById("errorNotice").innerHTML = "Ogiltig destination. Vänligen skriv in en giltig destination.";
                return;
            }
            if(document.getElementById('orderInfoCount').value == "" || document.getElementById("orderInfoCount").value < 1)
            {
                document.getElementById("errorNotice").innerHTML = "Ogiltigt antal. Vänligen skriv in ett giltigt antal passagerare.";
                return;
            }
            var curDate = new Date();
            if((curDate.getHours() > Number(document.getElementById("orderHourOptions").value) || (curDate.getHours() == Number(document.getElementById("orderHourOptions").value) && curDate.getMinutes() > Number(document.getElementById("orderMinuteOptions").value))) && document.getElementById("dayOptions").value == 0)
            {
                document.getElementById("errorNotice").innerHTML = "Ogiltig tid. Vänligen skriv in en giltig upplockningstid.";
                return;
            }
            fun(arg1,arg2);
        }
        function transition(from,to)
        {
            document.getElementById(from).style.display='none';
            document.getElementById(to).style.display='block';
            //if(taxiWaitCycle != null)
            //{
            //    clearInterval(taxiWaitCycle);
            //    taxiWaitCycle = null;
            //}
        }
        function showTaxiDetails()
        {
            if(document.getElementById('idTaxiInfo').style.display == 'none')
            {
                document.getElementById('idTaxiInfo').style.display='block';
                document.getElementById('idMoreInfoButton').innerHTML='Mindre information';
            }
            else
            {
                document.getElementById('idTaxiInfo').style.display='none';
                document.getElementById('idMoreInfoButton').innerHTML='Mer information';
            }
        }
        //Precondition: input variable increment is larger than zero.
        function fillTimeField(makeId,defaultText,target,maxValue,increment)
        {
            var temp = "<select id='"+makeId+"' name='rcp'><option value='-1'>"+defaultText+"</option>";
            for (var i = 0; i <= maxValue; i += increment)
            {
                if(i < 10)
                {
                    temp += "<option value='"+i+"'>0"+i+"</option>";
                }
                else
                {
                    temp += "<option value='"+i+"'>"+i+"</option>";
                }
            }
            document.getElementById(target).innerHTML = temp + "</select>";
        }
        function summonAppropriatePayFields()
        {
            var id = document.getElementById("idPaymentSwitch");
            if(id != null)
            {
                document.getElementById("payFieldVisa").style.display = "none";
                document.getElementById("payFieldMastercard").style.display = "none";
                document.getElementById("payFieldPaypal").style.display = "none";
                if(id.value != "Default")
                {
                    document.getElementById("payField"+id.value).style.display = "block";
                }
            }
            //Else we have an error.
        }
        //Assumes that the fields are correctly filled in.
        function startTaxiClock()
        {
            var curDate = new Date();
            var selectedHour = document.getElementById("orderHourOptions").value;
            var selectedMinute = document.getElementById("orderMinuteOptions").value;
            console.log(selectedHour+""+selectedMinute);
            selectedHour -= curDate.getHours();
            selectedHour += document.getElementById("dayOptions").value*24;
            selectedMinute -= curDate.getMinutes();
            if(selectedMinute < 0)
            {
                selectedMinute += 60;
                selectedHour--;
            }
            console.log(selectedHour+""+selectedMinute);
            document.getElementById("taxiClockSpace").innerHTML = selectedHour+":"+selectedMinute+":00";
            taxiWaitCycle = setInterval(tickTaxiClock,1000);
        }
        function tickTaxiClock()
        {
            var curClock = document.getElementById("taxiClockSpace").innerHTML.split(":");
            if(Number(curClock[2]) > 0)
            {
                curClock[2] = (Number(curClock[2])-1)+"";
                if(Number(curClock[2] < 10))
                {
                    curClock[2] = "0"+curClock[2];
                }
            }
            else
            {
                curClock[2] = "59";
                if(Number(curClock[1]) > 0)
                {
                    curClock[1] = (Number(curClock[1])-1)+"";
                    if(Number(curClock[1] < 10))
                    {
                        curClock[1] = "0"+curClock[1];
                    }
                }
                else
                {
                    curClock[1] = "59";
                    if(Number(curClock[0]) > 0)
                    {
                        curClock[0] = (Number(curClock[0])-1)+"";
                    }
                    else
                    {
                        document.getElementById("taxiClockSpace").innerHTML = "Nu"; 
                        clearInterval(taxiWaitCycle);
                        taxiWaitCycle = null;
                        return;
                    }
                }
            }
            document.getElementById("taxiClockSpace").innerHTML = curClock.join(":");
        }
        fillTimeField("orderHourOptions","Timma","makeHourOptions",23,1);
        fillTimeField("orderMinuteOptions","Minut","makeMinuteOptions",59,5);
        
        function avbrytResa() 
        {
            if (confirm("Är du säker på att du vill avboka din resa? Du kan inte behålla din väntade tid"))
            {
                fillTimeField("orderHourOptions","Timma","makeHourOptions",23,1);
                fillTimeField("orderMinuteOptions","Minut","makeMinuteOptions",59,5);
                transition('id_customer_wait_view', 'id_customer_order_view');
                clearInterval(taxiWaitCycle);
                alert("Resa avbokad. Ha en fortsatt trevlig dag");
            }
        }
