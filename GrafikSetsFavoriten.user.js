// ==UserScript==
// @name         Graphicsets
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Fügt Grafiksetfavs hinzu
// @author       Dynamiite
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.co.uk/
// @match        https://www.missionchief.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // ["URL vom Grafikset anwenden Button", "Beliebiger name der im Spiel angezeigt werden soll"]
    let graphicsets_urls = [
        ["https://www.leitstellenspiel.de/profile/mission_graphic/1", "HardyAkaReaper - 39 x 35"],
        ["https://www.leitstellenspiel.de/profile/vehicle_graphic/818", "Fahrzeuge von firehero92"]
    ];
    let graphicsets_button = $('ul.dropdown-menu > li .lightbox-open').filter((e,t)=>$(t).text().includes("Grafikset")||$(t).text().includes("Graphic Packs"))

    $(graphicsets_button).parent().after('<li role="presentation" class="dropdown" id="dropdown_graphic_settings"><a href="#" id="graphics_button_a" role="button"'
                                         +'class="dropdown-toggle" data-toggle="dropdown">'
                                         +'<img class="icon icons8-Picture" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAChElEQVRoQ+2Z7XETMRiEdyuADiAVBCogqQCoIKQCSAekAkgFhA7oAKcCkgqACggVLLM3Os9ZuQ/JvhtLwZrxH/t82kfvpySi8sHK9aN+AEmvarYCJemxANxUBtJ4ztoCJKuKh9ZzNgAkPQVwXLgl7kjeDwGcAPheOMApydUUwG8A14WBvAPwDEASwA1JW6OYIWkFwIF7ANiLVQ4WWGrZJZ0BeA7gnuTV0DxFWkDSZwDvO6JvSb7sgygOQJJX/WeP2Lckv8XfLwYgyfn5NYBzV8hUV5M0VDQvSNoyG2MRgCD+S5jpNuToHAg/+yTSekTy1+IAkizcq+/hyu0quSJ5mmGFFwDsLv7vXwAfSPZ2ALNaoCPekxrCVdIWsJBrkuepEH7OTeSU+80GEIk/IWnhFuHVNIhdIhtiCnhngNBqu1O1UK/8Wnw7eQRxSfLjlLDU33cCiMTb39+0K98TbAb8Eb53Zpqlq90aIBJ/F1Z+NNNE2WkQIjz3KbjcxZg1tgIILmG38U4tSXzHnRzcbYptWuCuwAjSP43GTTaAU1rYnVm8N/x2m+QcHwLb7/AK+3+GaAO+C3cZ5hoN/lwAFxIL9+cryTbfp8bc+jlJjgE3bA1ESAKtZRr3SslguQCtgJ3Ed9ypC+FF8diIjSmIbQCuSNoFZhkdAQ/ED6ThjZjIBZh1T5yalcYK4t4AcsSPWWKfAH9CMsgqanFMADjay6mEJMeRt4vZFTmCaA1U17FKD0RdAD2BXR9AgPi/TubcSmQH3SwVb/glbmd8kpHkQgtr2en1owDuU7whKXn48Kv/gqNk1bG2BxccYUNeE0Nzf/EorlmLuonJdYGqrlb74A4AuSaf+/l/zZY/Nx3TRV0AAAAASUVORK5CYII=" width="24" height="24">'
                                         +'<span class=""> Grafiksets </span><b class="caret"></b></a></li>');
    $('<ul id="graphics_ul" class="dropdown-menu" role="menu" aria-labelledby="news">'
      +'<li id="dropdown_graphic_settings_1" role="presentation"></li></ul>').appendTo('#dropdown_graphic_settings');
    $(graphicsets_button).appendTo('#dropdown_graphic_settings_1')
    $('#graphics_button_a').click(()=>{
        //$('#graphics_ul').css('display','block')
        $('#graphics_ul').toggle()
        setTimeout(()=>$('#menu_profile').click(),50)
    })
    graphicsets_urls.map((e,t)=>{
        let imagey ='<img class="icon icons8-Siren-Filled" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADcElEQVRoQ+2Z/XETMRDF91WAUwFQAaQCoAJIBSQVABUQKoBUgFNBQgVABSQVQCogqeAxz0ge5aw7Sau7GYax/rFnrK/frvbtSoY5Gsm1mb00s0MAvxxT7AwhuTKzn2Z2DuBt65xoHaD+AeR1WPTYM8dwDMlTM3vvndML8ihYT/t53OuVxBvyims+F8jcXun1hvbTAzKLV+bwRhfIwCsnACQAzY2kYuyzNzbigm6PBBCd6WMAn5oJkgEkpVJrALfeebpAvIsuMW4PsoRVe+b8fzxCUmWB2imAc49VSD43szdmpk8JQE27MrNLMzvzBjlJVReqCFYgqQmfhJVVN1UDhRwg6XxVs/ORPlIqrXlWO0cCoFymdrM5WkHLRfYwAToCIMhsCxBfzeypmd2ZmSRYElpVRAYvKofIqmoaezIFQ1JrXZjZFiAYYX0vRgZAk0mOpDau43Qtj9QCDDeaJET9JOPpuI0ZLybPmwgQO2aDXdYC8G1iwrQ8USk/6rma45LA3AI4KHgluzeXaiXe0N1hrjJehntmZq5yxwvyI8TGiynP1Xgj9gllykdvzeUFoTYAwDU+BxiCX+LxHYBkvKk1b4RkjI87ALU5o7ipoIK/zawYJ7nJPCCylttyhUB2e9oDEiXwC4CeRLjDlCTnZiX0gMRHgg8A9H22RjIqV7OIeECUsPQU5JLJwtFyG8kD4rZayXXJI0Sztz0gUhb3s00pa3uFZAck6LkybLa8JulWlgqPREW8AnCYqctkQD3iSWjulVBbkACgTjEZ7cRAkrSuAagSnb1NGWpQYApER3ADpPuINp4CbErynCL1Zt8aapK6nzwws4PchSvEkV5d1EftL1C0QHKnEET2WSYJRh275ofmSpCimIQqQOtvgQSie4U2PgqQFHbxDtKsKjUQ6kOyWt4ToFWTavUkrAYQVy5pBZm9fM8ok6sEagVZTHqT4+sqSqtBlirfMx6J14Smcr4FxGWp2thI+3mSbguI6+w6QeJbW3UV3ALiUhMnSDGXDOdtAdEfOXpMe9f7f0gJLnmlqc5XLSDNVipteOx3TwXRArJY+Z5RrmZhGQUhGZOf17BLjLsEcJSbeApkk/z+tTb2llYEmfMRrscopdyyB+mxrmfs3iMlC3is2jOmtJ9ijPQsvsRYj2rFTL7Efrxzjr43/wE/Kgjg5EADGQAAAABJRU5ErkJggg==" width="15" height="15">'
        if(!e[0].includes('mission_graphic'))
            imagey = '<img class="icon icons8-Ambulance" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAC/UlEQVR4Xu2b7VUVMRCGZypQK0AqECsQKhArUCpAKsAOwArECsAOoALsQKgAOhjPe84sZ2/YbCab5N7dbPL3ZjOZJ28yk4/LtPLCK/efGoCmgJUTaFNgDgIQkfdEdEFEB9qfv0R0xswPpfu3cwWo8/dE9NZx9pmIPpaGMAcAN0T02TPSf5j5uKQK5gDgaWD0O58fmHm/dgAy5iAzFx2koo1bRk5E5gEg1BGLMzusc8LMV1Psvyhg4QAQMY6YGeEzqtQCAE5PCps1AQAEKABKAAxT8QIovfqaeheoJCI/iOjcqXbLzEfW9hcNAE6KCBa/r47DV8x8YoGweAAKAdL/4DiMvcRlCEItALCPuB2AEAyPVQBQFWAnCQhveqMeDI/VAOhBwM6yX0bD49YBuAlX7mgjIt+I6JcDwRseqwOgSjCHxyoBxITHagFYw2PtAILhsWoAI+GRusW3GIDU7XXO6CAiyBE2wuOqAKgSNk6eGgA9a1zFFNiJAny7sNKZYKzdYgqI7Uho25r6uw98A9CR3ZY0t2XHVUxTgHMBUzwMtjUgddXK/P1spkBmv8zNZQOgDxpOiQj39njZgYKXHLjn/1n6QcNU+1kAiAiesXwPYL9k5jPz0ERUTLGfDEBEcM6G8zZLMV9MWBrTVDbJfhIAEcEFA2QfUzAdQmoxtZfD/mQAOuf+OT191KmAc3iUQyICpD2n3n7qmpDLfgoAd/Th/IF7AysiOH7C8XMfQrIKBkZ/kv1oACPa/MLMWPFfFRFBZLg26Xp6pSz2g5ngSP/e+e7fPXKd7urwl1nsNwChE6HVTQGfwwOLELI+PGHdeIaiiyBOXrvsEE2WWASz2g++E/TMa3QCMf5OwX3SMNh3Hj+VCoPZ7AcBaBa2+ETIp3ATAIUw9BbH1+5vZramzaYo4XkLlGzfDCBCCcnzPmI9GqoaZT8KgELAPMf8R9LTZX3IzpAcYSdY9E8OuiZlsx8NwKTXBVVqABY0WEW62hRQBOuCGm0KWNBgFenq6hXwH/kYT1/4UtMbAAAAAElFTkSuQmCC" width="15" height="15">'
        $('<li id="dropdown_graphic_settings_'+t+'"></li>').appendTo('#dropdown_graphic_settings .dropdown-menu');
        $('<a href="#" class="">'+imagey+' '+e[1]+'</a>').appendTo('#dropdown_graphic_settings_'+t).click(()=>ajaxtest(e[0]))
        //$('<a href="'+e[0]+'" class="lightbox-open">'+imagey+' '+e[1]+'</a>').appendTo('#dropdown_graphic_settings_'+t).click(()=>setTimeout(()=>window.location.reload(),500))
    })
    function ajaxtest(_url){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.reload()
            }
        };
        xhttp.open("GET", _url, true);
        xhttp.send();
    }
})();
