var View = require('ampersand-view');
var dom = require('ampersand-dom');


module.exports = View.extend({
    template: [
        '<div>',
            '<input type="text"/>',
            '<a role="remove">remove</a>',
        '</div>'
    ].join(''),
    initialize: function () {
        this.listenTo(this.model, 'change:valid', this.handleValidChange);
        this.listenTo(this.model, 'change:value', this.handleValueChange);
    },
    bindings: {
        'model.removable': {
            type: 'toggle',
            role: 'remove'
        }
    },
    render: function () {
        this.renderWithTemplate();
        this.input = this.get('input');
    },
    events: {
        'click [role=remove]': 'handleRemoveClick',
        'input input': 'handleInputEvent'
    },
    handleRemoveClick: function () {
        this.model.collection.remove(this.model);
    },
    handleValidChange: function () {
        var parent = this.parent.parent;
        if (this.valid) {
            dom.switchClass(this.input, parent.invalidClass, parent.validClass);
        } else {
            dom.switchClass(this.input, parent.validClass, parent.invalidClass);
        }
    },
    handleInputEvent: function () {
        this.model.value = this.input.value;
    },
    handleValueChange: function () {
        if (document.activeElement !== this.input) {
            this.input.value = this.model.value;
        }
    }
});
