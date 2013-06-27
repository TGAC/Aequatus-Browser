/*
 *
 * Copyright (c) 2013. The Genome Analysis Centre, Norwich, UK
 * TGAC Browser project contacts: Anil Thanki, Xingdong Bian, Robert Davey, Mario Caccamo @ TGAC
 * **********************************************************************
 *
 * This file is part of TGAC Browser.
 *
 * TGAC Browser is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * TGAC Browser is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with TGAC Browser.  If not, see <http://www.gnu.org/licenses/>.
 *
 * ***********************************************************************
 *
 */

/**
 * Created with IntelliJ IDEA.
 * User: thankia
 * Date: 4/29/13
 * Time: 3:48 PM
 * To change this template use File | Settings | File Templates.
 */
var blastbinary = jQuery("#blastLocation").html();

function blastSearch(query, db, type) {
    blastbinary = jQuery("#blastLocation").html();
    jQuery("#notifier").html("<img src='images/browser/loading2.gif' height='10px'> BLAST running ");
    jQuery("#notifier").show();
    var database = db.split(":");
    db = database[0];
    var id = randomString(8);
    var link = database[1];


    var location = jQuery('#title').text();

    ajaxurl = '/' + jQuery('#title').text() + '/' + jQuery('#title').text() + '/fluxion.ajax';
    Fluxion.doAjax(
        'blastservicelocal',
        'blastSearchSequence',
        {'query': query, 'blastdb': db, 'location': location, 'type': type, 'url': ajaxurl, 'BlastAccession': id, 'blastBinary': blastbinary, 'link': link},
        {'doOnSuccess': function (json) {
            jQuery('#main').animate({"height": "0px"}, { duration: 300, queue: false});
            jQuery('#main').fadeOut();
            parseBLAST(json);
            //jQuery('#blastresult').html(json.html);
            jQuery("#notifier").hide()
            jQuery("#notifier").html("");
        }
        });
}


function blastTrackSearch(query, start, end, hit, db, type) {
    blastbinary = jQuery("#blastLocation").html();
    jQuery("#notifier").html("<img src='images/browser/loading2.gif' height='10px'> BLAST running ");
    jQuery("#notifier").show();
    if (!window['blasttrack']) {

        jQuery("#tracklist").append("<p title='blast' id=blastcheck><input type=\"checkbox\" checked id='blasttrackCheckbox' name='blasttrackCheckbox' onClick=loadTrackAjax(\"blasttrack\",\"blasttrack\");\>  Blasttrack\  </p>");

        jQuery("#mergetracklist").append("<span id=blasttrackspan> <input type=\"checkbox\" id='blasttrackmergedCheckbox' name='blasttrackmergedCheckbox' onClick=mergeTrack(\"blasttrack\"); value=blasttrack >Blast Track</span>");

        jQuery("#tracks").append("<div id='blasttrack_div' class='feature_tracks'> Blast Track </div>");

        jQuery("#blasttrack_div").html("<img style='position: relative; left: 50%; ' src='./images/browser/loading_big.gif' alt='Loading'>")
        jQuery("#blasttrack_div").fadeIn();

        track_list.push(
            {name: "blasttrack", display_label: "blasttrack", id: 0, desc: "blast from browser", disp: 1, merge: 0}
        );
        window['blasttrack'] = "running";
    }

    ajaxurl = '/' + jQuery('#title').text() + '/' + jQuery('#title').text() + '/fluxion.ajax';
    var location = jQuery('#title').text();
    var database = db.split(":");
    db = database[0];
    var id = randomString(8);
    var link = database[1];
    blastid = id;
    blastdb = db;
    blastsdata.push(
        {
            id: id,
            start: start,
            end: end,
            db: blastdb,
            hit: hit,
            link: link,
            format: 5,
            type: type
        });

    Fluxion.doAjax(
        'blastservicelocal',
        'blastSearchTrack',
        {'query': query, 'blastdb': db, 'location': location, 'url': ajaxurl, 'start': start, 'end': end, 'hit': hit, 'BlastAccession': id, 'type': type, 'blastBinary': blastbinary},
        {'doOnSuccess': function (json) {
            findAndRemove(blastsdata, 'id', json.id);

            if (blastsdata.length == 0) {
                jQuery("#notifier").hide()
                jQuery("#notifier").html("");
            }
            if (!window['blasttrack']) {
                window['blasttrack'] = "running";
            }
            if (window['blasttrack'] == "running") {
                window['blasttrack'] = json.blast;//(decodeURIComponent(json.blast.replace(/\s+/g, ""))).replace(/>/g, "");
            }
            else {
                jQuery.merge(window['blasttrack'], json.blast);
            }
            jQuery('input[name=blasttrackCheckbox]').attr('checked', true);
            trackToggle("blasttrack");
        }
        });
}

function checkTask(task, db, format, start, end, hit, link) {
    jQuery("#notifier").html("<img src='images/browser/loading2.gif' height='10px'> BLAST running ");
    jQuery("#notifier").show();
    if (!window['blasttrack']) {

        jQuery("#tracklist").append("<p title='blast' id=blastcheck><input type=\"checkbox\" checked id='blasttrackCheckbox' name='blasttrackCheckbox' onClick=loadTrackAjax(\"blasttrack\",\"blasttrack\");\>  Blasttrack\  </p>");

        jQuery("#mergetracklist").append("<span id=blasttrackspan> <input type=\"checkbox\" id='blasttrackmergedCheckbox' name='blasttrackmergedCheckbox' onClick=mergeTrack(\"blasttrack\"); value=blasttrack >Blast Track</span>");

        jQuery("#tracks").append("<div id='blasttrack_div' class='feature_tracks'> Blast Track </div>");

        jQuery("#blasttrack_div").html("<img style='position: relative; left: 50%; ' src='./images/browser/loading_big.gif' alt='Loading'>")
        jQuery("#blasttrack_div").fadeIn();

        track_list.push(
            {name: "blasttrack", display_label: "blasttrack", id: 0, desc: "blast from browser", disp: 1, merge: 0}
        );
        window['blasttrack'] = "running";
    }

    ajaxurl = '/' + jQuery('#title').text() + '/' + jQuery('#title').text() + '/fluxion.ajax';
    var location = jQuery('#title').text();

    Fluxion.doAjax(
        'blastservicelocal',
        'checkBlast',
        {'url': ajaxurl, 'start': start, 'end': end, 'hit': hit, 'BlastAccession': task, 'location': location, 'link': link},
        {'doOnSuccess': function (json) {

            findAndRemove(blastsdata, 'id', json.id);

            if (blastsdata.length == 0) {
                jQuery("#notifier").hide()
                jQuery("#notifier").html("");
            }
            if (!window['blasttrack']) {
                window['blasttrack'] = "running";
            }
            if (window['blasttrack'] == "running") {
                window['blasttrack'] = json.blast;//(decodeURIComponent(json.blast.replace(/\s+/g, ""))).replace(/>/g, "");
            }
            else {
                jQuery.merge(window['blasttrack'], json.blast);
            }
            jQuery('input[name=blasttrackCheckbox]').attr('checked', true);
            trackToggle("blasttrack");
        }
        });
}
