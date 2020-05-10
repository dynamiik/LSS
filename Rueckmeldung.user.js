// ==UserScript==
// @name         FMS-Rueckmeldung TEST
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Sendet eine FMS5 Rückmeldung über Fehlende Fahrzeuge
// @author       Dynamiite
// @match        https://www.leitstellenspiel.de/*
// @include      *://www.leitstellenspiel.de/
// @include      *://www.leitstellenspiel.de/*
// @include      *://www.missionchief.co.uk/*
// @include      *://www.missionchief.com/*
// ==/UserScript==
/* global $ */

// status 1 mission_id?
// optionen liste ein-ausblenden

////////////Einstellungen///////////////
// Einstellungen nur im Script
const originalFMSsound = false;  // FMS5 Sound ändern False = Ton aus
const FMSIcon = true;  // FMS5 Meldung einfärben
const FMSrot = "rgba(255, 104, 134, 0.2)"; // Hintergrundfarben
const FMSgelb = "rgba(255, 241, 0, 0.25)";
const FMSgruen = "rgba(61, 255, 53, 0.2)";
const ELInListe = true;
const fuehrungsfahrzeuge =  [34,3]; // Liste mit Führungsfahrzeugen. Der erste eintrag übernimmt immer die EL, falls vorhanden
const wartezeit = 15; // Wartezeit in Sekunden
// Liste mit Fahrzeug IDs: https://forum.leitstellenspiel.de/index.php?thread/8406-infos-f%C3%BCr-entwickler/&pageNo=1

// Start Einstellungen für Buttons im FMS Fenster
var verband = false; // Rueckmeldung auch bei Verbandseinsatz(true)
var nurFR = false; // Rueckmeldung nur bei eintreffen des ersten Fahrzeugs (true) Rueckmeldung bei eintreffen nachrückender Fahrzeuge(false)
var sofortBeiEintreffen=true; //Rueckmeldung obwohl noch Fahrzeuge auf anfahrt sind -> Einsatzsymbol Gelb (true) Rueckmeldung nur wenn keine Fahrzeuge auf anfahrt sind -> Einsatzsymbol rot(false)
var auchBeiVollstandigkeit=true; //Rueckmeldung auch wenn alle erforderten Fahrzeuge eingetroffen sind -> Einsatzsymbol Gruen(true)

// Language

///////////////ENDE//////////////////////
var textVerband, textAusbreitung, textASL, textBtnFR, textBtnFRinfo, textBtnAnfahrt, textBtnAnfahrtInfo, textBtnASL, textASLdauer, textBtnASLinfo, textBtnVE, textBtnVEinfo, textEinsatzleitung;
if(I18n.locale == "de_DE"){
    textVerband = "Verband"; // Verbandseinsatz text keywort aus der Missionsbeschreibung. In D wäre es das [Verband] vor dem Einsatznamen
    textAusbreitung = "ausgebreitet"; //Das Keywort das in der normalen FMS 5 Einsatzausbreitung kommt. In D wäre es ausgebreitet.
    textASL = "Es werden keine weiteren Kräfte benötigt. Bereitschaft kann aufgelöst werden."; //Abschließende Lagemeldung Text
    textASLdauer = " Gesch&auml;tzte Einsatzdauer: ";
    //Buttons
    textBtnFR = "FR";
    textBtnFRinfo = "First Responder. Rueckmeldung nur beim eintreffen des ersten Fahrzeugs"
    textBtnAnfahrt ="Anfahrt";
    textBtnAnfahrtInfo= "Rueckmeldung obwohl noch Fahrzeuge auf anfahrt sind -> Einsatzsymbol Gelb";
    textBtnASL ="ASL";
    textBtnASLinfo="Abschliessende Lagemeldung wenn alle erforderten Fahrzeuge eingetroffen sind -> Einsatzsymbol Gruen";
    textBtnVE="VE";
    textBtnVEinfo="Rueckmeldung auch bei Verbandseinsatz";
    textEinsatzleitung="Einsatzleitung";
} else if(I18n.locale == "en_US"){
    textVerband = "Alliance"; // Verbandseinsatz text keywort aus der Missionsbeschreibung. In D wäre es das [Verband] vor dem Einsatznamen
    textAusbreitung = "Upgrade"; //Das Keywort das in der normalen FMS 5 Einsatzausbreitung kommt. In D wäre es ausgebreitet.
    textASL = "All required units on scene. "; //Abschließende Lagemeldung Text
    textASLdauer = " Estimated time: ";
    //Buttons
    textBtnFR = "FR";
    textBtnFRinfo = "First Responder. Call only from first responder"
    textBtnAnfahrt ="Dispatched";
    textBtnAnfahrtInfo= "Call when units are on the way -> Mission symbol yellow";
    textBtnASL ="On scene";
    textBtnASLinfo="Call when all required units on scene -> Mission symbol green";
    textBtnVE="AM";
    textBtnVEinfo="Get Calls on Alliance Missions";
    textEinsatzleitung="Incident Command";
} else if(I18n.locale == "en_GB"){
    textVerband = "Alliance"; // Verbandseinsatz text keywort aus der Missionsbeschreibung. In D wäre es das [Verband] vor dem Einsatznamen
    textAusbreitung = "Upgrade"; //Das Keywort das in der normalen FMS 5 Einsatzausbreitung kommt. In D wäre es ausgebreitet.
    textASL = "All required units on scene. "; //Abschließende Lagemeldung Text
    textASLdauer = " Estimated time: ";
    //Buttons
    textBtnFR = "FR";
    textBtnFRinfo = "First Responder. Call only from first responder"
    textBtnAnfahrt ="Dispatched";
    textBtnAnfahrtInfo= "Call when units are on the way -> Mission symbol yellow";
    textBtnASL ="On scene";
    textBtnASLinfo="Call when all required units on scene -> Mission symbol green";
    textBtnVE="AM";
    textBtnVEinfo="Get Calls on Alliance Missions";
    textEinsatzleitung="Incident Command";
}

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
        if(t.user_id==my_user_id)t=eAusbreitung(t);
        radioMessageBuffer(t);
        init(t);
    }
    //Fügt neues DIV für Buttons hinzu. Gleich wie bei Einsatzliste oder Fahrzeugfilterliste
    $('<div class="btn-group"></div>').appendTo($('#radio_outer .panel-heading'));
    //Prüft Boolean Status und setzt die Button class
    let button_class = (nurFR) ? "btn-success" : "btn-danger";
    //Fügt Buttons in neue DIV. onclick toggelt Boolean
    $('<a href="#" class="btn '+button_class+' btn-xs " title="'+textBtnFRinfo+'" style="">'+textBtnFR+'</a>').appendTo($('#radio_outer .panel-heading .btn-group'))
        .click(function(e){
        nurFR = !nurFR;
        // Buttonfarbe wie Boolean. So oder so
        $(this).hasClass("btn-success") ? $(this).removeClass("btn-success").addClass("btn-danger"): $(this).addClass("btn-success").removeClass("btn-danger");
        return false;
    });
    button_class = (sofortBeiEintreffen) ? "btn-success" : "btn-danger";
    $('<a href="#" class="btn '+button_class+' btn-xs " title="'+textBtnAnfahrtInfo+'" style="">'+textBtnAnfahrt+'</a>').appendTo($('#radio_outer .panel-heading .btn-group'))
        .click(function(e){
        sofortBeiEintreffen = !sofortBeiEintreffen;
        $(this).hasClass("btn-success") ? $(this).removeClass("btn-success").addClass("btn-danger"): $(this).addClass("btn-success").removeClass("btn-danger");
        return false;
    });
    button_class = (auchBeiVollstandigkeit) ? "btn-success" : "btn-danger";
    $('<a href="#" class="btn '+button_class+' btn-xs " title="'+textBtnASLinfo+'" style="">'+textBtnASL+'</a>').appendTo($('#radio_outer .panel-heading .btn-group'))
        .click(function(e){
        auchBeiVollstandigkeit = !auchBeiVollstandigkeit;
        $(this).hasClass("btn-success") ? $(this).removeClass("btn-success").addClass("btn-danger"): $(this).addClass("btn-success").removeClass("btn-danger");
        return false;
    });
    button_class = (verband) ? "btn-success" : "btn-danger";
    $('<a href="#" class="btn '+button_class+' btn-xs " title="'+textBtnVEinfo+'" style=";">'+textBtnVE+'</a>').appendTo($('#radio_outer .panel-heading .btn-group'))
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
            // eNummer = ArrayIndex von aktuellem Einsatz
            // Array [mission_id, vehicle_id, vehicle_type_id, vehicle_name, fehlende Fahrzeuge Text, Boolean wurdeRückmeldungSchonGetätigt, icon]
            let eNummer = set_einsatzleitungen(mission_id, vehicle_id, vehicle_type_id, vehicle_name, "rot");
            // Missionstitle aus der Missionsliste
            var mission_title = $('#mission_caption_'+einsatzleitungen[eNummer][0]).text().search(textVerband);
            if(!verband && mission_title != -1) return;
            let _wartezeit = wartezeit*1000;
            var tout = setTimeout(function(_eNummer){
                // Farbe des Icons aus der Missionsliste
                let icon = $('#mission_panel_'+einsatzleitungen[_eNummer][0]+' img').attr('src');
                let iconfarbe = icon.split(/_|\./)[1];
                if((iconfarbe=='green' || iconfarbe=='gruen')&&auchBeiVollstandigkeit) sendRueckmeldung(_eNummer);
                if(iconfarbe=='red' || iconfarbe=='rot')sendRueckmeldung(_eNummer);
                if((iconfarbe=='yellow' || iconfarbe=='gelb')&&sofortBeiEintreffen) sendRueckmeldung(_eNummer);
            }, _wartezeit, eNummer);
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
        // Setze Icon in FMS Meldung
        if(FMSIcon)$('<img src="'+einsatzleitungen[eNummer][6]+'" id="mission_vehicle_state_fms5_icon'+einsatzleitungen[eNummer][1]+'" class="mission_vehicle_state" style="margin-left: 5px;">').insertAfter($('#radio_messages_important .radio_message_vehicle_'+einsatzleitungen[eNummer][1]+' .radio_message_close'));
        return;
    }
    //Aktuallisiere den Text aus der Missionsbeschreibung des Spiels
    function refresh_vehicle_missing(eNummer){
        // Fehlende Fahrzeuge Text aus Missionsliste
        let _vehicles_missing = $('#mission_missing_'+einsatzleitungen[eNummer][0]).text();
        let icon = $('#mission_panel_'+einsatzleitungen[eNummer][0]+' img').attr('src');
        if(_vehicles_missing == ""){
            if(einsatzleitungen[eNummer][4].search(textASL)!=-1) return;
            if(icon.split(/_|\./)[1] != "gruen") _vehicles_missing = "Lage noch nicht ausreichend erkundet.";
            else{
                _vehicles_missing=textASL;
                if($('#mission_overview_countdown_'+einsatzleitungen[eNummer][0]).text()!="") _vehicles_missing = _vehicles_missing+textASLdauer+$('#mission_overview_countdown_'+einsatzleitungen[eNummer][0]).text();
            }
        }
        // Fehlende Fahrzeuge Text geändert? Rüchmeldung zu <noch nicht getätigt>
        if(einsatzleitungen[eNummer][4]!=_vehicles_missing && einsatzleitungen[eNummer][5] && !nurFR) einsatzleitungen[eNummer][5]=false;
        einsatzleitungen[eNummer][4]=_vehicles_missing;
        einsatzleitungen[eNummer][6]=icon;
        return;
    }
    // Bei FMS5 Einsatzausbreitung Meldung von EL Fahrzeug
    function eAusbreitung(_t){
        if(_t.additionalText.search(textAusbreitung)==-1)return _t;
        for(let i=0; i<einsatzleitungen.length; i++){
            if(einsatzleitungen[i][0] == _t.mission_id){
                _t.caption=einsatzleitungen[i][3];
                _t.id=einsatzleitungen[i][2];
            }
        }
        return _t;
    }
    // Speichere neuen Einsatz im Array
    function set_einsatzleitungen(_mission_id, _vehicle_id, _vehicle_type_id, _vehicle_name, _icon){
        let eNummer = -1;
        let _vehicles_missing = "";
        for(let i=0; i<einsatzleitungen.length; i++){
            if(einsatzleitungen[i][0] == _mission_id) eNummer=i;
        }
        // Einsatz noch nicht im Array
        if(einsatzleitungen.length == 0 || eNummer==-1) {
            einsatzleitungen.push([_mission_id, _vehicle_id, _vehicle_type_id, _vehicle_name, _vehicles_missing, false, _icon]);

            refresh_vehicle_missing(einsatzleitungen.length-1);
            // EL in Einsatzliste eintragen
            if(ELInListe)$('<div id="einsatzleitung_fahrzeug_'+einsatzleitungen[einsatzleitungen.length-1][0]+'"> '+textEinsatzleitung+': <a href="/vehicles/'+einsatzleitungen[einsatzleitungen.length-1][1]+'" id="einsatzleitung_fahrzeug_'+einsatzleitungen[einsatzleitungen.length-1][0]+'btn" class="btn btn-default btn-xs lightbox-open" style="">'+einsatzleitungen[einsatzleitungen.length-1][3]+'</a></div>').prependTo($('#mission_panel_'+einsatzleitungen[einsatzleitungen.length-1][0]+' .panel-body .col-xs-11'));
            return einsatzleitungen.length-1;
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
