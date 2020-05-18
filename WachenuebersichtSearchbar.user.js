// ==UserScript==
// @name         Wachenübersicht Searchbar
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       Dynamiite
// @include      *://www.leitstellenspiel.de/*
// @include      *://www.missionchief.co.uk/*
// @include      *://www.missionchief.com/*
// @grant        none
// ==/UserScript==
/* global $ */

(function() {
    'use strict';
    // Suchfeld
    let searchy = $('<input type="text" search_class="missionSideBarEntrySearchable" id="search_input_field_gebaudeubersicht" style="color: #333; width:100%; font-size:12px; border:1px solid #ccc; border-radius:4px;  background-image: url(/images/search_5a5753.svg); background-repeat: no-repeat; background-size: auto 100%; padding-left: 25px">')
    searchy.appendTo($('#building_panel_heading'))
    $(searchy).on('change', function(){
        let wachen = $('.building_list_li')
        let fahrzeuge=$('.label.label-default.vehicle_building_list_button.lightbox-open')
        //zurück zu normalzustand
        $(wachen).removeClass('hideBuildingType')
        $(fahrzeuge).parent().show()
        if($(searchy).val()=="")return
        //Verstecke Fahrzeuge
        for(let i=0;i<fahrzeuge.length;i++){
            if($(fahrzeuge[i]).text().toLowerCase().search($(searchy).val().toLowerCase())!=-1)
                $(fahrzeuge[i]).parent().show()
            else $(fahrzeuge[i]).parent().hide()
        }
        //verstecke Wachen durch class 'hideBuildingType' und blende Fahrzeuge wieder ein
        for(let i=0;i<wachen.length;i++){
            if($(wachen[i]).find('.building_list_vehicle_element:visible').length==0){
                $(wachen[i]).addClass('hideBuildingType')
                $(wachen[i]).find('.building_list_vehicle_element:hidden').show()
            }
        }
    })
})();
