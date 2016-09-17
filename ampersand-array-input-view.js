/*$AMPERSAND_VERSION*/
var View = require('ampersand-view');
var without = require('lodash/without');
var FieldView = require('./lib/field-view');

var defaultTemplate = [
    '<div>',
        '<span data-hook="label"></span>',
        '<div data-hook="field-container"></div>',
        '<a data-hook="add-field" class="add-input">add</a>',
        '<div data-hook="main-message-container" class="message message-below message-error">',
            '<p data-hook="main-message-text"></p>',
        '</div>',
    '</div>'
].join('');

var defaultFieldTemplate = [
    '<label>',
        '<input>',
        '<div data-hook="message-container" class="message message-below message-error">',
            '<p data-hook="message-text"></p>',
        '</div>',
        '<a data-hook="remove-field">remove</a>',
    '</label>'
].join('');


module.exports = View.extend({
    initialize: function () {
        if (!this.label) this.label = this.name;
        this.fields = [];
        // calculate default value if not provided
        var defaultVal = [];
        // make sure there's at least one
        var num = this.minLength || 1;
        while (num--) {
            defaultVal.push('');
        }
        if (!this.value.length) this.value = defaultVal;
        this.on('change:valid change:value', this.updateParent, this);
        this.render();
    },
    render: function () {
        if (this.rendered) return;
        this.renderWithTemplate();
        this.setValue(this.value);
        this.rendered = true;
    },
    events: {
        'click [data-hook~=add-field]': 'handleAddFieldClick'
    },
    bindings: {
        'name': {
            type: 'attribute',
            selector: 'input',
            name: 'name'
        },
        'label': {
            hook: 'label'
        },
        'message': {
            type: 'text',
            hook: 'main-message-text'
        },
        'showMessage': {
            type: 'toggle',
            hook: 'main-message-container'
        },
        'canAdd': {
            type: 'toggle',
            hook: 'add-field'
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
        tests: ['array', true, function () { return []; }],
        template: ['string', true, defaultTemplate],
        fieldTemplate: ['string', true, defaultFieldTemplate],
        type: ['string', true, 'text']
    },
    session: {
        shouldValidate: ['boolean', true, false],
        fieldsValid: ['boolean', true, false],
        fieldsRendered: ['number', true, 0],
        rendered: ['boolean', true, false]
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
                return this.value.length >= this.minLength;
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
        var field = this.addField('');
        field.input.focus();
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
        var initOptions = {
            value: value,
            parent: this,
            required: false,
            tests: this.tests,
            placeholder: this.placeholder,
            removable: removable,
            type: this.type
        };
        var field = new FieldView(initOptions);
        field.template = this.fieldTemplate;
        field.render();
        this.fieldsRendered += 1;
        this.fields.push(field);
        this.queryByHook('field-container').appendChild(field.el);
        return field;
    },
    clearFields: function () {
        this.fields.forEach(function (field) {
            field.remove();
        });
        this.fields = [];
        this.fieldsRendered = 0;
    },
    removeField: function (field) {
        this.fields = without(this.fields, field);
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
