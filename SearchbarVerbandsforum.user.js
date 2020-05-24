// ==UserScript==
// @name         Forum durchsuchen
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       Dynamiite
// @match        https://www.leitstellenspiel.de/alliance_threads/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle(`.suchergebnissegefunden{background-color: #ffff67;color: black;}`);
    var forensucheVariable =""
    let searchy = $('<input type="text" search_class="missionSideBarEntrySearchable" id="search_input_field_verbandsforum" style="color: #333; width:30%; font-size:12px; border:1px solid #ccc; border-radius:4px;  background-image: url(/images/search_5a5753.svg); background-repeat: no-repeat; background-size: auto 100%; padding-left: 25px;padding-right: 20px;">')
    let butty = $('<a href="#" class="btn  btn-xs " title="Wachen suche" style="">Suche</a>')
    let buttyX = $('<a href="#" class="btn  btn-xs " title="Wachen suche" style="">Clear</a>')

    searchy.insertAfter($('#iframe-inside-container h2')[0])
    buttyX.insertAfter($('#search_input_field_verbandsforum'))
    butty.insertAfter($('#search_input_field_verbandsforum'))
    $(searchy).on('change', function(){
        if($(searchy).val()==""){
            forensucheVariable =""
            GM.setValue("suchstring", forensucheVariable);
            $('.col-md-11').removeClass('suchergebnissegefunden')
        }
    })
    $(butty).on('click', function(){
        forensucheVariable = $(searchy).val()
        GM.setValue("suchstring", forensucheVariable);
        suchenForum()
    })
    init()
    $(buttyX).on('click', function(){
        forensucheVariable =""
        $(searchy).val("")
        GM.setValue("suchstring", forensucheVariable);
        $('.col-md-11').removeClass('suchergebnissegefunden')
    })
    function suchenForum(){
        var forentexte = $('.col-md-11').filter((e,t)=>$(t).children().text().toLowerCase().includes(forensucheVariable.toLowerCase()))
        if(forensucheVariable==""){
            return
        }
        if($(forentexte).length == 0&&!$('.next').hasClass('disabled'))
            setTimeout(()=>{
                $('.next a')[0].click()
            },500)
        else{
            $(forentexte).addClass('suchergebnissegefunden')
            $(forentexte).get(0).scrollIntoView({block: "end"});
        }
    }
    async function init(){
        forensucheVariable = await GM.getValue("suchstring");
        if(forensucheVariable!=""){
            $(searchy).val(forensucheVariable)
            suchenForum()
        }
    }
})();
