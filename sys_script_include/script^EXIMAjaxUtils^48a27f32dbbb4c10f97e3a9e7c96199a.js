var EXIMAjaxUtils = Class.create();
EXIMAjaxUtils.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getCttrVal: function () {
    var reqSysId = this.getParameter("sysparm_cttrSysId");
    var dataObj = {};

    // get the Request
    var gr = new GlideRecord("u_exim_transfer_request");
    gr.get("sys_id", reqSysId);

    // Method of transfer
    dataObj.site_visit = gr.u_site_visit.toString();
    dataObj.encrypted_email = gr.u_encrypted_email_transfer.toString();
    dataObj.upload_to_ra_docushare = gr.u_upload_to_docushare.toString();
    dataObj.upload_to_data_portal = gr.u_data_portal_upload.toString();
    dataObj.oral_transfer = gr.u_oral_transfer.toString();
    dataObj.courier_transfer = gr.u_courier_transfer.toString();
    dataObj.air_sea_freight = gr.u_air_sea_freight.toString();
    dataObj.standard_post = gr.u_standard_post_transfer.toString();
    dataObj.hand_carry = gr.u_hand_carry.toString();
    dataObj.other_method = gr.u_other_transfer_method.toString();

    //gs.info("JK>>> the cttr number is " + gr.u_number);
    dataObj.requestor = gr.u_requestor.toString();
    dataObj.exim_program = gr.u_exim_program.toString();
    dataObj.applicable_ea = gr.u_applicable_agreements.toString();
    dataObj.ea_missing = gr.u_agreement_missing.toString(); //checkbox
    dataObj.missing_agreements = gr.u_missing_agreement_details.toString();
    dataObj.us_ea_eccn = gr.u_applicable_us_ea_eccn.toString();
    dataObj.cttr_type = gr.u_cttr_type.toString();
    dataObj.required_from_date = gr.u_required_from_date.toString();
    dataObj.cttr_auto_renewal_required = gr.u_bcttr_auto_renewal.toString();

    dataObj.site_visit_location = gr.u_site_visit_location.toString();
    dataObj.site_visit_start = gr.u_site_visit_start.toString();
    dataObj.site_visit_end = gr.u_site_visit_end.toString();
    dataObj.encrypted_email_address = gr.u_encrypted_email_address.toString();
    dataObj.data_portal_details = gr.u_data_portal_details.toString();
    dataObj.courier_name = gr.u_courier_name.toString();
    dataObj.other_transfer_details = gr.u_other_transfer_details.toString();
    dataObj.short_description = gr.u_request_summary.toString();
    dataObj.description = gr.u_description.toString();

    //Recipient - can be manual or join to the reference field
    //the manual fields are stored on the TTR and the referfence is on the task
    //in variables

    var grt = new GlideRecord("u_exim_task");
    grt.addQuery("u_type", "ttr");
    grt.addQuery("u_transfer_request", reqSysId);
    grt.query();

    if (grt.next()) {
      var recipient = grt.variables.authorised_recipient;
    }
    if (recipient) {

      dataObj.alternate_recipient = false.toString();
      dataObj.authorised_recipient = recipient.toString();

      // clear variables of any possible legacy error
      dataObj.recipient_name = "".toString();
      dataObj.recipient_country = "".toString();
      dataObj.recipient_address = "".toString();
    } else {
      // and does exist
      // no reference value for authorised recipient in task variable

      dataObj.alternate_recipient = true.toString();
      dataObj.recipient_name = gr.u_recipient_name.toString();
      dataObj.recipient_country = gr.u_recipient_country.toString();
      dataObj.recipient_address = gr.u_recipient_address.toString();

      // clear possible legacy error on source record
      dataObj.authorised_recipient = "".toString();
    }

    //var json = new global.JSON();
    var retData = JSON.stringify(dataObj);
    //gs.info("JK>>> retData is = " + retData);

    // Server Side Code
    return retData;
  },

  getMRVSVal: function () {
    var result;
    var resultArray = {};
    var mrvsValJSON;
    var mrvsVal;
    var reqID = this.getParameter("sysparm_req_id");

    var taskGR = new GlideRecord("u_exim_task");
    taskGR.addQuery("u_type", "ttr");
    taskGR.addQuery("u_transfer_request", reqID);
    taskGR.query();
    gs.info("JK>>>into getMRVSVal ok and the reqID is " + reqID);
    if (taskGR.next()) {
      mrvsValJSON = taskGR.variables.controlled_tech_bulk_mrvs;
      resultArray = mrvsValJSON.toString();
      //gs.log(resultArray);
      mrvsVal = JSON.parse(mrvsValJSON);
      //gs.log('EXIM MRVS JSON Value RAW: ' + mrvsValJSON);
      result = resultArray;
    }

    var json = new JSON();
    return json.encode(result);
  },
  /*
    // Purpose is to return each checkbox field that has not been approved so those fields can
    // be hidden by the catalog client script
    */
  getApprovedTransferMethods: function () {
    var myObj = {};
    var reqSysID = this.getParameter("sysparm_req_id");

    // using the same variable names as cat item for simplicity
    var site_visit;
    var encrypted_email;
    var upload_to_ra_docushare;
    var upload_to_data_portal;
    var oral_transfer;
    var courier_transfer;
    var air_sea_freight;
    var standard_post;
    var hand_carry;
    var other_method;

    var reqGR = new GlideRecord("u_exim_transfer_request");
    reqGR.addQuery("sys_id", reqSysID);
    reqGR.query();

    while (reqGR.next()) {
      if (!reqGR.u_site_visit) {
        // is false
        myObj.site_visit = "false";
      } else {
        myObj.site_visit = "true";
      }
      if (!reqGR.u_encrypted_email_transfer) {
        myObj.encrypted_email = "false";
      } else {
        myObj.encrypted_email = "true";
      }

      if (!reqGR.u_upload_to_docushare) {
        myObj.upload_to_ra_docushare = "false";
      } else {
        myObj.upload_to_ra_docushare = "true";
      }
      if (!reqGR.u_data_portal_upload) {
        myObj.upload_to_data_portal = "false";
      } else {
        myObj.upload_to_data_portal = "true";
      }
      if (!reqGR.u_oral_transfer) {
        myObj.oral_transfer = "false";
      } else {
        myObj.oral_transfer = "true";
      }
      if (!reqGR.u_courier_transfer) {
        myObj.courier_transfer = "false";
      } else {
        myObj.courier_transfer = "true";
      }
      if (!reqGR.u_air_sea_freight) {
        myObj.air_sea_freight = "false";
      } else {
        myObj.air_sea_freight = "true";
      }
      if (!reqGR.u_standard_post_transfer) {
        myObj.standard_post = "false";
      } else {
        myObj.standard_post = "true";
      }
      if (!reqGR.u_hand_carry) {
        myObj.hand_carry = "false";
      } else {
        myObj.hand_carry = "true";
      }
      if (!reqGR.u_other_transfer_method) {
        myObj.other_method = "false";
      } else {
        myObj.other_method = "true";
      }
    }
    var json = new JSON();
    var data = JSON.stringify(myObj); //JSON formatted string
    //gs.log('>> myObj being sent to client is ' + data);
    return data;
  },
  /* function to return advanced qualifier to constrain the seclected TTRs on the
	   Transfer Registration to those with the Program specified by the user in a previous field
    */

  filterOnProgram: function (program) {
    return (
      "u_exim_program!=NULL^u_exim_program=" +
      program +
      "^u_approvalINapproved,expired"
    );
  },

  type: "EXIMAjaxUtils",
});
