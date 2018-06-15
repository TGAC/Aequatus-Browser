/**
 * Created by thankia on 09/01/15.
 */

var services;
function setOff() {
    console.log("setOff")
    ajaxurl = '/' + jQuery('#title').text() + '/' + jQuery('#title').text() + '/fluxion.ajax';

    if(jQuery('#data').text() == "rest"){
        services = "ensemblRestServices";
        jQuery("#chr_maps").hide()
        jQuery("#bar_image_ref").hide()
        jQuery("#bar_image_selector").hide()
        jQuery("#selected_region_wrapper").hide()
        testConnection()
    } else if(jQuery('#data').text() == "local"){
        services = "comparaService";
        jQuery("#chr_maps").show()
        jQuery("#bar_image_ref").show()
        jQuery("#bar_image_selector").show()
        jQuery("#selected_region_wrapper").show()
        getReferences();
    } else {
        alert("browser.data not defined properly")
    }

    //setGenomes(getUrlVariables);
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


    //jQuery("#bar_image_ref").click(function (e) {
    //    dragtohere(e);
    //});
    //
    //jQuery("#bar_image_selector").draggable(
    //    {
    //        axis: "x",
    //        containment: "parent",
    //        stop: function () {
    //            drawSelected();
    //        }
    //    });


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
        var cpos = {top: e.pageY + 20, left: e.pageX + 20};
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


function sethomologousEvents() {
    console.log("sethomologousEvents")

    ajaxurl = '/' + jQuery('#title').text() + '/' + jQuery('#title').text() + '/fluxion.ajax';
    setGenomes()
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
            search_homologous(jQuery('#search').val());
        }
    });

    var testTextBox = jQuery('#control_search');
    var code = null;
    testTextBox.keypress(function (e) {
        code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            jQuery("#search_history").html(jQuery("#search").val());
            jQuery("#search").val(jQuery('#control_search').val());
            search_homologous(jQuery('#control_search').val());
        }
    });

    jQuery("#control_panel").draggable(
        {
            axis: "y",
            containment: "parent",
            handle: "#control_panel_handle"
        });
}

function testConnection(){
    Fluxion.doAjax(
        //services, //'comparaService',
        services,
        'testRestAPI',
        {'url': ajaxurl},
        {
            'doOnSuccess': function (json) {

                if(json.ping == "1"){
                    Fluxion.doAjax(
                        //services, //'comparaService',
                        services,
                        'getRestInfo',
                        {'url': ajaxurl},
                        {
                            'doOnSuccess': function (json) {

                                console.log(json)
                                getReferences();
                            }
                        });
                }else{
                    alert("Can not establish connection with Ensembl RestAPI");
                }
            }
        });
}

function getUrlVariables(chr) {
    console.log("getUrlVariables")
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
    console.log("processURL")

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
    else if (jQuery.urlParam("query") != null) {//} && jQuery.urlParam("ref") != null && jQuery.urlParam("chr") != null) {
        getMemberfromURL(urlParam("query"), urlParam("view"));
    }
    else {
        getReferences();
    }
}

function getGenomeId(ref) {
    console.log("getGenomeId")
    Fluxion.doAjax(
        services, //'comparaService',
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

function getChrId(chr, ref) {
    console.log("getChrId")
    Fluxion.doAjax(
        services, //'comparaService',
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


function getMemberfromURL(query, view) {

    console.log("getMemberfromURL")
    Fluxion.doAjax(
        services, //'comparaService',
        'getMemberfromURL',
        {'query': query, 'view': view, 'url': ajaxurl},
        {
            'doOnSuccess': function (json) {
                if (json.member_id) {
                    member_id = json.member_id;
                    chr = json.dnafrag;
                    genome_db_id = json.ref;
                    getReferences();
                    getChromosomes(json.member_id);
                    getMember(json.member_id);
                    select_chr();
                    select_genome();
                    listResult(json)
                    setSearchList(json.html[0].stable_id)
                    getSyntenyForMember(json.member_id)
                    if (view == "tree") {
                        setTreeExport();
                        getcoreMember(json.member_id, true);
                    } else if (view == "table") {
                        setTableExport();
                        getHomologyForMember(json.member_id, "table");
                    } else if (view == "sankey") {
                        setTableExport();
                        getHomologyForMember(json.member_id, "sankey");
                    } else {
                        if (parseInt(jQuery("#control_panel").css("left")) < 0) {
                            openPanel('#search_div')
                        }

                        jQuery('#search').val(query);
                        jQuery('#control_search').val(query)
                        search_member(query)
                    }
                } else {
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


function search_from_box() {
    console.log("search_from_box")

    if (parseInt(jQuery("#control_panel").css("left")) < 0) {
        openPanel('#search_div')
    }
    jQuery("#search_history").html(jQuery("#control_search").val());
    jQuery("#control_search").val(jQuery('#search').val());
    search_member(jQuery('#search').val());
}

function resize() {
    console.log("resize")

    drawChromosome();
    console.log("resize 1")
    drawMember();
    console.log("resize 2")
    select_chr();
    console.log("resize 3")
    resizeView()
    console.log("resize 4")

    // if (member_id == undefined) {
    //     // select_member();
    //     // drawSelected();
    // } else {

    //     var start = 0;
    //     for (var i = 0; i < members.length; i++) {
    //         if (members[i].id == member_id) {
    //             start = members[i].start;
    //         }
    //     }
    //     // rearrange_selector(member_id, start, chr);
    //     // drawSelected();
    //     // prepareTree(true);
    //     resetView()
    // }
}

function listResult(json) {
    console.log("listResult")
    console.log(json.result.length)
    var content = "<p id='search_hit' style='background: white;'>";
    jQuery.each(json.result, function (key, value) {
        console.log(key, value);
        console.log("listResult 1")

        var link = "<i style='cursor:pointer' " +
            "onclick='openClosePanel(); jQuery(\"#canvas\").show(); getcoreMember(" + value.id + ",\"true\");' " +
            "class=\"fa fa-external-link\"></i>"
        console.log("listResult 2")

        var description = value.description
        console.log("listResult 3")

        if (description == null) {
            description = ""
        }
        console.log("listResult 4")

        content += "<div class='search_div' id='searchlist_" + value.id + "' > " +
            "<div class='search_header'>" +
            "<table width='100%'>" +
            "<tr><td>" + value.id + " " +
                // "<span class='badge' title='"+json.html[i].homologous+" Homologous'>"+json.html[i].homologous+"</span> " +

            "<td> <i style='color:grey' class='fa fa-1x fa-sitemap fa-rotate-270' title='View GeneTree' onclick='openClosePanel(); " +
            "jQuery(\"#canvas\").show(); " +
            "getcoreMember(\"" + value.id + "\",\"true\");'> </i>" +
            "</td>" +

            "<td> <i style='color:grey' class='fa fa-1x fa-table' title='List Homology in Table' onclick='openClosePanel(); " +
            "jQuery(\"#canvas\").show(); " +
            "getHomologyForMember(\"" + value.id + "\",\"table\");'> </i>" +
            "</td>" +

            "<td> <i style='color:grey' class='fa fa-1x fa-random' title='View Homology as Sankey Plot' onclick='openClosePanel(); " +
            "jQuery(\"#canvas\").show(); " +
            "getHomologyForMember(\"" + value.id + "\",\"sankey\");'> </i>" +
            "</td>" +
            "</tr>" +
            "</table>" +
            "</div> " +

            "<div class='search_info'> " + value[value.id].display_name + " <br> " + value[value.id].species + " : " + value[value.id].seq_region_name +
            " <br> " +
            value[value.id].description + "</div>" +
            "</div>";
    });

    // if(json.html.length > 0){
    //     for (var i = 0; i < json.html.length; i++) {


    //         if (i == json.html.length - 1) {
    content += "</p>";
    jQuery("#search_result").html(content);
    jQuery("#search_result").fadeIn();
    jQuery("#search_hit").tablesorter();
    //     }

    // }
//     }
//     else{
//         jQuery("#search_result").html("<div style='width: 100%; text-align: center; padding-top: 15px; font-size: 15px;'>No Result found</div>");

//     }
}


function setSearchList(stable_id) {
    jQuery(".search_div").removeClass("active");
    jQuery("#searchlist_" + stable_id).addClass("active");
    var clone = jQuery("#searchlist_" + stable_id).clone();
    jQuery("#searchlist_" + stable_id).remove();
    jQuery("#search_result").prepend(clone);
}

function hideGeneReference() {
    jQuery("#chr_maps").hide()
    jQuery("#bar_image_selector").hide()
    jQuery("#selected_region").hide()
    jQuery("#bar_image_ref").hide()
}

function showGeneReference() {
    jQuery("#chr_maps").show()
    jQuery("#bar_image_selector").show()
    jQuery("#selected_region").show()
    jQuery("#bar_image_ref").show()
}

function resetView() {
    jQuery(".mainview").each(function (i, div) {
        jQuery(div).html("");
    });
}
