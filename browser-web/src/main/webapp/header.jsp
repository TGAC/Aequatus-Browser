<?xml version="1.0" encoding="UTF-8" ?>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-gb">
<head>

    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">

    <link REL="SHORTCUT ICON" href="<c:url value='/images/browser/tgac_logo.png'/>">

    <link rel="stylesheet" href="<c:url value='/styles/style.css'/>" type="text/css">

    <script type="text/javascript" src="<c:url value='/scripts/scriptaculous/prototype.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/fluxion-ajax/fluxion-ajax-compiled.js'/>"></script>

    <script type="text/javascript" src="<c:url value='/scripts/jquery/js/jquery-1.4.2.min.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/jquery/js/jquery-ui-1.8.custom.min.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/jquery/js/jquery.tablesorter.min.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/jquery/js/jquery.drawinglibrary.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/jquery/js/jquery.cookie.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/jquery/js/jcanvas.min.js'/>"></script>

    <script type="text/javascript" src="<c:url value='/scripts/jquery/js/jquery.drawinglibrary.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/jquery/js/jquery.svg.min.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/jquery/js/jquery.svgdom.min.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/jquery/js/jquery.svg.pack.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/jquery/js/jquery-ui.js'/>"></script>
    <%--<script type="text/javascript"  src="<c:url value='/scripts/jquery/js/jquery.jqplot.js'/>"></script>--%>
    <%--<script type="text/javascript"  src="<c:url value='/scripts/jquery/js/jqplot.canvasAxisLabelRenderer.js'/>"></script>--%>
    <%--<script type="text/javascript"  src="<c:url value='/scripts/jquery/js/jqplot.canvasTextRenderer.js'/>"></script>--%>

    <script src="<c:url value='/scripts/d3.js/d3.v3.min.js'/>"></script>
    <%--<script src="http://d3js.org/d3.v3.js"></script>--%>


    <script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/rgbcolor.js"></script>
    <script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/canvg.js"></script>


    <link rel="stylesheet" href="<c:url value='/scripts/jquery/css/smoothness/jquery-ui-1.8.custom.css'/>"

          type="text/css">
    <script type="text/javascript" src="<c:url value='/scripts/jquery/colorbox/jquery.colorbox-min.js'/>"></script>
    <link rel="stylesheet" href="<c:url value='/scripts/jquery/colorbox/colorbox.css'/>"
          type="text/css">
    <script type="text/javascript">jQuery.noConflict();</script>

    <!--Browser Functions-->
    <script type="text/javascript" src="<c:url value='/scripts/init.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/browser.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/sequenceController.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/trackController.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/popup.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/getset.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/utils.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/search_compara.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/uploadTrackController.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/circular.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/geneView.js'/>"></script>

    <title>${initParam.pageTitle}</title>
    <script type="text/javascript">

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-21666189-7']);
        _gaq.push(['_trackPageview']);

        (function () {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();

    </script>
</head>
<body>


<div class="headerbar">
    <div id="dbinfo"></div>

    <center>

        <table width="100%">
            <tr>
                <td>
                    <a class="headerlink" href="<c:url value="/"/>"> <font color=white> TGAC Browser
                    - ${initParam.header} </font></a>
                </td>
                <td>
                    <font color=white>
                        <span id="seqnameh1"></span>
                    </font>
                </td>
                <td>
                    <input type="text" id="search" name="search"/>
                    <a href="javascript:void(0)" id="search_button" class="ui-state-default ui-corner-all" onclick="fun()">Search</a>
                    <script type="text/javascript">
                        function fun(){

                               alert("searching here");
                               var val_search= jQuery("#search").val();
                               alert(val_search);
//                               jQuery

                        }
                    </script>
                </td>
            </tr>
        </table>
    </center>

</div>


<div id="filetrack" style="visibility: hidden; position: fixed;">${initParam.trackfiles}</div>
<div id="title" style="visibility: hidden; position: fixed;">${initParam.urlpath}</div>
<div id="linkLocation" style="visibility: hidden; position: fixed;">${initParam.linkLocation}</div>
<div id="blastLocation" style="visibility: hidden; position: fixed;">${initParam.blastLocation}</div>
<div id="blastType" style="visibility: hidden; position: fixed;">${initParam.blastType}</div>
<div id="fasta" style="visibility: hidden; position: fixed;">${initParam.fasta}</div>


<div id="content">