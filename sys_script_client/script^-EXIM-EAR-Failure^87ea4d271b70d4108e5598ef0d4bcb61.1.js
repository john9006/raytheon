function onChange(control, oldValue, newValue, isLoading, isTemplate) {
  if (newValue === '') {
    return;
  }

  //Define the Fields being updated
  var myField1 = 'u_retransfer_is_authorised_under_bis_ddtc_ea';
  var myField2 = 'u_retransfer_is_authorised_under_ear_exception';
  var myField3 = 'u_nlr_or_ear99_is_applicable_for_retransfer';
  var myField4 = 'u_alternate_bis_ea_is_required';

  // Get the Control and Value from the defined fields
  var fieldVal1 = g_form.getValue(myField1);
  var fieldVal2 = g_form.getValue(myField2);
  var fieldVal3 = g_form.getValue(myField3);
  var fieldVal4 = g_form.getValue(myField4);

  var ctrl1 = g_form.getControl(myField1);
  var ctrl2 = g_form.getControl(myField2);
  var ctrl3 = g_form.getControl(myField3);
  var ctrl4 = g_form.getControl(myField4);

  //Check Values and Set Weight and Colour accordingly
  if (fieldVal1 == 'No' && fieldVal2 == 'No' && fieldVal3 == 'No' && fieldVal4 == 'No') {

    ctrl1.style.fontWeight = 'bold';
    ctrl2.style.fontWeight = 'bold';
    ctrl3.style.fontWeight = 'bold';
    ctrl4.style.fontWeight = 'bold';
    ctrl1.style.backgroundColor = 'Tomato';
    ctrl2.style.backgroundColor = 'Tomato';
    ctrl3.style.backgroundColor = 'Tomato';
    ctrl4.style.backgroundColor = 'Tomato';

  } else {

    ctrl1.style.fontWeight = 'normal';
    ctrl2.style.fontWeight = 'normal';
    ctrl3.style.fontWeight = 'normal';
    ctrl4.style.fontWeight = 'normal';
    ctrl1.style.backgroundColor = '';
    ctrl2.style.backgroundColor = '';
    ctrl3.style.backgroundColor = '';
    ctrl4.style.backgroundColor = '';

  }
}