function onSubmit() {
    function onSubmit() {

        var boolTF = validateForm();
        if (boolTF === true) {
            //console.info('Pass onSubmit: ' + boolTF);
            return true;
            //return false;//remove this later once passed testing
        } else {
            return false;
        }
    }

    function validateForm() {

        var ccp = g_form.getValue('u_associated_ccp');
        var mgmtReserve = g_form.getValue('u_mr_impact');
        var type = g_form.getValue('u_type');  // RWP, Replan - Minor/ Replan - Major
		var subType = g_form.getValue('u_sub_type'); // MR, CCP, Both CCP and MR

        if (ccp != '' || mgmtReserve != '') { //either have values
            // type must be Replan - Major
            if (type != 'Replan Major') {
                if (typeof spModal != 'undefined') {
                    spModal.open({
                        message: 'Where CCP or Management Reserve have values the Type field must be "Replan Major"',
                        title: 'A correction is needed'
                    });
                } else {
                    var gm = new GlideModal();
                    gm.setTitle('A correction is needed');
                    gm.renderWithContent('Where CCP or Management Reserve have values the Type field must be "Replan Major"');
                }
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
}