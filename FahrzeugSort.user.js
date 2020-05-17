// ==UserScript==
// @name         Einsatzfenster Fahrzeug sort
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sortiert die angeklickten Fahrzeuge in dem Einsatzfenster
// @author       Dynamiite
// @include      *://www.leitstellenspiel.de/missions*
// @include      *://www.leitstellenspiel.de/missions*
// @include      *://www.missionchief.co.uk/missions*
// @include      *://www.missionchief.com/missions*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setTimeout( ()=>{
        let clicky = $('<div>^</div>')
        $(clicky).prependTo($('#vehicle_show_table_all .tablesorter-headerRow').children()[1])
        $(clicky).click(()=>bringUPtheVehicles())
        function bringUPtheVehicles(){
            var checked = $('.vehicle_checkbox:checked');
            for(let i=checked.length-1;i>=0;i--){
                $('#vehicle_element_content_'+$(checked[i])[0].value).prependTo($('#vehicle_show_table_body_all'))
            }
        }
    },1000)
})();
