// ==UserScript==
// @name         Hiding Verband
// @version      1
// @description  Sachen ausblenden
// @author       Dynamiite
// @include      *://www.leitstellenspiel.de/missions/*
// @grant        none
// @namespace
// ==/UserScript==
/* global $ */
(function() {
    var sendVerband=false;
    f_sendVerband();
    // setzt Button class
    let button_class = (sendVerband) ? "btn-success" : "btn-danger";
        //Fügt Buttonhinzu. onclick toggelt Boolean und ruft Function auf 
        $('<a href="#" class="btn '+button_class+' btn-sm navbar-btn" title="statusVehicle" style=""><img alt="Hide_ffffff" class="navbar-icon" src="https://www.leitstellenspiel.de/images/alliance.svg" title="Hide"></a>').prependTo($('.navbar-header'))
            .click(function(e){
            sendVerband = !sendVerband;
            f_sendVerband();
            // Buttonfarbe wie Boolean. So oder so
            $(this).hasClass("btn-success") ? $(this).removeClass("btn-success").addClass("btn-danger"): $(this).addClass("btn-success").removeClass("btn-danger");
            return false;
        });
    function f_sendVerband(){
        if(!sendVerband){
            // blendet Freigabe buttons und chat fenster aus
            $('.alert_next_alliance').hide();
            $('.navbar-header').children().last().hide();
            $('form#new_mission_reply').hide()
        }else{
            $('.alert_next_alliance').show();
            $('.navbar-header').children().last().show();
            $('form#new_mission_reply').show()
        }
    }
})();
