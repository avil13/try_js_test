//@ts-check
function Class() {}
Class.extend = function (desc) {
    // Реализовать данный метод
    // Dropdown -> Widget -> Class
    function Child() {
        for (let k in desc) {
            if (desc.hasOwnProperty(k)) {
                this[k] = desc[k];
            }
        }

        if (desc.constructor) {
            desc.constructor.apply(this, arguments);
        }
    }

    Object.setPrototypeOf(Class, Child);

    Child.extend = Class.extend;

    return Child;
};


/** @class Widget */
var Widget = Class.extend( /** @lends Widget.prototype */ {
    constructor: function (el, options) {
        debugger;
        this.el = el;
        this.options = options;
    },

    find: function (selector) {
        return this.el.querySelector(selector);
    }
});

/** @class Dropdown */
/** @extends Widget */
var Dropdown = Widget.extend( /** @lends Dropdown.prototype */ {
    constructor: function () {
        debugger;
        Widget.apply(this, arguments);
        this.find('.js-ctrl').addEventListener('click', this);
    },

    handleEvent: function (evt) {
        this.toggle();
    },

    toggle: function () {
        var menu = this.find('.js-menu');
        menu.classList.toggle('collapsed');
    }
});


// Используем
var dd = new Dropdown(menu);


// Тесты
console.log('dd is Class:', dd instanceof Class);
console.log('dd is Widget:', dd instanceof Widget);
console.log('dd is Dropdown:', dd instanceof Dropdown);
