/**
 * Created by thankia on 09/01/15.
 */

function setOff() {
    ajaxurl = '/' + jQuery('#title').text() + '/' + jQuery('#title').text() + '/fluxion.ajax';




    var name = arguments.callee.toString();
    var testTextBox = jQuery('#search');
    var code = null;
    testTextBox.keypress(function (e) {
        code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            if (parseInt(jQuery("#control_panel").css("left")) < 0) {
                openPanel('#search_div')
            }
            jQuery("#search_history").html(jQuery("#control_search").val());
            jQuery("#control_search").val(jQuery('#search').val());
            search_member(jQuery('#search').val());
        }
    });

    var testTextBox = jQuery('#control_search');
    var code = null;
    testTextBox.keypress(function (e) {
        code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            jQuery("#search_history").html(jQuery("#search").val());
            jQuery("#search").val(jQuery('#control_search').val());
            search_member(jQuery('#control_search').val());
        }
    });


    jQuery("#bar_image_ref").click(function (e) {
        dragtohere(e);
    });

    jQuery("#bar_image_selector").draggable(
        {
            axis: "x",
            containment: "parent",
            stop: function () {
                drawSelected();
            }
        });


    jQuery("#control_panel").draggable(
        {
            axis: "y",
            containment: "parent",
            handle: "#control_panel_handle"
        });


    function dragtohere(e) {
        var left = parseFloat(e.pageX);// - jQuery('#canvas').offset().left);
        var width = jQuery("#bar_image_selector").width()
        left -= width / 2
        jQuery("#bar_image_selector").animate({"left": left});
        drawSelected()
    }

    jQuery(document).mousemove(function (e) {
        var cpos = {top: e.pageY + 10, left: e.pageX + 10};
        jQuery('#besideMouse').offset(cpos);
    });

    var rtime = new Date(1, 1, 2000, 12, 00, 00);
    var timeout = false;
    var delta = 200;
    jQuery(window).resize(function () {
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
        }
    });

    function resizeend() {
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            timeout = false;
            resize()
        }
    }

}

function getUrlVariables(chr) {

    jQuery.urlParam = function (name) {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        else {
            return results[1] || 0;
        }
    }

    processURL(jQuery.urlParam)

}

function processURL(urlParam) {

    if (jQuery.urlParam("search") != null) {
        if (parseInt(jQuery("#control_panel").css("left")) < 0) {
            openPanel('#search_div')
        }
        jQuery('#search').val(urlParam("search"));
        jQuery('#control_search').val(urlParam("search"))
        getReferences();

        search_member(urlParam("search"))
    }
    else if (jQuery.urlParam("ref") != null && jQuery.urlParam("chr") != null) {
        getChrId(urlParam("chr"), urlParam("ref"))
    }
    else if (jQuery.urlParam("ref") != null) {
        getGenomeId(urlParam("ref"))
    }
    else if (jQuery.urlParam("query") != null){//} && jQuery.urlParam("ref") != null && jQuery.urlParam("chr") != null) {
        getMemberfromURL(urlParam("query"));
    }
    else {
        getReferences();
    }
}

function getGenomeId(ref){
    Fluxion.doAjax(
        'comparaService',
        'getGenomeId',
        {'query': ref, 'url': ajaxurl},
        {
            'doOnSuccess': function (json) {
                genome_db_id = json.ref;
                getReferences();
                changeGenome(json.ref, ref)
            }
        });
}

function getChrId(chr, ref){
    Fluxion.doAjax(
        'comparaService',
        'getChrId',
        {'query': chr, 'ref': ref, 'url': ajaxurl},
        {
            'doOnSuccess': function (json) {
                chr = json.dnafrag;
                genome_db_id = json.ref;
                getReferences();
                setCredentials(json.chr, json.ref);
                getChromosomes();
                getMember();
                select_chr()
            }
        });
}


function getMemberfromURL(query){
    Fluxion.doAjax(
        'comparaService',
        'getMemberfromURL',
        {'query': query, 'url': ajaxurl},
        {
            'doOnSuccess': function (json) {
                if(json.member_id){
                    member_id = json.member_id;
                    chr = json.dnafrag;
                    genome_db_id = json.ref;
                    getReferences();
                    getChromosomes(json.member_id);
                    getMember(json.member_id);
                    select_chr();
                    select_genome();
                    getcoreMember(json.member_id, true);
                }else{
                    getReferences()

                    if (parseInt(jQuery("#control_panel").css("left")) < 0) {
                        openPanel('#search_div')
                    }
                    jQuery("#search_history").html(jQuery("#control_search").val());
                    jQuery("#control_search").val(query);
                    jQuery("#search").val(query);
                    var content = "";

                    listResult(json)


                }

            }
        });
}

function search_from_box(){
    if (parseInt(jQuery("#control_panel").css("left")) < 0) {
        openPanel('#search_div')
    }
    jQuery("#search_history").html(jQuery("#control_search").val());
    jQuery("#control_search").val(jQuery('#search').val());
    search_member(jQuery('#search').val());
}

function resize() {
    drawChromosome();
    drawMember();
    select_chr();
    if (member_id == undefined) {
        select_member();
        drawSelected();
    } else {

        var start = 0;
        for (var i = 0; i < members.length; i++) {
            if (members[i].id == member_id) {
                start = members[i].start;
            }
        }
        rearrange_selector(member_id, start, chr);
        drawSelected();
        drawSynteny(true);
    }
}

function listResult(json){
    var content = "";

    if(json.html.length > 0){
        for (var i = 0; i < json.html.length; i++) {
            if (i == 0) {
                content += "<p id='search_hit' style='background: white;'>";
            }
            var link = "<i style='cursor:pointer' " +
                "onclick='openClosePanel(); jQuery(\"#canvas\").show(); setCredentials(" + json.html[i].dnafrag_id + "," + json.html[i].genome_db_id + "); getChromosomes(); getMember();   getcoreMember(" + json.html[i].gene_member_id + ",\"true\");' " +
                "class=\"fa fa-external-link\"></i>"

            content += "<div class='search_div' " +
                "onclick='openClosePanel(); " +
                "jQuery(\"#canvas\").show(); " +
                "setCredentials(" + json.html[i].dnafrag_id + "," + json.html[i].genome_db_id + "); " +
                "getChromosomes(); " +
                "getMember();   " +
                "getcoreMember(" + json.html[i].gene_member_id + ",\"true\");'> " +
                "<div class='search_header'> "+ json.html[i].stable_id + " <span class='badge' title='"+json.html[i].homologous+" Homologous'>"+json.html[i].homologous+"</span> </div> " +
                "<div class='search_info'> " + json.html[i].genome + " : " + json.html[i].coord_system_name + " "+ json.html[i].name + " <br> " + json.html[i].description   + "</div>" +
                "</div>";

            if (i == json.html.length - 1) {
                content += "</p>";
                jQuery("#search_result").html(content);
                jQuery("#search_result").fadeIn();
                jQuery("#search_hit").tablesorter();
            }

        }
    }
    else{
        jQuery("#search_result").html("<div style='width: 100%; text-align: center; padding-top: 15px; font-size: 15px;'>No Result found</div>");

    }
}