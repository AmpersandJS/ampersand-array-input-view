/*global console, window*/
// can be run with `npm run demo`
var ArrayInput = require('./ampersand-array-input-view');
var FormView = require('ampersand-form-view');


var input = new ArrayInput({
    name: 'hi',
    maxLength: 3,
    tests: [
        function (val) {
            if (val.length < 3) return 'not long enough';
        }
    ]
});

var form = document.createElement('form');
form.innerHTML = '<div data-hook="field-container"></div><input type="submit">';

var formView = new FormView({
    el: form,
    fields: [input],
    submitCallback: function (vals) {
        console.log(vals);
    }
});

window.formView = formView;

document.body.appendChild(formView.el);
