(function($) {
    var sections = [],
        currentIndex = 0;

    $(document).ready(function() {
       $('section').each(function() {
          var ref = $(this);
          if (ref.attr('id') === 'footer') return;
          var section = new Section($(this));
          sections.push(section);
          section.alignSection();
       });
    });

    var Section = function(html) {
      var t = this;
        t.html = html;
        t.index = t.html.index();
        t.next = t.html.find('.next');
        t.before = t.html.find('.before');
        console.log(t.html.index());
        t.init();
    };

    Section.prototype.init = function() {
        var t = this,
            align = function() {
                $.each(sections, function(index, value) {
                    value.alignSection();
                })
            }
        t.before.on('click', function() {
            if (!((t.index - 1) >= 0)) return;
            var previousSection = sections[t.index - 1];
            previousSection.slideIn();
            t.slideToRight();
            currentIndex = t.index - 1;
            align();
        });
        t.next.on('click', function() {
            if (!((t.index + 1) < sections.length)) return;
            t.next.addClass('hover');
            var nextSection = sections[t.index + 1];
            nextSection.slideIn();
            t.slideToLeft();
            currentIndex = t.index + 1;
            align();
        });
    };

    Section.prototype.slideToLeft = function() {
        var t = this;
        t.html.css({
            left: -$(window).width()
        });
    };

    Section.prototype.slideToRight = function() {
        var t = this;
        t.html.css({
            left: $(window).width()
        });
    };

    Section.prototype.slideIn = function() {
        var t = this;
        t.slideLeftControl();
        t.slideRightControl();
        t.html.show()
            .css({
                left: 0
            });
    }

    $.extend(Section.prototype, function() {
        var init = function(control, offsetposition, initialposition) {
            control.removeClass('slidein').css(offsetposition).hide();
            control.addClass('animate').hide(1).delay(1500).show(1, function() {
                control.css(initialposition);
            }).delay(600).show(1, function() {
                control.addClass('slidein').removeClass('animate');
            });
        };
        return {
          slideLeftControl: function() {
              var t = this;
              init(t.before, {left: -t.before.width()}, {left: 0});
          },
          slideRightControl: function() {
              var t = this;
              init(t.next, {right: -t.next.width()}, {right: 0});
          }
        }
    }());

    Section.prototype.alignSection = function() {
        var t = this,
            newValue = ((t.index - currentIndex) * 100) + '%';
        t.html.css({
           left: newValue
        });
    }
}(jQuery));