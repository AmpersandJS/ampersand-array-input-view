var AmpView = require('ampersand-view');
var _ = require('underscore');
var FieldView = require('./lib/field-view');
var FieldCollection = require('./lib/field-collection');


module.exports = AmpView.extend({
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
        this.setValue(this.value.length ? this.value : ['']);
        this.tests = spec.tests;
    },
    render: function () {
        this.renderWithTemplate();
        this.renderCollection(this.fields, FieldView, this.getByRole('field-container'));
        this.listenTo(this.fields, 'change:valid change:value add remove', this.handleCollectionChange);
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
        message: ['string', true, '']
    },
    session: {
        testspassed: ['boolean', true, true],
        validClass: ['string', true, 'input-valid'],
        invalidClass: ['string', true, 'input-invalid'],
        requiredMessage: ['string', true, 'Enter at least one item.'],
        requried: ['boolean', true, true]
    },
    collections: {
        fields: FieldCollection
    },
    derived: {
        fieldClass: {
            deps: ['showMessage'],
            fn: function () {
                return this.showMessage ? this.invalidClass : this.validClass;
            }
        },
        valid: {
            deps: ['value', 'required', 'testspassed'],
            fn: function () {
                var hasValues = !!this.value.length;
                if (this.required && !hasValues) {
                    return false;
                } else {
                    return this.testspassed;
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
        this.fields.set(arr.map(function (val) {
            return {
                value: val
            };
        }));
    },
    handleCollectionChange: function () {
        this.value = _.compact(this.fields.getValues());
        this.runTests();
    },
    runTests: function () {
        var message = '';
        this.fields.some(function (field) {
            return (this.tests || []).some(function (test) {
                var message = test.call(field, this.value);
                field.valid = !message;
                message = message;
                return message;
            }, this);
        }, this);
        this.message = message;
        if (!this.message) this.hasBeenValid = true;
    },
    handleAddFieldClick: function (e) {
        e.preventDefault();
        this.fields.add({value: ''});
    }
});
