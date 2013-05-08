package uk.ac.bbsrc.tgac.browser.service.ajax;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sourceforge.fluxion.ajax.Ajaxified;
import net.sourceforge.fluxion.ajax.util.JSONUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXParseException;

import javax.servlet.http.HttpSession;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: thankia
 * Date: 5/8/13
 * Time: 12:25 PM
 * To change this template use File | Settings | File Templates.
 */

@Ajaxified

public class BlastNCBI {

  private Logger log = LoggerFactory.getLogger(getClass());
  private BlastService blastService;

  public JSONObject ncbiBlastSearchTrack(HttpSession session, JSONObject json) throws IOException {
    try {

      String blastdb = json.getString("blastdb");
      StringBuilder sb = new StringBuilder();
      String query = json.getString("querystring");
      query = query.replaceAll(">+", "#>");
      String urlParameters = "QUERY=" + query +
                             "&PROGRAM=" + "blastn" +
                             "&DATABASE=" + blastdb +
                             "&ALIGNMENT_VIEW=" + "XML" +
                             "&ALIGNMENTS=" + "100";
      log.info("urlparam\t\t" + urlParameters);
      URL url = new URL("http://www.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Put&");

      HttpURLConnection connection = (HttpURLConnection) url.openConnection();
      connection.setDoOutput(true);
      connection.setDoInput(true);
      connection.setInstanceFollowRedirects(false);
      connection.setRequestMethod("POST");
      connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
      connection.setRequestProperty("charset", "utf-8");
      connection.setRequestProperty("Content-Length", "" + Integer.toString(urlParameters.getBytes().length));
      connection.setUseCaches(false);

      DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
      wr.writeBytes(urlParameters);
      wr.flush();
      wr.close();
      DataInputStream input = new DataInputStream(connection.getInputStream());

      String str;

      while (null != (str = input.readLine())) {
        Pattern p = Pattern.compile("<input name=\"RID\" size=\"50\" type=\"text\" value=\"(.*)\" id=\"rid\" />");
        Matcher matcher_comment = p.matcher(str);
        if (matcher_comment.find()) {
          sb.append(matcher_comment.group(1));
        }
      }

      input.close();
      connection.disconnect();

      String result = null;
      result = sb.toString();

      return JSONUtils.JSONObjectResponse("html", result);
    }
    catch (Exception e) {
      e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
      return JSONUtils.SimpleJSONError(e.getMessage());
    }

  }

  public JSONObject ncbiBlastGetResultTrack(HttpSession session, JSONObject json) throws IOException {
    try {
      String blastAccession = json.getString("BlastAccession");
//      String blastDB = json.getString("db");
      int query_start = json.getInt("start");
      int query_end = json.getInt("end");
      int noofhits = json.getInt("hit");
      String location = json.getString("location");
      JSONObject jsonObject = new JSONObject();
      JSONArray jsonArray = new JSONArray();
      String urlParameters = "RID=" + blastAccession +
                             "&ALIGNMENT_VIEW=XML" +
                             "&FORMAT_TYPE=XML";// + blastdb +

      StringBuilder sb = new StringBuilder();
      String str;
      int i = 0;
      JSONArray blasts = new JSONArray();
      sb.append(connectNCBI(urlParameters));//;new DataInputStream(connection.getInputStream());
      str = connectNCBI(urlParameters);
      while (str == "running") {
        str = connectNCBI(urlParameters);
        if (str == "finished") {
//            log.info(parseNCBIXML(urlParameters, query_start, query_end, noofhits, location).toString());
          blasts = parseNCBIXML(urlParameters, query_start, query_end, noofhits, location, blastAccession);
          break;
        }
      }

      JSONObject blast_response = new JSONObject();
       blast_response.put("id", json.getString("BlastAccession"));
      blast_response.put("blast", blasts);
      return blast_response; //JSONUtils.JSONObjectResponse("blast", result);

    }

    catch (Exception err) {
      throw new RuntimeException(err);
    }
  }

  private JSONArray parseNCBIXML(String urlParameters, int query_start, int query_end, int noofhits, String location, String blastAccession) {
    log.info("parse XML");
    log.info(urlParameters);

    try {
      StringBuffer sb = new StringBuffer();
      String str, str1 = "";
      URL url = new URL("http://www.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&");

      HttpURLConnection connection = (HttpURLConnection) url.openConnection();
      connection.setDoOutput(true);
      connection.setDoInput(true);
      connection.setInstanceFollowRedirects(false);
      connection.setRequestMethod("POST");
      connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
      connection.setRequestProperty("charset", "utf-8");
      connection.setRequestProperty("Content-Length", "" + Integer.toString(urlParameters.getBytes().length));
      connection.setUseCaches(false);
      log.info(urlParameters);

      DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
      wr.writeBytes(urlParameters);
      wr.flush();
      wr.close();
      DataInputStream input = new DataInputStream(connection.getInputStream());
      //      log.info(input.readLine());
      BufferedWriter out = new BufferedWriter(new FileWriter("../webapps/" + location + "/temp/"+blastAccession+".json"));
      String hsp_from = "";

      String hsp_score = "";

      String hsp_to = "";
      String hit_id = "";
      String mid_line = "";
      String hsp_hseq = "";
      String hsp_qseq = "";
      int findHits = 1;
      int in = 0;
      JSONArray blasts = new JSONArray();
      while (null != (str = input.readLine())) {
        Pattern p = Pattern.compile("<Hit_def>(.*)</Hit_def>");
        Matcher matcher_comment = p.matcher(str);
        if (matcher_comment.find()) {
          hit_id = (matcher_comment.group(1));
        }

        p = Pattern.compile("<Hsp_query-from>(.*)</Hsp_query-from>");
        matcher_comment = p.matcher(str);
        if (matcher_comment.find()) {
          hsp_from = (matcher_comment.group(1));
        }

        p = Pattern.compile("<Hsp_query-to>(.*)</Hsp_query-to>");
        matcher_comment = p.matcher(str);
        if (matcher_comment.find()) {
          hsp_to = (matcher_comment.group(1));
        }

        p = Pattern.compile("<Hsp_score>(.*)</Hsp_score>");
        matcher_comment = p.matcher(str);
        if (matcher_comment.find()) {
          hsp_score = (matcher_comment.group(1));
        }

        p = Pattern.compile("<Hsp_midline>(.*)</Hsp_midline>");
        matcher_comment = p.matcher(str);
        if (matcher_comment.find()) {
          mid_line = (matcher_comment.group(1));
        }

        p = Pattern.compile("<Hsp_hseq>(.*)</Hsp_hseq>");
        matcher_comment = p.matcher(str);
        if (matcher_comment.find()) {
          hsp_hseq = (matcher_comment.group(1));
        }

        p = Pattern.compile("<Hsp_qseq>(.*)</Hsp_qseq>");
        matcher_comment = p.matcher(str);
        if (matcher_comment.find()) {
          hsp_qseq = (matcher_comment.group(1));
        }
        if (hit_id != "" && hsp_from != "" && hsp_to != "" && hsp_to != "" && hsp_score != "" && mid_line != "" && hsp_hseq != "" && hsp_qseq != "") {
          JSONObject eachBlast = new JSONObject();
          JSONObject eachIndel = new JSONObject();
          JSONArray indels = new JSONArray();

          eachBlast.put("start", query_start + Integer.parseInt(hsp_from));
          eachBlast.put("end", query_start + Integer.parseInt(hsp_to));
          eachBlast.put("desc", hit_id);
          eachBlast.put("score", hsp_score);
          eachBlast.put("flag", false);
          eachBlast.put("reverse", "");
          if (mid_line.split(" ").length > 1) {
            String[] newtemp = mid_line.split(" ");
            int ins = 0;
            for (int x = 0; x < newtemp.length - 1; x++) {
              ins = ins + ((newtemp[x].length() + 1));
              eachIndel.put("position", ins + in);
              eachIndel.put("query", hsp_qseq.substring((ins - 3) > -1 ? (ins - 3) : 0, (ins + 2) <= hsp_qseq.length() ? (ins + 2) : hsp_qseq.length()));
              eachIndel.put("hit", hsp_hseq.substring((ins - 3) > -1 ? (ins - 3) : 0, (ins + 2) <= hsp_hseq.length() ? (ins + 2) : hsp_hseq.length()));
              indels.add(eachIndel);
//              ins = (newtemp[x].length() + 1);
            }
          }
          eachBlast.put("indels", indels);
          blasts.add(eachBlast);
          findHits++;
          if (findHits > noofhits) {
            break;
          }
          log.info(hit_id + " " + hsp_from + " " + hsp_to + " " + hsp_to + " " + hsp_score + " " + mid_line + " " + hsp_hseq + " " + hsp_qseq);
          hit_id = "";
          hsp_from = "";
          hsp_to = "";
          hsp_to = "";
          hsp_score = "";
          mid_line = "";
          hsp_hseq = "";
          hsp_qseq = "";
        }

      }

//      else {
//        blasts.add("No hits found.");
//      }
      out.write(blasts.toString());
      out.close();

      return blasts;
    }

    catch (Exception e) {
      JSONArray er = new JSONArray();
      e.printStackTrace();
      er.add(JSONUtils.SimpleJSONError(e.getMessage()));
      return er;
    }
  }

  public JSONObject ncbiBlastSearchSequence(HttpSession session, JSONObject json) throws IOException {
    try {
      log.info("blast search");
      log.info(json.toString());
      String blastdb = json.getString("blastdb");
      StringBuilder sb = new StringBuilder();
      String query = json.getString("querystring");
      String type = json.getString("type");
      query = query.replaceAll(">+", "#>");
      String urlParameters = "QUERY=" + query +
                             "&PROGRAM=" + type +
                             "&DATABASE=" + blastdb +
                             "&ALIGNMENT_VIEW=" + "Tabular" +
                             "&ALIGNMENTS=" + "100";

      URL url = new URL("http://www.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Put&");

      HttpURLConnection connection = (HttpURLConnection) url.openConnection();
      connection.setDoOutput(true);
      connection.setDoInput(true);
      connection.setInstanceFollowRedirects(false);
      connection.setRequestMethod("POST");
      connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
      connection.setRequestProperty("charset", "utf-8");
      connection.setRequestProperty("Content-Length", "" + Integer.toString(urlParameters.getBytes().length));
      connection.setUseCaches(false);
      log.info(urlParameters);
      DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
      wr.writeBytes(urlParameters);
      wr.flush();
      wr.close();
      DataInputStream input = new DataInputStream(connection.getInputStream());

      String str;

      while (null != (str = input.readLine())) {
        log.info(str);
        Pattern p = Pattern.compile("<input name=\"RID\" size=\"50\" type=\"text\" value=\"(.*)\" id=\"rid\" />");
        Matcher matcher_comment = p.matcher(str);
        if (matcher_comment.find()) {
          sb.append(matcher_comment.group(1));
        }
      }
      input.close();
      connection.disconnect();

      String result = null;
      result = sb.toString();

      return JSONUtils.JSONObjectResponse("html", result);
    }
    catch (Exception e) {
      e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
      return JSONUtils.SimpleJSONError(e.getMessage());
    }

  }

  public JSONObject ncbiBlastGetResult(HttpSession session, JSONObject json) throws IOException {
    try {

      String blastAccession = json.getString("BlastAccession");

      JSONObject jsonObject = new JSONObject();
      JSONArray jsonArray = new JSONArray();
      String urlParameters = "RID=" + blastAccession +
                             "&ALIGNMENT_VIEW=Tabular" +
                             "&FORMAT_TYPE=Text";// + blastdb +

      StringBuilder sb = new StringBuilder();
      String str;
      int i = 0;

      sb.append("<table class='list' id='blasttable'> <thead><tr>  " +
                "<th class=\"header\"> Query id </th>" +
                "<th class=\"header\"> Subject id </th> " +
                "<th class=\"header\"> % identity </th> " +
                "<th class=\"header\"> alignment length </th> " +
                "<th class=\"header\"> mismatches </th> " +
                "<th class=\"header\"> gap openings </th> " +
                "<th class=\"header\"> q.start </th> " +
                "<th class=\"header\"> q.end </th> " +
                "<th class=\"header\"> s.start </th> " +
                "<th class=\"header\"> s.end </th> " +
                "<th class=\"header\"> e-value </th> " +
                "<th class=\"header\"> bit score </th></tr></thead><tbody>");

      sb.append(connectNCBI(urlParameters));//;new DataInputStream(connection.getInputStream());
      str = connectNCBI(urlParameters);
      while (str == "running") {
        str = connectNCBI(urlParameters);
        if (str == "finished") {
          sb.append(parseNCBI(urlParameters));
          break;
        }
      }

      sb.append("</tbody></table");


      String result = null;
      //      if (i > 0) {
      result = sb.toString();
      //      }
      //      else {
      //        result = "No hits found.";
      //      }

      return JSONUtils.JSONObjectResponse("html", result);
    }
    catch (Exception e) {
      e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
      return JSONUtils.SimpleJSONError(e.getMessage());
    }


  }

  private String connectNCBI(String urlParameters) {

    try {

      URL url = new URL("http://www.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&");

      HttpURLConnection connection = (HttpURLConnection) url.openConnection();
      connection.setDoOutput(true);
      connection.setDoInput(true);
      connection.setInstanceFollowRedirects(false);
      connection.setRequestMethod("POST");
      connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
      connection.setRequestProperty("charset", "utf-8");
      connection.setRequestProperty("Content-Length", "" + Integer.toString(urlParameters.getBytes().length));
      connection.setUseCaches(false);

      DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
      wr.writeBytes(urlParameters);
      wr.flush();
      wr.close();
      DataInputStream in = new DataInputStream(connection.getInputStream());
      String str;
      StringBuffer sb = new StringBuffer();
      str = in.readLine();

      Pattern p = Pattern.compile("<!DOCTYPE html.*");
      Matcher matcher_comment = p.matcher(str);
      if (matcher_comment.find()) {
        log.info("running");
        str = "running";
      }
      else {
        log.info("finished");
        str = "finished";
      }
      return str;
    }
    catch (Exception e) {
      e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
      String sb = e.toString();
      return sb;
    }
  }

  private StringBuffer parseNCBI(String urlParameters) {
    log.info("parse");

    try {
      StringBuffer sb = new StringBuffer();
      String str, str1 = "";
      URL url = new URL("http://www.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&");

      HttpURLConnection connection = (HttpURLConnection) url.openConnection();
      connection.setDoOutput(true);
      connection.setDoInput(true);
      connection.setInstanceFollowRedirects(false);
      connection.setRequestMethod("POST");
      connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
      connection.setRequestProperty("charset", "utf-8");
      connection.setRequestProperty("Content-Length", "" + Integer.toString(urlParameters.getBytes().length));
      connection.setUseCaches(false);

      DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
      wr.writeBytes(urlParameters);
      wr.flush();
      wr.close();
      DataInputStream in = new DataInputStream(connection.getInputStream());

      while (null != (str = in.readLine())) {
        Pattern p = Pattern.compile("<!DOCTYPE html.*");
        Matcher matcher_comment = p.matcher(str);
        if (matcher_comment.find()) {
        }
        else {
          Pattern p1 = Pattern.compile("<.*>");
          Matcher matcher_score = p1.matcher(str);
          Pattern p2 = Pattern.compile("#.*");
          Matcher matcher_hash = p2.matcher(str);
          if (matcher_score.find() || matcher_hash.find()) {
          }
          else {
            str1 = str.replaceAll("\\s+", "<td>");
          }
          if (str1.split("<td>").length > 10) {
            sb.append("<tr> <td> " + str1 + "</td></tr>");
          }
        }
      }
      return sb;
    }
    catch (Exception e) {
      e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
      StringBuffer sb = new StringBuffer(e.toString());
      return sb;
    }
  }
}