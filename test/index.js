/* global window*/
var test = require('tape');
var viewCompliance = require('ampersand-view-conventions');
var InputView = require('../ampersand-array-input-view');

function simClick(el) {
    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, false, false, 0, null);
    el.dispatchEvent(ev);
}

function isHidden(el) {
    return el.style.display === 'none';
}

viewCompliance.formField(test, InputView, {name: 'array-field'}, ['ok', 'friend']);

viewCompliance.view(test, InputView, {name: 'array-field'});

test('basic init', function (t) {
    var input = new InputView({name: 'hi'});
    t.equal(input.el.tagName, 'DIV');
    t.ok(input.el.querySelector('label'));
    t.equal(input.el.querySelectorAll('input').length, 1);
    t.end();
});

test('init with value', function (t) {
    var input = new InputView({
        name: 'hi',
        value: ['ok', 'friend']
    });
    t.equal(input.el.querySelectorAll('input').length, 2);
    t.end();
});

test('init with value', function (t) {
    t.throws(function () {
        new InputView({
            name: 'hi',
            value: ['ok', 'friend'],
            maxLength: 1
        });
    }, 'Should throw if initted with too long of a value array');
    t.end();
});

test('clicking add/remove', function (t) {
    var input = new InputView({
        name: 'hi',
        maxLength: 3
    });
    var addButton = input.el.querySelector('[data-hook=add-field]');
    document.body.appendChild(input.el);
    t.ok(addButton, 'make sure theres an add button');
    t.equal(input.el.querySelectorAll('input').length, 1, 'should start with one');
    t.ok(!isHidden(addButton));
    simClick(addButton);
    t.equal(input.el.querySelectorAll('input').length, 2, 'should be two after clicking add');
    t.ok(!isHidden(addButton));
    simClick(addButton);
    t.equal(input.el.querySelectorAll('input').length, 3, 'should have 3 fields');
    t.ok(isHidden(addButton), 'add button should be hidden');
    simClick(input.el.querySelectorAll('[data-hook=remove-field]')[2]);
    t.equal(input.el.querySelectorAll('input').length, 2, 'should have 2 fields');
    simClick(input.el.querySelectorAll('[data-hook=remove-field]')[1]);
    t.equal(input.el.querySelectorAll('input').length, 1, 'should have 1 fields');
    t.ok(isHidden(input.el.querySelector('[data-hook=remove-field]')), 'should not have a remove button');
    document.body.removeChild(input.el);
    t.end();
});

test('error message visibility', function (t) {
    var input = new InputView({
        name: 'hi',
        maxLength: 3,
        minLength: 1
    });
    var errorMessage = input.el.querySelector('[data-hook=main-message-container]');
    t.ok(isHidden(errorMessage), 'error should be hidden to start');
    input.beforeSubmit();
    t.ok(!isHidden(errorMessage), 'error should be visible now');
    t.end();
});

test('error message visibility with 0 minimum length', function (t) {
    var input = new InputView({
        name: 'hi',
        minLength: 0
    });
    var errorMessage = input.el.querySelector('[data-hook=main-message-container]');
    t.ok(isHidden(errorMessage), 'error should be hidden to start');
    input.beforeSubmit();
    t.ok(isHidden(errorMessage), 'error should continue hidden');
    t.end();
});

test('remove-field visibility', function (t) {
    var input = new InputView({
        name: 'hi',
        maxLength: 3,
        minLength: 1
    });
    document.body.appendChild(input.el);
    var addButton = input.el.querySelector('[data-hook=add-field]');
    t.ok(isHidden(input.el.querySelector('[data-hook=remove-field]')), 'should be hidden to start');
    simClick(addButton);
    t.ok(!isHidden(input.el.querySelectorAll('[data-hook=remove-field]')[1]), 'should be visible now');
    document.body.removeChild(input.el);
    t.end();
});
