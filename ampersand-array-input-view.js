var View = require('ampersand-view');
var _ = require('underscore');
var FieldView = require('./lib/field-view');


module.exports = View.extend({
    template: [
        '<label>',
            '<span role="label"></span>',
            '<div role="field-container"></div>',
            '<a role="add-field" class="add-input">add</a>',
            '<div role="main-message-container" class="message message-below message-error">',
                '<p role="main-message-text"></p>',
            '</div>',
        '</label>'
    ].join(''),
    initialize: function (spec) {
        if (!this.label) this.label = this.name;
        this.fields = [];
        this.tests = spec.tests;
        this.type = spec.type || 'text';
        // calculate default value if not provided
        var defaultVal = [];
        // make sure there's at least one
        var num = this.minLength || 1;
        while (num--) {
            defaultVal.push('');
        }
        if (!this.value.length) this.value = defaultVal;
        this.on('change:valid change:value', this.updateParent, this);
        this.renderWithTemplate();
        this.setValue(this.value);
    },
    render: function () {
        // auto rendered, no need for this, but we want to
        // overwrite default
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
            role: 'main-message-text'
        },
        'showMessage': {
            type: 'toggle',
            role: 'main-message-container'
        },
        'canAdd': {
            type: 'toggle',
            role: 'add-field'
        }
    },
    props: {
        name: ['string', true, ''],
        value: ['array', true, function () { return []; }],
        label: ['string', true, ''],
        message: ['string', true, ''],
        placeholder: ['string', true, ''],
        requiredMessage: 'string',
        validClass: ['string', true, 'input-valid'],
        invalidClass: ['string', true, 'input-invalid'],
        minLength: ['number', true, 0],
        maxLength: ['number', true, 10],
    },
    session: {
        shouldValidate: ['boolean', true, false],
        fieldsValid: ['boolean', true, false],
        fieldsRendered: ['number', true, 0]
    },
    derived: {
        fieldClass: {
            deps: ['showMessage'],
            fn: function () {
                return this.showMessage ? this.invalidClass : this.validClass;
            }
        },
        valid: {
            deps: ['requiredMet', 'fieldsValid'],
            fn: function () {
                return this.requiredMet && this.fieldsValid;
            }
        },
        showMessage: {
            deps: ['valid', 'shouldValidate', 'message'],
            fn: function () {
                return !!(this.shouldValidate && this.message && !this.valid);
            }
        },
        canAdd: {
            deps: ['maxLength', 'fieldsRendered'],
            fn: function () {
                return this.fieldsRendered < this.maxLength;
            }
        },
        requiredMet: {
            deps: ['value', 'minLength'],
            fn: function () {
                return this.value.length > this.minLength;
            }
        }
    },
    setValue: function (arr) {
        if (arr.length > this.maxLength) throw Error('Field value length greater than maxLength setting');
        this.clearFields();
        arr.forEach(this.addField, this);
        this.update();
    },
    beforeSubmit: function () {
        this.fields.forEach(function (field) {
            field.beforeSubmit();
        });
        this.shouldValidate = true;
        if (!this.valid && !this.requiredMet) {
            this.message = this.requiredMessage || this.getRequiredMessage();
        }
    },
    handleAddFieldClick: function (e) {
        e.preventDefault();
        this.addField('');
    },
    addField: function (value) {
        var self = this;
        var firstField = this.fields.length === 0;
        var removable = function () {
            if (firstField) return false;
            if (self.fields.length >= (self.minLength || 1)) {
                return true;
            }
            return false;
        }();
        var field = new FieldView({
            value: value,
            parent: this,
            required: false,
            tests: this.tests,
            placeholder: this.placeholder,
            removable: removable,
            type: this.type
        });
        field.render();
        this.fieldsRendered += 1;
        this.fields.push(field);
        this.getByRole('field-container').appendChild(field.el);
    },
    clearFields: function () {
        this.fields.forEach(function (field) {
            field.remove();
        });
        this.fields = [];
        this.fieldsRendered = 0;
    },
    removeField: function (field) {
        this.fields = _.without(this.fields, field);
        field.remove();
        this.fieldsRendered -= 1;
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
    getRequiredMessage: function () {
        var plural = this.minLength > 1;
        return 'Enter at least ' + (this.minLength || 1) + ' item' + (plural ? 's.' : '.');
    }
});
