// ==UserScript==
// @name         Hiding
// @version      1
// @description  Sachen ausblenden
// @author       Dynamiite
// @include      *://leitstellenspiel.de/
// @include      *://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==
/* global $ */
(function() {
    'use strict';

    /* Configuration */
    var statusVehicle = false;
    var myVehicle = false;
    var myMission = false;
    var myBuilding = false
    var verbandVehicle = true;
    var verbandMission = true;
    var filter = ['[Verband]', '[Event]'];
    var substringCount = filter.length;

    var tid = setInterval(check_intervall, 10000);
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

        let button_class = (myVehicle) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue DIV. onclick toggelt Boolean
        $('<a href="#" title="myVehicle">Eigene Fahrzeuge <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_1'))
            .click(function(e){
            myVehicle = !myVehicle;
            f_myVehicle();
            // Buttonfarbe wie Boolean. So oder so
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (myMission) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue DIV. onclick toggelt Boolean
        $('<a href="#" title="myVehicle">Eigene Missionen <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_2'))
            .click(function(e){
            myMission = !myMission;
            f_myMission();
            // Buttonfarbe wie Boolean. So oder so
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (myBuilding) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue DIV. onclick toggelt Boolean
        $('<a href="#" title="myBuilding">Eigene Gebäude <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_3'))
            .click(function(e){
            myBuilding = !myBuilding;
            f_myBuilding();
            // Buttonfarbe wie Boolean. So oder so
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (verbandVehicle) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue DIV. onclick toggelt Boolean
        $('<a href="#" title="verbandVehicle">Verband Fahrzeuge <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_4'))
            .click(function(e){
            verbandVehicle = !verbandVehicle;
            f_verbandVehicle();
            // Buttonfarbe wie Boolean. So oder so
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (verbandMission) ? "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue DIV. onclick toggelt Boolean
        $('<a href="#" title="verbandMission">Verbands Missionen <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_5'))
            .click(function(e){
            verbandMission = !verbandMission;
            f_verbandMission();
            // Buttonfarbe wie Boolean. So oder so
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
        button_class = (statusVehicle) ?  "ausgeblendet":"angezeigt";
        //Fügt Buttons in neue DIV. onclick toggelt Boolean
        $('<a href="#"  title="statusVehicle">Freie Fahrzeuge <span>'+button_class+'</span></a>').appendTo($('#dropdown_hiding_settings_7'))
            .click(function(e){
            statusVehicle = !statusVehicle;
            f_statusVehicle();
            // Buttonfarbe wie Boolean. So oder so
            $(this).find('span').text() == "angezeigt" ?  $(this).find('span').text("ausgeblendet"):$(this).find('span').text("angezeigt");
            return false;
        });
    }
    function check_intervall() {
        if(myBuilding)f_myBuilding();
        if(myVehicle)f_myVehicle();
        if(verbandMission)f_verbandMission();
        if(verbandVehicle)f_verbandVehicle();
        if(statusVehicle)f_statusVehicle();
    }
    function f_statusVehicle(){
        if(statusVehicle){
            let data = $('#building_list span').map(function() {
                if($(this).text()==4 || $(this).text()==3 || $(this).text()== 6)$(this).parent().hide();
                else $(this).parent().show();
                return;
            }).get();
        }
        else{
            let data = $('#building_list span').map(function() {
                $(this).parent().show();
                return;
            }).get();
        }
    }
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
            for (let i = vehicle_markers.length - 1; i >= 0; i--) {
                let string = vehicle_markers[i]._tooltip._content;
                if (!filter.some(substring => string.includes(substring))) {
                    map.addLayer(vehicle_markers[i]);
                }
            }
        }
    }
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
            for (let i = vehicle_markers.length - 1; i >= 0; i--) {
                let string = vehicle_markers[i]._tooltip._content;
                if (filter.some(substring => string.includes(substring))) {
                    map.addLayer(vehicle_markers[i]);
                }
            }
        }
    }
    function f_myMission(){
        if(myMission){
            for (let i = mission_markers.length - 1; i >= 0; i--) {
                let string = mission_markers[i]._tooltip._content;
                if (!filter.some(substring => string.includes(substring))) {
                    map.removeLayer(mission_markers[i]);
                }
            }
        }
        else{
            for (let i = mission_markers.length - 1; i >= 0; i--) {
                let string = mission_markers[i]._tooltip._content;
                if (!filter.some(substring => string.includes(substring))) {
                    map.addLayer(mission_markers[i]);
                }
            }
        }
    }
    function f_verbandMission(){
        if(verbandMission){
            for (let i = mission_markers.length - 1; i >= 0; i--) {
                let string = mission_markers[i]._tooltip._content;
                if (filter.some(substring => string.includes(substring))) {
                    map.removeLayer(mission_markers[i]);
                }
            }
        }
        else{
            for (let i = mission_markers.length - 1; i >= 0; i--) {
                let string = mission_markers[i]._tooltip._content;
                if (filter.some(substring => string.includes(substring))) {
                    map.addLayer(mission_markers[i]);
                }
            }
        }
    }
    function f_myBuilding(){
        if(myBuilding) $(".leaflet-interactive[src*='building']").hide();
        else $(".leaflet-interactive[src*='building']").show();
    }
})();
