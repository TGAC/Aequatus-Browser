/**
 * Created with IntelliJ IDEA.
 * User: thankia
 * Date: 28/11/14
 * Time: 15:13
 * To change this template use File | Settings | File Templates.
 */

var mouseX, mouseY;

function newpopup(member_id) {

    var gene;
    var stable_id;

    jQuery('#stable_label').html("")


    jQuery('#makemetop_button').html("")

    jQuery('#ref_name').html("")

    jQuery('#position').html("")

    jQuery('#disp_label').html("")

    jQuery('#gene_desc').html("")

    jQuery('#ensemblLink').html("")


    if (mouseX + jQuery("#popup").width() > jQuery("#main1").width()) {
        jQuery("#popup").css({"left": mouseX - jQuery("#popup").width() - 5});
        jQuery("#popup").css({"top": (mouseY - jQuery("#popup").height() - 30)});
        jQuery("#popup").attr('class', 'bubbleright')
    }
    else {
        jQuery("#popup").css({"left": (mouseX - 26)});
        jQuery("#popup").css({"top": (mouseY - jQuery("#popup").height() - 30)});
        jQuery("#popup").attr('class', 'bubbleleft')
    }

    jQuery("#popup").fadeIn();


    if (syntenic_data.member[member_id]) {
        gene = syntenic_data.member[member_id].genes.gene;
        stable_id = syntenic_data.member[member_id].stable_id
    } else if (syntenic_data.ref.genes.gene.member_id) {
        gene = syntenic_data.ref.genes.gene;
        stable_id = syntenic_data.ref.genes.gene.stable_id
    } else {
        return;
    }
    var desc = gene.desc

    Fluxion.doAjax(
        'comparaService',
        'getInfoForCoreMember',
        {'query': member_id, 'url': ajaxurl},
        {
            'doOnSuccess': function (json) {
                jQuery('#stable_label').html(stable_id)

                jQuery('#makemetop_button').html("<button onclick=' changeReference(\"" + member_id + "\") '>Make Me Root</button>")

                jQuery('#ref_name').html("Chr " + json.info.name)

                jQuery('#position').html(json.info.dnafrag_start + " - " + json.info.dnafrag_end)

                jQuery('#disp_label').html(json.info.display_label)

                jQuery('#gene_desc').html(stringTrim(desc, 200))

                jQuery('#ensemblLink').html("<a target='_blank' href='http://www.ensembl.org/Multi/Search/Results?q=" + stable_id + "'><button>Link to Ensembl</button></a>")
            }
        });



}

function removePopup() {
    jQuery("#popup").fadeOut()
}