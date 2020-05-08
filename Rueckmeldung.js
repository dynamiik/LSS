// ==UserScript==
// @name         FMS-Rueckmeldung
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Sendet eine FMS5 Rückmeldung über Fehlende Fahrzeuge
// @author       Dynamiite
// @match        https://www.leitstellenspiel.de/*
// @include      *://www.leitstellenspiel.de/
// @include      *://www.leitstellenspiel.de/*
// ==/UserScript==
/* global $ */

// status 1 mission_id?
// optionen liste ein-ausblenden

////////////Einstellungen///////////////
// Einstellungen nur im Script
const originalFMSsound = false;  // FMS5 Sound ändern False = Ton aus
const FMSFarbe = true;  // FMS5 Meldung einfärben
const FMSrot = "rgb(255, 240, 243)";
const FMSgelb = "rgb(255, 253, 219)";
const FMSgruen = "rgb(228, 255, 227)";
const ELInListe = true;
const fuehrungsfahrzeuge =  [34,3]; // Liste mit Führungsfahrzeugen. Der erste eintrag übernimmt immer die EL, falls vorhanden
// Liste mit Fahrzeug IDs: https://forum.leitstellenspiel.de/index.php?thread/8406-infos-f%C3%BCr-entwickler/&pageNo=1

// Start Einstellungen für Buttons im FMS Fenster
var verband = false; // Rueckmeldung auch bei Verbandseinsatz(true)
var nurFR = false; // Rueckmeldung nur bei eintreffen des ersten Fahrzeugs (true) Rueckmeldung bei eintreffen nachrückender Fahrzeuge(false)
var sofortBeiEintreffen=true; //Rueckmeldung obwohl noch Fahrzeuge auf anfahrt sind -> Einsatzsymbol Gelb (true) Rueckmeldung nur wenn keine Fahrzeuge auf anfahrt sind -> Einsatzsymbol rot(false)
var auchBeiVollstandigkeit=true; //Rueckmeldung auch wenn alle erforderten Fahrzeuge eingetroffen sind -> Einsatzsymbol Gruen(true)
///////////////ENDE//////////////////////

const my_user_id=user_id;
// Array mit laufenden und abgeschlossenen Einsätzen
var einsatzleitungen=new Array();
(function() {
    'use strict';
    // Ändert den nervigen FMS5 Ton zum normalen FMS Funk Ton
    let playBuffer = play;
    play = function(e){
        if(e=="fms5"&&!originalFMSsound)e="funk"; //ring
        playBuffer(e);
    }

    // Wird aufgerufen bei jedem Status
    let radioMessageBuffer = radioMessage;
    radioMessage = function(t){
        // Sendet Orginalstatus
        init(t);
        if(t.user_id==my_user_id)t=eAusbreitung(t);
        radioMessageBuffer(t);
    }
    //Fügt neues DIV für Buttons hinzu. Gleich wie bei Einsatzliste oder Fahrzeugfilterliste
    $('<div class="btn-group"></div>').appendTo($('#radio_outer .panel-heading'));
    //Prüft Boolean Status und setzt die Button class
    let button_class = (nurFR) ? "btn-success" : "btn-danger";
    //Fügt Buttons in neue DIV. onclick toggelt Boolean
    $('<a href="#" class="btn '+button_class+' btn-xs " title="First Responder. Rueckmeldung nur Bei eintreffen des ersten Fahrzeugs" style="">FR</a>').appendTo($('#radio_outer .panel-heading .btn-group'))
        .click(function(e){
        nurFR = !nurFR;
        // Buttonfarbe wie Boolean. So oder so
        $(this).hasClass("btn-success") ? $(this).removeClass("btn-success").addClass("btn-danger"): $(this).addClass("btn-success").removeClass("btn-danger");
        return false;
    });
    button_class = (sofortBeiEintreffen) ? "btn-success" : "btn-danger";
    $('<a href="#" class="btn '+button_class+' btn-xs " title="Rueckmeldung obwohl noch Fahrzeuge auf anfahrt sind -> Einsatzsymbol Gelb" style="">Anfahrt</a>').appendTo($('#radio_outer .panel-heading .btn-group'))
        .click(function(e){
        sofortBeiEintreffen = !sofortBeiEintreffen;
        $(this).hasClass("btn-success") ? $(this).removeClass("btn-success").addClass("btn-danger"): $(this).addClass("btn-success").removeClass("btn-danger");
        return false;
    });
    button_class = (auchBeiVollstandigkeit) ? "btn-success" : "btn-danger";
    $('<a href="#" class="btn '+button_class+' btn-xs " title="Abschliessende Lagemeldung wenn alle erforderten Fahrzeuge eingetroffen sind -> Einsatzsymbol Gruen" style="">ASL</a>').appendTo($('#radio_outer .panel-heading .btn-group'))
        .click(function(e){
        auchBeiVollstandigkeit = !auchBeiVollstandigkeit;
        $(this).hasClass("btn-success") ? $(this).removeClass("btn-success").addClass("btn-danger"): $(this).addClass("btn-success").removeClass("btn-danger");
        return false;
    });
    button_class = (verband) ? "btn-success" : "btn-danger";
    $('<a href="#" class="btn '+button_class+' btn-xs " title="Rueckmeldung auch bei Verbandseinsatz" style=";">VE</a>').appendTo($('#radio_outer .panel-heading .btn-group'))
        .click(function(e){
        verband = !verband;
        $(this).hasClass("btn-success") ? $(this).removeClass("btn-success").addClass("btn-danger"): $(this).addClass("btn-success").removeClass("btn-danger");
        return false;
    });
    //Schiebt den VerbandsFMS Button auch in die neue DIV
    $('.btn_alliance_radio').appendTo($('#radio_outer .panel-heading .btn-group'));
    //Buttonliste soll links sein
    $('.btn_alliance_radio').removeClass("pull-right");

    function init(_t){
        // Speichere Variablen aus der orginalen Status 4 Meldung
        var fms_user_id=_t.user_id;
        var fms_ori =_t.fms;
        var vehicle_name=_t.caption;
        var vehicle_id=_t.id;
        var mission_id=_t.mission_id;
        // Prüft ob Mission noch vorhanden
        try{ if(document.getElementById(`mission_${mission_id}`).getAttribute('mission_id') == null) return;}catch(e){return;}
        // Prüft FMS 4 und FMS von USER
        if (mission_id !== 0 && fms_ori == 4 && fms_user_id== my_user_id) {
            // Fahrzeug typ ID aus der Fahrzeugliste. ELW1=3, ELW2=34
            var vehicle_type_id = $('#vehicle_list_'+vehicle_id+' a').attr('vehicle_type_id');
            // Array [mission_id, vehicle_id, vehicle_type_id, vehicle_name, fehlende Fahrzeuge Text, Boolean wurdeRückmeldungSchonGetätigt]
            // eNummer = ArrayIndex von aktuellem Einsatz
            let eNummer = set_einsatzleitungen(mission_id, vehicle_id, vehicle_type_id, vehicle_name);
            if(einsatzleitungen[eNummer][5]) return;
            // Missionstitle aus der Missionsliste
            var mission_title = $('#mission_caption_'+einsatzleitungen[eNummer][0]).text().search('Verband');
            if(!verband && mission_title != -1) return;
            var tout = setTimeout(function(){
                // Farbe des Icons aus der Missionsliste
                var iconfarbe = $('#mission_panel_'+einsatzleitungen[eNummer][0]+' img').attr('src').split(/_|\./)[1];
                if((iconfarbe=='gelb' || iconfarbe=='gelb')&&sofortBeiEintreffen){
                    sendRueckmeldung(eNummer);
                    //FMS-Meldung Hintergrundfarbe zu Hell-Gelb für bessere Übersicht
                    if(FMSFarbe)$("#radio_messages_important").children('.radio_message_vehicle_'+einsatzleitungen[eNummer][1]).css("background-color", FMSgelb);
                }
                if((iconfarbe=='green' || iconfarbe=='gruen')&&auchBeiVollstandigkeit){
                    sendRueckmeldung(eNummer);
                    if(FMSFarbe)$("#radio_messages_important").children('.radio_message_vehicle_'+einsatzleitungen[eNummer][1]).css("background-color", FMSgruen);
                }
                if(iconfarbe=='red' || iconfarbe=='rot'){
                    sendRueckmeldung(eNummer);
                    if(FMSFarbe)$("#radio_messages_important").children('.radio_message_vehicle_'+einsatzleitungen[eNummer][1]).css("background-color", FMSrot);
                }
            }, 15000);
        }
        return;
    }
    // Sende FMS 5 Meldung
    function sendRueckmeldung(eNummer){
        refresh_vehicle_missing(eNummer);
        if(einsatzleitungen[eNummer][5]) return;
        radioMessage({"target_building_id":0,
                      "mission_id":einsatzleitungen[eNummer][0],
                      "additionalText":einsatzleitungen[eNummer][4],
                      "user_id":my_user_id,
                      "type":"vehicle_fms",
                      "id":einsatzleitungen[eNummer][1],
                      "fms_real":5,
                      "fms":5,
                      "fms_text":"Lagemeldung",
                      "caption":einsatzleitungen[eNummer][3]});
        // Boolean true; Die Rückmeldung wurde abgeschickt
        einsatzleitungen[eNummer][5]=true;
        return;
    }
    //Aktuallisiere den Text aus der Missionsbeschreibung des Spiels
    function refresh_vehicle_missing(eNummer){
        // Fehlende Fahrzeuge Text aus Missionsliste
        let _vehicles_missing = $('#mission_missing_'+einsatzleitungen[eNummer][0]).text();
        if(_vehicles_missing == ""){
            _vehicles_missing="Es werden keine weiteren Kräfte benötigt. Bereitschaft kann aufgelöst werden.";
            if($('#mission_overview_countdown_'+einsatzleitungen[eNummer][0]).text()!="") _vehicles_missing = _vehicles_missing+ " Gesch&auml;tzte Einsatzdauer: "+$('#mission_overview_countdown_'+einsatzleitungen[eNummer][0]).text();
        }
        // Fehlende Fahrzeuge Text geändert? Rüchmeldung zu <noch nicht getätigt>
        if(einsatzleitungen[eNummer][4]!=_vehicles_missing && einsatzleitungen[eNummer][5] && !nurFR) einsatzleitungen[eNummer][5]=false;
        einsatzleitungen[eNummer][4]=_vehicles_missing;
        return;
    }
    // Bei FMS5 Einsatzausbreitung Meldung von EL Fahrzeug
    function eAusbreitung(_t){
        if(_t.additionalText.search('ausgebreitet')==-1)return _t;
        for(let i=0; i<einsatzleitungen.length; i++){
            if(einsatzleitungen[i][0] == _t.mission_id){
                _t.caption=einsatzleitungen[i][3];
                _t.id=einsatzleitungen[i][2];
            }
        }
        return _t;
    }
    // Speichere neuen Einsatz im Array
    function set_einsatzleitungen(_mission_id, _vehicle_id, _vehicle_type_id, _vehicle_name){
        let eNummer = -1;
        let _vehicles_missing = "";
        for(let i=0; i<einsatzleitungen.length; i++){
            if(einsatzleitungen[i][0] == _mission_id) eNummer=i;
        }
        // Einsatz noch nicht im Array
        if(einsatzleitungen.length == 0 || eNummer==-1) {
            einsatzleitungen.unshift([_mission_id, _vehicle_id, _vehicle_type_id, _vehicle_name, _vehicles_missing, false]);
            refresh_vehicle_missing(0);
            // EL in Einsatzliste eintragen
            if(ELInListe)$('<div id="einsatzleitung_fahrzeug_'+einsatzleitungen[0][0]+'"> Einsatzleitung: <a href="/vehicles/'+einsatzleitungen[0][1]+'" id="einsatzleitung_fahrzeug_'+einsatzleitungen[0][0]+'btn" class="btn btn-default btn-xs lightbox-open" style="">'+einsatzleitungen[0][3]+'</a></div>').prependTo($('#mission_panel_'+einsatzleitungen[0][0]+' .panel-body .col-xs-11'));
            return 0;
        }else{
            // Neues Fahrzeug ELW1/2 > Setze neues Fahrzeug für nachfolgende FMS
            for(let i=0; i< fuehrungsfahrzeuge.length; i++){
                if(einsatzleitungen[eNummer][2]!= _vehicle_type_id && _vehicle_type_id==fuehrungsfahrzeuge[i]){
                    einsatzleitungen[eNummer][1]=_vehicle_id;
                    einsatzleitungen[eNummer][2]=_vehicle_type_id;
                    einsatzleitungen[eNummer][3]=_vehicle_name;
                    if(ELInListe)$('#einsatzleitung_fahrzeug_'+einsatzleitungen[eNummer][0]).replaceWith('<div id="einsatzleitung_fahrzeug_'+einsatzleitungen[eNummer][0]+'"> Einsatzleitung: <a href="/vehicles/'+einsatzleitungen[eNummer][1]+'" id="einsatzleitung_fahrzeug_'+einsatzleitungen[eNummer][0]+'btn" class="btn btn-default btn-xs lightbox-open" style="">'+einsatzleitungen[eNummer][3]+'</a></div>');
                }
            }
            refresh_vehicle_missing(eNummer);
            return eNummer;
        }
    }
})(jQuery);
