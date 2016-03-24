# ampersand-array-input-view

Lead Maintainer: [Michael Garvin](https://github.com/wraithgar)

# overview

A view module for intelligently rendering and validating inputs that should produce an array of values. Works well with [ampersand-form-view](ampersandjs/ampersand-form-view).

It does the following:

- Automatically shows/hides error messages based on tests
- Exposes control for adding more input fields.
- Exposes control removing all but required number of input fields.
- Will not show error messages pre-submit or it's never had a valid value. This lets people tab-through a form without triggering a bunch of error message.
- Live-validates to always report if in valid state, but only shows messages when sane to do so.

## install

```
npm install ampersand-array-input-view
```

## example

The *only* required attribute is a name. Everything else is optional.

```javascript
var InputView = require('ampersand-array-input-view');


var field = new InputView({
    // form input's `name` attribute
    name: 'client_name',
    // You can replace the built-in template for the parent item
    // just give it an html string. Make sure it has a single "root" element that contains:
    //  - an element with a `data-hook="label"` attribute
    //  - an element with a `data-hook="fieldContainer"` this is where individual fields go
    //  - an element with a `data-hook="main-message-container"` attribute (this we'll show/hide)
    //  - an elememt with a `data-hook="main-message-text"` attribute (where message text goes for error)
    template: // some HTML string,
    // Template for individual view. It should be a string of HTML
    // Make sure it has a single "root" element that contains
    //  - an element with a `data-hook="label"` attribute
    //  - an element with a `data-hook="message-container"` attribute (this we'll show/hide)
    //  - an elememt with a `data-hook="message-text"` attribute (where message text goes for error)
    fieldTemplate // HTML string
    // Label name
    label: 'App Name',
    // Optional placeholder attribute
    placeholder: 'My Awesome App',
    // optional intial value if it has one
    value: ['hello'],
    // optional, this is the element that will be
    // replaced by this view. If you don't
    // give it one, it will create one.
    el: document.getElementByID('field'),
    // use min/max length to set how many answers
    // are required
    minLength: 0,
    maxLength: 10,
    // class to set on input when input is valid
    validClass: 'input-valid', // <- that's the default
    // type value to use for the input tag's type value
    type: 'text',
    // class to set on input when input is valid
    invalidClass: 'input-invalid', // <- that's the default
    // Message to use if error is that it's required
    // but no value was set.
    requiredMessage: 'This field is required.',
    // An array of test functions that each input must pass.
    // They will be called in order with the current input value
    // and you should write your test to return an error message
    // if it fails and something falsey if it passes.
    // Note that these tests get called with the field view instance as
    // it's `this` context.
    tests: [
        function (val) {
            if (val.length < 5) return "Must be 5+ characters.";
        }
    ],
    // optional, you can pass in the parent view explicitly
    parent:  someViewInstance
});

// append it somewhere or use it in side an ampersand-form-view
document.querySelector('form').appendChild(field.el);

```

## credits

Created by [@HenrikJoreteg](http://twitter.com/henrikjoreteg).

# changelog
- 5.0.0 - update &-input-view dependency to 5.0.0
- 4.0.0 - bump major versions of most dependencies

## license

MIT
