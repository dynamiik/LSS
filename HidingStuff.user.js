// ==UserScript==
// @name         Hiding
// @version      1.0.5
// @description  Sachen ausblenden
// @author       Dynamiite
// @include      *://leitstellenspiel.de/
// @include      *://www.leitstellenspiel.de/
// @grant        GM_addStyle
// @namespace
// ==/UserScript==
/* global $ */
(function() {
    'use strict';
    GM_addStyle(`.beteiligte_Verbandseinsatze_hiding{display:none !important;}`);

    /* Configuration */
    var myVehicle = false;
    var statusVehicle = false;
    var myMission = false;
    var myBuilding = false;
    var verbandVehicle = true;
    var verbandMission = true;
    var beteiligte_Verbandseinsatze=false;
    /* END Configuration */

    var filter = ['[Verband]', '[Event]']; // Filter für Fahrzeug und Gebäude und Missionen text
    var substringCount = filter.length;
    var missions_outer_height = 0;
    // ruft setIntervall alle 10 sekunden auf
    //var tid = setInterval(check_intervall, 10000);
    let einsatzarray_vehicle=new Array()
    let einsatzarray_beteiligte_mission=new Array()
    init();
    check_intervall();
    function init(){ // https://www.leitstellenspiel.de/images/search_5a5753.svg
        $('.nav.navbar-nav.navbar-right').prepend('<li class="dropdown" id="dropdown_hiding_settings"><a href="#" id="hide" role="button" class="dropdown-toggle" data-toggle="dropdown"><img alt="Hide_ffffff" class="navbar-icon" src="https://www.leitstellenspiel.de/images/search_5a5753.svg" title="Hide"><span class="visible-xs">Hide</span><b class="caret"></b></a></li>');
        $('<ul class="dropdown-menu" role="menu" aria-labelledby="news"><li id="dropdown_hiding_settings_1" role="presentation"></li></ul>').appendTo('#dropdown_hiding_settings');
        $('<li id="dropdown_hiding_settings_2"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');
        $('<li id="dropdown_hiding_settings_3"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');
        $('<li id="dropdown_hiding_settings_4"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');
        $('<li id="dropdown_hiding_settings_5"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');
        $('<li id="dropdown_hiding_settings_6"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');
        $('<li id="dropdown_hiding_settings_7"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');
        $('<li id="dropdown_hiding_settings_8"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');

        let button_class = (myVehicle) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue li. onclick toggelt Boolean und ruft function auf
        $('<a href="#" title="myVehicle">Eigene Fahrzeuge <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_1'))
            .click(function(e){
            myVehicle = !myVehicle;
            fahrzeuge_hide();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (statusVehicle) ?  "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue li. onclick toggelt Boolean und ruft function auf
        $('<a href="#"  title="statusVehicle">Fahrzeuge im Einsatz <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_2'))
            .click(function(e){
            statusVehicle = !statusVehicle;
            f_statusVehicle();
            if(!statusVehicle){
                let wachen = $('.building_list_li')
                let fahrzeuge=$('.label.label-default.vehicle_building_list_button.lightbox-open')
                $(wachen).removeClass('hideBuildingType')
                $(fahrzeuge).parent().show()
            }
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (myMission) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue li. onclick toggelt Boolean und ruft function auf
        $('<a href="#" title="myVehicle">Eigene Missionen <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_3'))
            .click(function(e){
            myMission = !myMission;
            mission_hide();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (myBuilding) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue li. onclick toggelt Boolean und ruft function auf
        $('<a href="#" title="myBuilding">Eigene Gebäude <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_4'))
            .click(function(e){
            myBuilding = !myBuilding;
            f_myBuilding();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (verbandVehicle) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue li. onclick toggelt Boolean und ruft function auf
        $('<a href="#" title="verbandVehicle">Verband Fahrzeuge <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_5'))
            .click(function(e){
            verbandVehicle = !verbandVehicle;
            fahrzeuge_hide();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (verbandMission) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue li. onclick toggelt Boolean und ruft function auf
        $('<a href="#" title="verbandMission">Verbands Missionen <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_6'))
            .click(function(e){
            verbandMission = !verbandMission;
            mission_hide();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (beteiligte_Verbandseinsatze) ? "ausgeblendet":"angezeigt";
        $('<a href="#" title="verbandMission">Beteiligte Verbands Missionen <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_7'))
            .click(function(e){
            beteiligte_Verbandseinsatze = !beteiligte_Verbandseinsatze;
            f_beteiligte_Verbandseinsatze();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
    }

    let missionMarkerOrig = missionMarkerAdd;
    missionMarkerAdd = (e) => {
        f_beteiligte_Verbandseinsatze();
        if(myVehicle||verbandVehicle||statusVehicle)fahrzeuge_hide();
        missionMarkerOrig(e);
    };
    map.on({
        zoomend: function() {
            setTimeout(()=>{
                f_beteiligte_Verbandseinsatze();
                if(myVehicle||verbandVehicle||statusVehicle)fahrzeuge_hide();
                if(myBuilding)f_myBuilding();
            },100)
        },
        moveend: function() {
            setTimeout(()=>{
                f_beteiligte_Verbandseinsatze();
                if(myVehicle||verbandVehicle||statusVehicle)fahrzeuge_hide();
                if(myBuilding)f_myBuilding();
            },100)
        }
    });
    /*
    let vehicleCreateOnMapBuffer = vehicleCreateOnMap;
    vehicleCreateOnMap = function(e){
        f_statusVehicle();
        vehicleCreateOnMapBuffer(e)
    };
*/
    /*
    let vehicleDriveAddBuffer = vehicleDriveAdd;
    vehicleDriveAdd = function(e){
        f_statusVehicle();
        vehicleDriveAddBuffer(e)
    };
*/
    let vehicleDriveBuffer = vehicleDrive;
    vehicleDrive = function(e){
        vehicleDriveBuffer(e)
        if(myVehicle||verbandVehicle||statusVehicle)fahrzeuge_hide();
    };
    let vehicleMarkerAddBuffer = vehicleMarkerAdd;
    vehicleMarkerAdd = function(e){
        vehicleMarkerAddBuffer(e)
        if(myVehicle||verbandVehicle||statusVehicle)fahrzeuge_hide();
    };
    let radioMessageBuffer = radioMessage;
    radioMessage = function(t){
        //if(myVehicle||verbandVehicle||statusVehicle)fahrzeuge_hide();
        f_beteiligte_Verbandseinsatze();
        f_statusVehicle();
        radioMessageBuffer(t);
    }
    function check_intervall() {
        // wird alle 10 sekunden aufgerufen um alles auszublenden was durch die buttons gesetzt wurde
        //f_statusVehicle();
        f_beteiligte_Verbandseinsatze();
        f_statusVehicle();
        if(myBuilding)f_myBuilding();
    }
    function fahrzeuge_hide(){
        for (let i = vehicle_markers.length - 1; i >= 0; i--) {
            let string = vehicle_markers[i]._tooltip._content;
            let string_ids_out = vehicle_markers[i].vehicle_id.toString();
            if (myVehicle&&!filter.some(substring => string.includes(substring)))
                map.removeLayer(vehicle_markers[i])
            else if (verbandVehicle && filter.some(substring => string.includes(substring)))
                map.removeLayer(vehicle_markers[i]);
            else if(statusVehicle && einsatzarray_vehicle.some((substring)=>string_ids_out.includes(substring.toString())))
                map.removeLayer(vehicle_markers[i]);
            else
                map.addLayer(vehicle_markers[i]);
        }
    }
    function mission_hide(){
        for (let i = mission_markers.length - 1; i >= 0; i--) {
            let string = mission_markers[i]._tooltip._content;
            let string_ids_id = mission_markers[i].mission_id.toString();
            if (myMission && !filter.some(substring => string.includes(substring)))
                map.removeLayer(mission_markers[i]);
            else if (verbandMission && filter.some(substring => string.includes(substring)))
                map.removeLayer(mission_markers[i]);
            else if(beteiligte_Verbandseinsatze && einsatzarray_beteiligte_mission.some((substring)=>string_ids_id.includes(substring)))
                map.removeLayer(mission_markers[i]);
            else
                map.addLayer(mission_markers[i]);
        }
    }
    function f_beteiligte_Verbandseinsatze(){
        einsatzarray_beteiligte_mission=new Array()
        let einsatze = $('#mission_list_alliance .missionSideBarEntry.missionSideBarEntrySearchable').not('.mission_deleted')
        einsatze = $(einsatze).filter((e,t)=>$(t).find('.glyphicon-asterisk').hasClass('hidden'))
        let einsatzarray=new Array()
        if(beteiligte_Verbandseinsatze){
            $(einsatze).map((e,t)=>{
                einsatzarray_beteiligte_mission.push($(t).attr('mission_id'));
                $(t).addClass('beteiligte_Verbandseinsatze_hiding');
            })
            let n_einsatzarray = $('#mission_list_sicherheitswache > .missionSideBarEntry').map((e,t)=>einsatzarray_beteiligte_mission.push($(t).attr('mission_id')));
        }
        else{
            $(einsatze).map((e,t)=>$(t).removeClass('beteiligte_Verbandseinsatze_hiding'))
        }
        mission_hide()
    }
    //Blendet die Fahrzeuge aus in der Fahrzeugliste bei status 3 4 6
    function f_statusVehicle(){
        if(statusVehicle){
            einsatzarray_vehicle=new Array()
            $($('.building_list_li')).removeClass('hideBuildingType')
            $($('.label.label-default.vehicle_building_list_button.lightbox-open')).parent().show()
            //verstecke Wachen durch class 'hideBuildingType' und blende Fahrzeuge wieder ein
            let data = $('#building_list span').map((e,t)=> {
                let wache = $(t).parents('.building_list_li')
                if($(t).text()==4 || $(t).text()==3 || $(t).text()== 6){
                    $(t).parent().hide();
                    einsatzarray_vehicle.push($(t).parent().attr('vehicle_id'))
                    if($(wache).find('.building_list_vehicle_element:visible').length==0){
                        $(wache).addClass('hideBuildingType')
                        $(wache).find('.building_list_vehicle_element:hidden').show()
                    }
                }
                else{
                    $(t).parent().show();
                    $(wache).removeClass('hideBuildingType')
                }
            });
        }
        fahrzeuge_hide()
    }
    // blendet eigene Gebäude aus und fügt sie wieder ein
    function f_myBuilding(){
        if(myBuilding) $(".leaflet-interactive[src*='building']").hide();
        else $(".leaflet-interactive[src*='building']").show();
    }
})();
