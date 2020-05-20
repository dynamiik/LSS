// ==UserScript==
// @name         Wachenübersicht Searchbar
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  try to take over the world!
// @author       Dynamiite
// @include      *://www.leitstellenspiel.de/*
// @include      *://www.missionchief.co.uk/*
// @include      *://www.missionchief.com/*
// @grant        GM_addStyle

// Nur sichtbare Fahrzeuge werden geladen(Eingeklappte Wachen und Scrollen)

// ==/UserScript==
/* global $ */
(function() {
    'use strict';
    GM_addStyle(`.search_input_field_gebaudeubersicht_hide{display:none !important;}`);
    GM_addStyle(`.search_input_field_gebaudeubersicht_show{display:list-item;}`);
    var nurWachen=false;
    let divy= $('<div id="search_input_field_gebaudeubersicht_ID"></div>')
    // Suchfeld
    let searchy = $('<input type="text" search_class="missionSideBarEntrySearchable" id="search_input_field_gebaudeubersicht" style="color: #333; width:90%; font-size:12px; border:1px solid #ccc; border-radius:4px;  background-image: url(/images/search_5a5753.svg); background-repeat: no-repeat; background-size: auto 100%; padding-left: 25px;padding-right: 20px;">')
    // Wachentoggle Button
    let button_class = (nurWachen) ? "btn-success" : "btn-danger";
    let butty = $('<a href="#" class="btn '+button_class+' btn-xs " title="Wachen suche" style="position: absolute;">W</a>')
    // Reset button
    let buttyX = $('<a href="#" class="btn btn-xs" title="clear" style="position:relative;right:5%;margin-top:1px;height:20px;">x</a>')
    divy.appendTo($('#building_panel_heading'))
    searchy.appendTo($('#search_input_field_gebaudeubersicht_ID'))
    buttyX.appendTo($('#search_input_field_gebaudeubersicht_ID'))
    butty.appendTo($('#search_input_field_gebaudeubersicht_ID'))
    $(buttyX).click(function(e){
        // Löscht das suchfeld und triggert change
        $(searchy).val('')
        $(searchy).trigger('change');
        return false;
    });
    $(butty).click(function(e){
        nurWachen = !nurWachen;
        $(this).hasClass("btn-success") ? $(this).removeClass("btn-success").addClass("btn-danger"): $(this).addClass("btn-success").removeClass("btn-danger");
        return false;
    });
    $(searchy).on('change', function(){
        let wachen = $('.building_list_li')
        let fahrzeuge=$('.label.label-default.vehicle_building_list_button.lightbox-open')
        //zurück zu normalzustand löscht eigene Klassen wieder
        //$(wachen).removeClass('hideBuildingType')
        $(wachen).removeClass('search_input_field_gebaudeubersicht_hide')
        $(wachen).removeClass('search_input_field_gebaudeubersicht_show')
        $(fahrzeuge).parent().show()
        $(searchy).css('background-color', 'white')
        if($(searchy).val()==""){
            //blendet "Fahrzeuge ausgeblendet" wieder aus
            for(let i=0;i<wachen.length;i++){
                if($(wachen[i]).find('.hidden_vehicle_list_caption').length)
                    $(wachen[i]).children('.building_list_vehicles').hide()
                // löscht ggf das zusätzliche "Fahrzeuge ausgeblendet" span
                for(let k=0;k<$(wachen[i]).find('.hidden_vehicle_list_caption').length-1;k++){
                    $(wachen[i]).find('.hidden_vehicle_list_caption')[k].remove()
                }
            }
            return
        }
        for(let i=0;i<wachen.length;i++){
            // blendet alle Wachen ein die durch Filterbuttons ausgeblendet wurden
            if($(wachen[i]).hasClass('hideBuildingType')||$(wachen[i]).hasClass('hideLeitstelle'))
                $(wachen[i]).addClass('search_input_field_gebaudeubersicht_show')
            // Wenn nach Fahrzeugen gesucht werden soll: blendet "Fahrzeuge ausgeblendet" ein um darin zu suchen 
            if(!nurWachen){
                if($(wachen[i]).children('.building_list_vehicles:hidden').length)
                    $(wachen[i]).children('.building_list_vehicles').show()
            }
        }
        //suche Wachen
        if(nurWachen){
            //Verstecke Wachen wenn text != suchtext
            for(let i=0;i<wachen.length;i++){
                // Suchfeld farbe Rot wenn nicht alle Fahrzeuge geladen
                if($(wachen[i]).children('.building_list_vehicles').text() == "Lade...")
                    $(searchy).css('background-color', '#ffafaf')
                if($(wachen[i]).find('a.map_position_mover').text().toLowerCase().search($(searchy).val().toLowerCase())==-1){
                    //$(wachen[i]).addClass('hideBuildingType')
                    $(wachen[i]).addClass('search_input_field_gebaudeubersicht_hide')
                }
            }
        }
        //Suche Fahrzeuge
        else{
            // sucht Fahrzeuge und blendet alle aus wenn text != suchtext
            for(let i=0;i<fahrzeuge.length;i++){
                if($(fahrzeuge[i]).text().toLowerCase().search($(searchy).val().toLowerCase())!=-1){
                    $(fahrzeuge[i]).parent().show()
                }
                else $(fahrzeuge[i]).parent().hide()
            }
            //verstecke Wachen durch class 'search_input_field_gebaudeubersicht_hide' und blende Fahrzeuge wieder ein
            for(let i=0;i<wachen.length;i++){
                // Suchfeld farbe Rot wenn nicht alle Fahrzeuge geladen
                if($(wachen[i]).children('.building_list_vehicles').text() == "Lade...")
                    $(searchy).css('background-color', '#ffafaf')
                if($(wachen[i]).find('.building_list_vehicle_element:visible').length==0){
                    //$(wachen[i]).addClass('hideBuildingType')
                    $(wachen[i]).addClass('search_input_field_gebaudeubersicht_hide')
                    $(wachen[i]).find('.building_list_vehicle_element:hidden').show()
                }
            }
        }
    })
})();
