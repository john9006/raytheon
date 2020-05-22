function onChange(control, oldValue, newValue, isLoading) {
  if (isLoading || newValue == "") {
    return;
  }

  var reqId = g_form.getValue("cttr_to_copy"); 

  //Glide Ajax Client
  var gajax = new GlideAjax("EXIMAjaxUtils");
  gajax.addParam("sysparm_name", "getCttrVal");
  gajax.addParam("sysparm_cttrSysId", reqId);
  gajax.getXML(ajax_response);

  //Retreive the MRVS on the Transfer Task associated with the Transfer Requst

  var ga = new GlideAjax("EXIMAjaxUtils");
  ga.addParam("sysparm_name", "getMRVSVal");
  ga.addParam("sysparm_req_id", reqId);
  //g_form.addInfoMessage("about to get MRVS and the reqId is " + reqId);
  ga.getXML(ajaxAnswer);

  function ajaxAnswer(response) {
    var mrvsVal = [];
    var answer = JSON.parse(
      response.responseXML.documentElement.getAttribute("answer")
    );
    var output = answer;
    //g_form.addInfoMessage(output);

    g_form.setValue("controlled_tech_bulk_mrvs", output);
  }

  function ajax_response(response) {
    var answer = response.responseXML.documentElement.getAttribute("answer");
   // g_form.addInfoMessage('the data inbound is \n' + answer);
    var dataObj = JSON.parse(answer);

     //Method
    g_form.setValue("site_visit", dataObj.site_visit);
    g_form.setValue("encrypted_email", dataObj.encrypted_email);
    g_form.setValue("upload_to_ra_docushare", dataObj.upload_to_ra_docushare);
    g_form.setValue("upload_to_data_portal", dataObj.upload_to_data_portal);
    g_form.setValue("oral_transfer", dataObj.oral_transfer);
    g_form.setValue("courier_transfer", dataObj.courier_transfer);
    g_form.setValue("air_sea_freight", dataObj.air_sea_freight);
    g_form.setValue("standard_post", dataObj.standard_post);
    g_form.setValue("hand_carry", dataObj.hand_carry);
    g_form.setValue("other_method", dataObj.other_method);

    g_form.setValue("requestor", dataObj.requestor);
    g_form.setValue("exim_program", dataObj.exim_program);

    var miss = dataObj.ea_missing;
    //alert(miss);
    g_form.setValue("ea_missing", dataObj.ea_missing); //checkbox
    //g_form.setValue("ea_missing", miss); //checkbox

    g_form.setValue("missing_agreements", dataObj.missing_agreements);
    g_form.setValue("applicable_ea", dataObj.applicable_ea);
    g_form.setValue("us_ea_eccn", dataObj.us_ea_eccn);
    g_form.setValue("cttr_type", dataObj.cttr_type);
    g_form.setValue("required_from_date", dataObj.required_from_date);
    g_form.setValue("cttr_auto_renewal_required", dataObj.cttr_auto_renewal_required);

    //Recipient
    g_form.setValue("authorised_recipient",dataObj.authorised_recipient); //reference
    g_form.setValue("alternate_recipient", dataObj.alternate_recipient); // checkbox

    g_form.setValue("recipient_name", dataObj.recipient_name);
    g_form.setValue("recipient_country", dataObj.recipient_country);
    g_form.setValue("recipient_address", dataObj.recipient_address);

    g_form.setValue("site_visit_location", dataObj.site_visit_location);
    g_form.setValue("site_visit_start", dataObj.site_visit_start);
    g_form.setValue("site_visit_end", dataObj.site_visit_end);
    g_form.setValue("encrypted_email_address", dataObj.encrypted_email_address);
    g_form.setValue("data_portal_details",dataObj.data_portal_details);
    g_form.setValue("courier_name", dataObj.courier_name);
    g_form.setValue("other_transfer_details", dataObj.other_transfer_details);


  }
}
