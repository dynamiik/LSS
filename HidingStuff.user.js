// ==UserScript==
// @name         Hiding
// @version      1.0.2
// @description  Sachen ausblenden
// @author       Dynamiite
// @include      *://leitstellenspiel.de/
// @include      *://www.leitstellenspiel.de/
// @grant        none
// @namespace
// ==/UserScript==
/* global $ */
(function() {
    'use strict';
    /* Configuration */
    var statusVehicle = false;
    var myVehicle = false;
    var myMission = false;
    var myBuilding = false
    var verbandVehicle = false;
    var verbandMission = false;
    var beteiligte_Verbandseinsatze=false;

    var filter = ['[Verband]', '[Event]']; // Filter für Fahrzeug und Gebäude und Missionen text
    var substringCount = filter.length;

    // ruft setIntervall alle 10 sekunden auf
    //var tid = setInterval(check_intervall, 10000);
    init();
    check_intervall();
    // Interval alternatives
    let missionMarkerOrig = missionMarkerAdd;
    missionMarkerAdd = (e) => {
        missionMarkerOrig(e);
        check_intervall();
    };
    map.on({
        zoomend: function() {
            check_intervall();
        },
        moveend: function() {
            check_intervall();
        }
    });
    let vehicleMarkerAddBuffer = vehicleMarkerAdd;
    vehicleMarkerAdd = function(e){
    vehicleMarkerAddBuffer(e)
    check_intervall();
    };
    let radioMessageBuffer = radioMessage;
    radioMessage = function(t){
        radioMessageBuffer(t);
        check_intervall();
    }
    // set List
    function init(){ // https://www.leitstellenspiel.de/images/search_5a5753.svg
        $('.nav.navbar-nav.navbar-right').prepend('<li class="dropdown" id="dropdown_hiding_settings"><a href="#" id="hide" role="button" class="dropdown-toggle" data-toggle="dropdown"><img alt="Hide_ffffff" class="navbar-icon" src="https://www.leitstellenspiel.de/images/search_5a5753.svg" title="Hide"><span class="visible-xs">Hide</span><b class="caret"></b></a></li>');
        $('<ul class="dropdown-menu" role="menu" aria-labelledby="news"><li id="dropdown_hiding_settings_1" role="presentation"></li></ul>').appendTo('#dropdown_hiding_settings');
        $('<li id="dropdown_hiding_settings_2"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');
        $('<li id="dropdown_hiding_settings_3"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');
        $('<li id="dropdown_hiding_settings_4"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');
        $('<li id="dropdown_hiding_settings_5"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');
        $('<li id="dropdown_hiding_settings_6"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');
        $('<li id="dropdown_hiding_settings_7"></li>').appendTo('#dropdown_hiding_settings .dropdown-menu');

        let button_class = (myVehicle) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue li. onclick toggelt Boolean und ruft function auf
        $('<a href="#" title="myVehicle">Eigene Fahrzeuge <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_1'))
            .click(function(e){
            myVehicle = !myVehicle;
            f_myVehicle();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (myMission) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue li. onclick toggelt Boolean und ruft function auf
        $('<a href="#" title="myVehicle">Eigene Missionen <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_2'))
            .click(function(e){
            myMission = !myMission;
            f_myMission();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (myBuilding) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue li. onclick toggelt Boolean und ruft function auf
        $('<a href="#" title="myBuilding">Eigene Gebäude <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_3'))
            .click(function(e){
            myBuilding = !myBuilding;
            f_myBuilding();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (verbandVehicle) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue li. onclick toggelt Boolean und ruft function auf
        $('<a href="#" title="verbandVehicle">Verband Fahrzeuge <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_4'))
            .click(function(e){
            verbandVehicle = !verbandVehicle;
            f_verbandVehicle();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (verbandMission) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue li. onclick toggelt Boolean und ruft function auf
        $('<a href="#" title="verbandMission">Verbands Missionen <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_5'))
            .click(function(e){
            verbandMission = !verbandMission;
            f_verbandMission();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });        
        button_class = (beteiligte_Verbandseinsatze) ? "ausgeblendet":"angezeigt";
        $('<a href="#" title="verbandMission">Beteiligte Verbands Missionen <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_5'))
            .click(function(e){
            beteiligte_Verbandseinsatze = !beteiligte_Verbandseinsatze;
            f_beteiligte_Verbandseinsatze();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (statusVehicle) ?  "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue li. onclick toggelt Boolean und ruft function auf
        $('<a href="#"  title="statusVehicle">Freie Fahrzeuge <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_7'))
            .click(function(e){
            statusVehicle = !statusVehicle;
            f_statusVehicle();
            // Buttontext wechseln
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
    }
    function check_intervall() {
// wird alle 10 sekunden aufgerufen um alles auszublenden was durch die buttons gesetzt wurde
        if(myBuilding)f_myBuilding();
        if(myVehicle)f_myVehicle();
        if(verbandMission)f_verbandMission();
        if(verbandVehicle)f_verbandVehicle();
        if(statusVehicle)f_statusVehicle();
        if(beteiligte_Verbandseinsatze)f_beteiligte_Verbandseinsatze();

    }
    function f_beteiligte_Verbandseinsatze(){
        let einsatze = $('#mission_list_alliance .missionSideBarEntry.missionSideBarEntrySearchable').not('.mission_deleted')
        if(beteiligte_Verbandseinsatze){
            let einsatzarray=new Array()
            for(let i=0; i<$(einsatze).length;i++){
                let glyphicon = $(einsatze[i]).find('.glyphicon-asterisk')
                if($(glyphicon).hasClass('hidden')){
                    $(einsatze[i]).hide()
                    einsatzarray.push($(einsatze[i]).attr('mission_id'))
                }
            }
            for (let i = mission_markers.length - 1; i >= 0; i--) {
                let string_ids_out = mission_markers[i].mission_id.toString();
                if(einsatzarray.some((substring)=>string_ids_out.includes(substring.toString()))) {
                    map.removeLayer(mission_markers[i]);}
            }
        }
        else{
            let einsatzarray=new Array()
            for(let i=0; i<$(einsatze).length;i++){
                if(!$(einsatze[i]).find('.glyphicon.glyphicon-asterisk:visible').length){
                    $(einsatze[i]).show()
                    einsatzarray.push($(einsatze[i]).attr('id').split('_')[1])
                }
            }
            for (let i = mission_markers.length - 1; i >= 0; i--) {
                let string_ids_id = mission_markers[i].mission_id.toString();
                if(einsatzarray.some((substring)=>string_ids_id.includes(substring))){ map.addLayer(mission_markers[i]);}
            }
        }
    }
    //Blendet die Fahrzeuge aus in der Fahrzeugliste bei status 3 4 6
    function f_statusVehicle(){
        if(statusVehicle){
            let data = $('#building_list span').map(function() {
                if($(this).text()==4 || $(this).text()==3 || $(this).text()== 6)$(this).parent().hide();
                else $(this).parent().show();
                return;
            }).get();
        }
        else{
            // blendet sie wieder ein
            let data = $('#building_list span').map(function() {
                $(this).parent().show();
                return;
            }).get();
        }
    }
    // blendet eigene Fahrzeuge aus
    function f_myVehicle(){
        if(myVehicle){
            for (let i = vehicle_markers.length - 1; i >= 0; i--) {
                let string = vehicle_markers[i]._tooltip._content;
                if (!filter.some(substring => string.includes(substring))) {
                    map.removeLayer(vehicle_markers[i]);
                }
            }
        }
        else{
            // fügt sie wieder ein
            for (let i = vehicle_markers.length - 1; i >= 0; i--) {
                let string = vehicle_markers[i]._tooltip._content;
                if (!filter.some(substring => string.includes(substring))) {
                    map.addLayer(vehicle_markers[i]);
                }
            }
        }
    }
    // blendet Verbansfahrzeuge aus
    function f_verbandVehicle(){
        if(verbandVehicle){
            for (let i = vehicle_markers.length - 1; i >= 0; i--) {
                let string = vehicle_markers[i]._tooltip._content;
                if (filter.some(substring => string.includes(substring))) {
                    map.removeLayer(vehicle_markers[i]);
                }
            }
        }
        else{
            // fügt sie wieder ein
            for (let i = vehicle_markers.length - 1; i >= 0; i--) {
                let string = vehicle_markers[i]._tooltip._content;
                if (filter.some(substring => string.includes(substring))) {
                    map.addLayer(vehicle_markers[i]);
                }
            }
        }
    }
    //blendet eigene Missionen aus
    function f_myMission(){
        if(myMission){
            for (let i = mission_markers.length - 1; i >= 0; i--) {
                let string = mission_markers[i]._tooltip._content;
                if (!filter.some(substring => string.includes(substring))) {
                    map.removeLayer(mission_markers[i]);
                }
            }
        }
        // fügt sie wieder ein
        else{
            for (let i = mission_markers.length - 1; i >= 0; i--) {
                let string = mission_markers[i]._tooltip._content;
                if (!filter.some(substring => string.includes(substring))) {
                    map.addLayer(mission_markers[i]);
                }
            }
        }
    }
    // blendet Verbandsmissionen aus
    function f_verbandMission(){
        if(verbandMission){
            for (let i = mission_markers.length - 1; i >= 0; i--) {
                let string = mission_markers[i]._tooltip._content;
                if (filter.some(substring => string.includes(substring))) {
                    map.removeLayer(mission_markers[i]);
                }
            }
        }
        // fügt sie wieder ein
        else{
            for (let i = mission_markers.length - 1; i >= 0; i--) {
                let string = mission_markers[i]._tooltip._content;
                if (filter.some(substring => string.includes(substring))) {
                    map.addLayer(mission_markers[i]);
                }
            }
        }
    }
    // blendet eigene Gebäude aus und fügt sie wieder ein
    function f_myBuilding(){
        if(myBuilding) $(".leaflet-interactive[src*='building']").hide();
        else $(".leaflet-interactive[src*='building']").show();
    }
})();
