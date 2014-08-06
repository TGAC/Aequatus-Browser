/**
 * Created with IntelliJ IDEA.
 * User: thankia
 * Date: 26/06/2014
 * Time: 16:30
 * To change this template use File | Settings | File Templates.
 */

function dispGenes(div, track, max, cigarline, ref, ref_cigar) {
    var gene = track.gene;

    var trackClass;

    var newStart_temp = 1;
    var newEnd_temp = max;
    var maxLentemp = jQuery(document).width()*0.8;

    console.log("maxlentemp "+maxLentemp)

    var label = "";
    var j = 0;

    var transcript_len = gene.transcripts.length;

    while (transcript_len--) {
        var gene_start;
        var gene_stop;
        var gene_length = gene.transcripts[transcript_len].length;

        var transcript_start = gene.transcripts[transcript_len].transcript_start;
        var transcript_end = gene.transcripts[transcript_len].transcript_end;

        if (gene.transcripts[transcript_len].start < gene.transcripts[transcript_len].end) {
            gene_start = gene.transcripts[transcript_len].start;
            gene_stop = gene.transcripts[transcript_len].end;
        }
        else {
            gene_start = gene.transcripts[transcript_len].end;
            gene_stop = gene.transcripts[transcript_len].start;
        }
        if (gene.transcripts[transcript_len].desc) {
            label = gene.transcripts[transcript_len].desc;
        }
        var border = " border-left: 1px solid #000000; border-right: 1px solid #000000;";
        label = gene.transcripts[transcript_len].desc;
        if (gene.transcripts[transcript_len].layer > j) {
            j = gene.transcripts[transcript_len].layer;
        }
        var top = transcript_len * 25 + 25;
        var startposition = (1) * parseFloat(maxLentemp) / (newEnd_temp - newStart_temp);
        var stopposition = ((gene_stop - gene_start) + 1) * parseFloat(maxLentemp) / (newEnd_temp - newStart_temp);
        var margin = "margin-top:15px;margin-bottom:5px;";
        if (transcript_len == 0) {
            margin = "margin-top:15px;margin-bottom:25px;";
        }

        label += gene.reference;

        if (ref) {

            var wrapper_div = jQuery("<div>").attr({
                'style': "position:relative;  cursor:pointer; height: 14px;  LEFT: 0px; width :100%;"
            }).html("<span class='handle-gene' style='position: absolute; left:105%; width: 100px; word-wrap: break-word;'>" + stringTrim(label, 100) + " </span> ").appendTo(div);


            var temp_div = jQuery("<div>").attr({
                'id': "id" + gene.member_id,
                'onClick': "onClicked('hit" + gene.member_id + "_" + transcript_len + "', '" + label + "','" + gene.member_id + "'," + JSON.stringify(gene.transcripts[transcript_len]) + ")",
//                'onClick': "jQuery('#gene_info').html('" + jQuery("#hit"+transcript_len).html() + "'); jQuery.colorbox({width: '90%',height: '90%', inline: true, href: '#gene_info'});",
                'class': "gene",
                'style': "position:relative;  cursor:pointer; height: 14px; " + margin + " LEFT:" + startposition + "px; width :" + stopposition + "px;"
            }).appendTo(wrapper_div);

            var strand = 0;
            if (ref.strand == gene.transcripts[transcript_len].strand) {
                strand = 1;
            } else {
                strand = -1;
                jQuery(wrapper_div).append("<span class=\"ui-button ui-icon ui-icon-refresh\" style=\"position: absolute; top:0px; word-wrap: break-word; left: 103%;\" onclick='flip_gene(\"hit" + gene.member_id + "_" + transcript_len + "\")'>/span>")
            }

            gene.transcripts[transcript_len].Exons.sort(sort_by('start', true, parseInt));

//            if (strand == -1) {
//
//                var temp_start = gene.transcripts[transcript_len].end - gene.transcripts[transcript_len].transcript_end;
//                var temp_end = gene.transcripts[transcript_len].transcript_start - gene.transcripts[transcript_len].start;
//                console.log(transcript_start+":"+transcript_end)
//                gene.transcripts[transcript_len].transcript_start = parseInt(gene.transcripts[transcript_len].start) + parseInt(temp_start);
//                gene.transcripts[transcript_len].transcript_end = parseInt(gene.transcripts[transcript_len].end) - parseInt(temp_end);
//
//                transcript_start = gene.transcripts[transcript_len].transcript_start;
//                transcript_end = gene.transcripts[transcript_len].transcript_end;
//                console.log(transcript_start+":"+transcript_end)
//
//                console.log(gene.transcripts[transcript_len].Exons.toJSON())
//                gene.transcripts[transcript_len].Exons = reverse_exons(gene.transcripts[transcript_len]);
//
//                jQuery("<div>").attr({
//                    'class': "",
//                    'style': "position:absolute; background:red; opacity:0.2; z-index; 599; cursor:pointer; height: 24px; top:-5px; LEFT:0px; width :100%;"
//                }).appendTo(temp_div);
//                gene.transcripts[transcript_len].Exons.sort(sort_by('start', true, parseInt));
//
//                console.log(gene.transcripts[transcript_len].Exons.toJSON())
//
//
//
//
//
//
//            }


            var temp_int;
            if (ref.transcript_start > ref.transcript_end) {
                temp_int = ref.transcript_start;
                ref.transcript_start = ref.transcript_end;
                ref.transcript_end = temp_int
            }

            gene_list_array.push(gene.member_id)


            console.log(gene_list_array)
            gapped_seq_list.push(expand_DNA_seq(formatFasta(gene.transcripts[transcript_len]), cigarline))
            cigar_list.push(cigarline)


//            console.log(formatFasta(gene.transcripts[transcript_len]))
            dispGeneExon(gene.transcripts[transcript_len], gene.strand, temp_div, gene_start, stopposition, gene_length, transcript_len);

            console.log("after exon")

            console.log(gene.member_id)
            dispCigarLine(cigarline, 1, top, ((gene_stop - gene_start) + 1), gene_start, stopposition, gene.transcripts[transcript_len].Exons.toJSON(), temp_div, ref.Exons.toJSON(), transcript_start, transcript_end, strand, ref_cigar, ref.strand, gene.transcripts[transcript_len].id);

            console.log("after cigar")
        }
        else {
            var wrapper_div = jQuery("<div>").attr({
                'style': "position:relative;  cursor:pointer; height: 14px;  LEFT: 0px; width :100%;"
            }).html("<span class='handle-gene' style='position: absolute; left:105%; width: 100px; word-wrap: break-word;'>" + stringTrim(label, 100) + " </span> ").appendTo(div);


            var temp_div = jQuery("<div>").attr({
                'id': "id"+gene.member_id,
                'class': "gene",
                'style': "position:relative;  cursor:pointer; height: 14px; " + margin + " top:10px; LEFT:" + startposition + "px; width :" + stopposition + "px;"
            }).appendTo(wrapper_div);

            console.log(gene.member_id)
            gene_list_array.push(gene.member_id)
            gapped_seq_list.push(expand_DNA_seq(formatFasta(gene.transcripts[transcript_len]), cigarline, gene.transcripts[transcript_len].stable_id))
            cigar_list.push(cigarline)
            console.log(gene_list_array)


            dispGeneExon(gene.transcripts[transcript_len], gene.strand, temp_div, gene_start, stopposition, gene_length);

            dispCigarLineRef(cigarline, 1, top, ((gene_stop - gene_start) + 1), gene_start, stopposition, gene.transcripts[transcript_len].Exons.toJSON(), temp_div, gene.transcripts[transcript_len].Exons.toJSON(), transcript_start, transcript_end, gene.transcripts[transcript_len].id);


        }


    }
}

function dispGeneExon(track, genestrand, div, gene_start, width, max_len, id) {

    var trackClass = "exon";
    var utrtrackClass = "utr";

    var disp_exon = false;
    var geneexons = track.Exons;

    if (geneexons.length > 0) {
        var strand = genestrand;

        var spanclass = "ui-icon ui-icon-carat-1-e";

        if (strand == -1 || strand == "-1") {
            spanclass = "ui-icon ui-icon-carat-1-w";
        }

//        var spanclass = "forward";
//
//        if (strand == -1 || strand == "-1") {
//            spanclass = "reverse";
//        }
        var newStart_temp = gene_start;
        var maxLentemp = width;


        var exon_len = geneexons.length;
        var startposition = 0;
        var stopposition = 0;
        var transcript_start;
        var transcript_end;

        if (track.transcript_start < track.transcript_end) {
            transcript_start = track.transcript_start;
            transcript_end = track.transcript_end;
        }
        else {
            transcript_start = track.transcript_start;
            transcript_end = track.transcript_end;
        }

        var last = null, current = null;

        while (exon_len--) {

            var exon_start;
            var exon_stop;
            if (geneexons[exon_len].start < geneexons[exon_len].end) {
                exon_start = geneexons[exon_len].start;
                exon_stop = geneexons[exon_len].end;
            }
            else {
                exon_start = geneexons[exon_len].end;
                exon_stop = geneexons[exon_len].start;
            }

            current = exon_start;

            var top = 0;


            startposition = (exon_start - newStart_temp) * parseFloat(maxLentemp) / (max_len);
            stopposition = ((exon_stop - exon_start) + 1) * parseFloat(maxLentemp) / (max_len);

//            to make up for border added
//            stopposition = stopposition - 4;


            jQuery("<div>").attr({
                'class': trackClass,
                'id': "exon" + track.id + "" + geneexons[exon_len].id,
                'style': "position:absolute; cursor:pointer; height: 10px; z-index: 999;  TOP:" + top + "px; LEFT:" + startposition + "px; width:" + (stopposition) + "px"
            }).appendTo(div);
////
//            if (stopposition > 10) {
//                if (spanclass == "forward") {
//                    startposition = startposition + (stopposition - 8)
//
//                }
//
//
//                jQuery("<div>").attr({
//                    'class' : spanclass,
//                    'style': "left:"+startposition+"px;"
//                }).appendTo(div)
//
//            }
//
            if (disp_exon) {
                jQuery("<span>").attr({
                    'class': spanclass,
                    'style': "cursor:pointer; position:absolute; z-index; 999; TOP:" + (top - 1) + "px; left:" + (startposition - 20) + "px "
                }).appendTo(div);
            }
            disp_exon = true;
        }

        var exon_len = geneexons.length;

        while (exon_len--) {

            var exon_start;
            var exon_stop;
            if (geneexons[exon_len].start < geneexons[exon_len].end) {
                exon_start = geneexons[exon_len].start;
                exon_stop = geneexons[exon_len].end;
            }
            else {
                exon_start = geneexons[exon_len].end;
                exon_stop = geneexons[exon_len].start;
            }

            current = exon_start;

            var top = 0;

            if (exon_start < transcript_start && exon_stop < transcript_start) {
                startposition = 0;// ((exon_start - newStart_temp)) * parseFloat(maxLentemp) / (max_len);
                stopposition = (exon_stop - exon_start) * parseFloat(maxLentemp) / (max_len);

//                startposition += 1;
//                stopposition -= 2;
                jQuery("<div>").attr({
                    'class': utrtrackClass,
                    'style': "TOP:" + top + "px; LEFT:" + startposition + "px; width:" + (stopposition) + "px"
                }).appendTo("#exon"+ track.id + "" + geneexons[exon_len].id);

                last = current;

            }
            else if (exon_start < transcript_start && exon_stop > transcript_end) {
                startposition = 0;//((exon_start - newStart_temp)) * parseFloat(maxLentemp) / (max_len);
                stopposition = (transcript_start - exon_start) * parseFloat(maxLentemp) / (max_len);

//                startposition += 1;
//                stopposition -= 2;

                jQuery("<div>").attr({
                    'class': utrtrackClass,
                    'style': "TOP:" + top + "px; LEFT:" + startposition + "px; width:" + (stopposition) + "px"
                }).appendTo("#exon"+ track.id + "" + geneexons[exon_len].id);

//                startposition += 1;
//                stopposition -= 2;

                startposition = ((transcript_end - exon_start) - 1) * parseFloat(maxLentemp) / (max_len);
                stopposition = (exon_stop - transcript_end + 1) * parseFloat(maxLentemp) / (max_len);


                jQuery("<div>").attr({
                    'class': utrtrackClass,
                    'style': "TOP:" + top + "px; LEFT:" + startposition + "px; width:" + (stopposition) + "px"
                }).appendTo("#exon"+ track.id + "" + geneexons[exon_len].id);

                last = current;
            }
            else if (exon_stop > transcript_start && exon_start < transcript_start) {
                startposition = 0;//((exon_start - newStart_temp)) * parseFloat(maxLentemp) / (max_len);
                stopposition = (transcript_start - exon_start) * parseFloat(maxLentemp) / (max_len);

//                startposition += 1;
//                stopposition -= 2;

                jQuery("<div>").attr({
                    'class': utrtrackClass,
                    'style': "TOP:" + top + "px; LEFT:" + startposition + "px; width:" + (stopposition) + "px"
                }).appendTo("#exon"+ track.id + "" + geneexons[exon_len].id);

                last = current;

            }
            else if (exon_stop > transcript_end && exon_start < transcript_end) {
                startposition = ((transcript_end - exon_start)) * parseFloat(maxLentemp) / (max_len);
                stopposition = (exon_stop - transcript_end) * parseFloat(maxLentemp) / (max_len);

//                startposition += 1;
//                stopposition -= 2;

                jQuery("<div>").attr({
                    'class': utrtrackClass,
                    'style': "TOP:" + top + "px; LEFT:" + startposition + "px; width:" + (stopposition) + "px"
                }).appendTo("#exon"+ track.id + "" + geneexons[exon_len].id);

                last = current;


            }
        }

    }
}