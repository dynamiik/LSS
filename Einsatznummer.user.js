// ==UserScript==
// @name         Einsatznummern
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Dynamiite
// @match        *.leitstellenspiel.de/missions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $('#mission_general_info small').text($('#mission_general_info small').text()+'- ID: '+$('#mission_help').attr('href').split('/')[2].split('?')[0]);
})();
