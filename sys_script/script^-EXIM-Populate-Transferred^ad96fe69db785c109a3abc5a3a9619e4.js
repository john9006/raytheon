(function executeRule(current, previous /*null when async*/ ) {
    // Server-side workflow script for getting values from CTTR Multi-Row Variable Set related to an EXIM Task record

    var transferID = current.sys_id;
    var transferrerID = current.u_transferrer;
    var techIDList;

    // Get value from MRVS field and Parse the JSON output
    //gs.info('JK>>> current.u_mrvs_u_transferred_technologies is ' + current.u_mrvs_transferred_technologies);
	var mrvs = current.u_mrvs_transferred_technologies;
    var mrvsval = JSON.parse(mrvs);  // into an object
    var mrvslength = mrvsval.length; // number of rows
	//gs.info('JK>>> tech desc is ' + mrvsval[0].technology_description); 

    // Initialise counter for iterating through MRVS Rows
    var rowCounter = 0;

    while (rowCounter < mrvslength) {
       var rowValue = mrvsval[rowCounter];  // equiv of u_mrvs_transferred_technologies[0] for first row

        /**

            1. Generate Controlled Technology records for each row of the MRVS
            2. Return the sys_id of the created record
            3. append each sys_id to the list of sys_id's to be passed back to the transfer

            **/

    var techGR = new GlideRecord("u_exim_transferred_tech");
    techGR.initialize();

    techGR.u_exim_transfer = transferID;

    // Set Technology Owner to Transferrer
    techGR.u_ra_owner = transferrerID;

    // Set Values on Controlled Technology Record from the current row of the MRVS
    techGR.u_title = rowValue["technology_title"];
	techGR.u_type = rowValue["type"];
    techGR.u_description = rowValue["technology_description"];
    techGR.u_document_software_part_no = rowValue["document_software_part"];
    techGR.u_filename_serial_no = rowValue["filename_serial"];
    techGR.u_security_classification = rowValue["security_classification"];
    techGR.u_storage_location = rowValue["storage_location"];
    techGR.u_source_supplier = rowValue["source_supplier"];
	techGR.u_quantity_transferred = rowValue["quantity_transferred"];

    // Get Country Sys_ID for Reference Field
    var countryName = rowValue["source_country"];

    var countryGR = new GlideRecord("core_country");
    countryGR.addQuery("name", countryName);
    countryGR.query();
    while (countryGR.next()) {
      techGR.u_source_country = countryGR.sys_id;
    }

    // Insert new Technology Record, capturing Sys_ID in a variable;

    var newTechID = "";
    newTechID = techGR.insert();

    // Check if New ID Exists, then update the list

    if (newTechID) {
      // New ID exists, Check current list value and update accordingly
      if (techIDList == "" || techIDList == undefined) {
        techIDList = newTechID;
      } else {
        techIDList = techIDList + "," + newTechID;
      }
    }

    // Increment counter before loop ends
    rowCounter++;

   }
	current.u_transferred_technologies = techIDList;
})(current, previous);