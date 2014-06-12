var View = require('ampersand-view');
var _ = require('underscore');
var FieldView = require('./lib/field-view');


module.exports = View.extend({
    template: [
        '<label>',
            '<span role="label"></span>',
            '<div role="field-container"></div>',
            '<a role="add-field" class="add-input">add</a>',
            '<div role="message-container" class="message message-below message-error">',
                '<p role="message-text"></p>',
            '</div>',
        '</label>'
    ].join(''),
    initialize: function (spec) {
        if (!this.label) this.label = this.name;
        this.fields = [];
        this.tests = spec.tests;
        // calculate default value if not provided
        var defaultVal = [];
        var num = this.numberRequired;
        while (num--) {
            defaultVal.push('');
        }
        if (!this.value.length) this.value = defaultVal;
        this.on('change:valid change:value', this.updateParent, this);
    },
    render: function () {
        this.renderWithTemplate();
        this.setValue(this.value);
    },
    events: {
        'click [role=add-field]': 'handleAddFieldClick'
    },
    bindings: {
        'name': {
            type: 'attribute',
            selector: 'input',
            name: 'name'
        },
        'label': {
            role: 'label'
        },
        'message': {
            type: 'text',
            role: 'message-text'
        },
        'showMessage': {
            type: 'toggle',
            role: 'message-container'
        }
    },
    props: {
        name: ['string', true, ''],
        value: ['array', true, function () { return []; }],
        label: ['string', true, ''],
        message: ['string', true, ''],
        placeholder: ['string', true, '']
    },
    session: {
        validClass: ['string', true, 'input-valid'],
        invalidClass: ['string', true, 'input-invalid'],
        numberRequired: ['number', true, 0],
        fieldsValid: ['boolean', true, false]
    },
    derived: {
        fieldClass: {
            deps: ['showMessage'],
            fn: function () {
                return this.showMessage ? this.invalidClass : this.validClass;
            }
        },
        valid: {
            deps: ['value', 'fieldsValid', 'numberRequired'],
            fn: function () {
                var numValues = this.value.length;
                if (numValues < this.numberRequired) {
                    return false;
                } else {
                    return this.fieldsValid;
                }
            }
        },
        showMessage: {
            deps: ['hasBeenValid', 'message'],
            fn: function () {
                return !!(this.hasBeenValid && this.message);
            }
        }
    },
    setValue: function (arr) {
        this.clearFields();
        arr.forEach(this.addField, this);
        this.update();
    },
    beforeSubmit: function () {
        this.fields.forEach(function (field) {
            field.beforeSubmit();
        });
    },
    handleAddFieldClick: function (e) {
        e.preventDefault();
        this.addField('');
    },
    addField: function (value) {
        var field = new FieldView({
            value: value,
            parent: this,
            required: false,
            tests: this.tests,
            placeholder: this.placeholder,
            removable: this.fields.length >= this.numberRequired
        });
        field.render();
        this.fields.push(field);
        this.getByRole('field-container').appendChild(field.el);
    },
    clearFields: function () {
        this.fields.forEach(function (field) {
            field.remove();
        });
        this.fields = [];
    },
    removeField: function (field) {
        this.fields = _.without(this.fields, field);
        field.remove();
        this.update();
    },
    update: function () {
        var valid = true;
        var value = this.fields.reduce(function (previous, field) {
            if (field.value) previous.push(field.value);
            if (!field.valid && valid) valid = false;
            return previous;
        }, []);
        this.set({
            value: value,
            fieldsValid: valid
        });
    },
    updateParent: function () {
        if (this.parent) this.parent.update(this);
    },
    requiredMessage: function () {
        var plural = this.numberRequired > 1;
        return 'Enter at least ' + this.numberRequired + ' item' + (plural ? 's.' : '.');
    }
});
