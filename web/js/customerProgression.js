var customerId;

$(function($) {
    customerId = Number($('input#customerId').attr('value'));
    setChart('#chartBMI', 'bmi', customerId); 
    setChart('#chartWeight', 'weight', customerId); 
});