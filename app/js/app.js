var $ = require('jquery');


var sections = [];
var currentIndex = 0;

var Section = function(html){
    this.index = html.index();
    this.next = html.find('.next');
    this.before = html.find('.before');
    console.log(html.index());
    this.html = html;
    this.init();
};

Section.prototype.init = function(){
    var _this = this;
    var align = function(){
        $.each(sections, function(index, value){
            value.alignSection();
        });
    };
    _this.before.on('click', function(){
        if ((_this.index - 1) < 0) {
            return;
        }
        var previousSection = sections[_this.index - 1];
        previousSection.slideIn();
        _this.slideToRight();
        currentIndex = _this.index - 1;
        align();
    });
    _this.next.on('click', function(){
        if ((_this.index + 1) >= sections.length) {
            return;
        }
        _this.next.addClass('hover');
        var nextSection = sections[_this.index + 1];
        nextSection.slideIn();
        _this.slideToLeft();
        currentIndex = _this.index + 1;
        align();
    });
};

Section.prototype.slideToLeft = function(){
    this.html.css({
        left: -$(window).width()
    });
};

Section.prototype.slideToRight = function(){
    this.html.css({
        left: $(window).width()
    });
};

Section.prototype.slideIn = function(){
    this.slideLeftControl();
    this.slideRightControl();
    this.html.show()
        .css({
            left: 0
        });
};

$.extend(Section.prototype, (function(){
    var init = function(control, offsetposition, initialposition){
        control.removeClass('slidein').css(offsetposition).hide();
        control.addClass('animate').hide(1).delay(1500).show(1, function(){
            control.css(initialposition);
        }).delay(600).show(1, function(){
            control.addClass('slidein').removeClass('animate');
        });
    };
    return {
        slideLeftControl: function(){
            init(this.before, {left: -this.before.width()}, {left: 0});
        },
        slideRightControl: function(){
            init(this.next, {right: -this.next.width()}, {right: 0});
        }
    };
}()));

Section.prototype.alignSection = function(){
    var newValue = ((this.index - currentIndex) * 100) + '%';
    this.html.css({
        left: newValue
    });
};

// ---------------------------------------------------------------------------------------------------------------------

$(document).ready(function(){
    $('section').each(function(){
        var ref = $(this);
        if (ref.attr('id') === 'footer') {
            return;
        }
        var section = new Section($(this));
        sections.push(section);
        section.alignSection();
    });
});