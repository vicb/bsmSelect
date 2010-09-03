/*
 * Better Select Multiple Sortable Plugin - jQuery Plugin
 *
 * Copyright (c) 2010 by Victor Berchet - http://www.github.com/vicb
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
 *
 * version: v1.0.0
 */
(function($) {
  $.bsmSelect.plugins.sortable = function(sortConfig)
  {
    this.sortConfig = sortConfig;
  }

  $.extend($.bsmSelect.plugins.sortable.prototype, {
    options: {
      listSortableClass:  'bsmListSortable'
    },

    init: function(bsm) {
      var o = bsm.options, 
        config = $.extend(this.sortConfig, { items: '.' + o.listItemClass });
      o = $.extend({}, this.options, o);
      bsm.$list.addClass(o.listSortableClass).sortable(config);
      bsm.$original.bind('change', $.proxy(this.onChange, this));
      bsm.$list.bind('sortupdate', $.proxy(this.onSort, this));
      this.bsm = bsm;
    },

    onChange: function(e, info) {
      var b = this.bsm;
      if (info.type == 'add' && !b.buildingSelect) {
        info.option.detach()[b.options.addItemTarget == 'top' ? 'prependTo' : 'appendTo'](b.$original);
        b.$list.sortable('refresh');
      }
    },

    onSort: function(e, ui) {
      var b = this.bsm;
      $('.' + b.options.listItemClass, b.$list).each(function() {
        $('#' + $(this).attr('rel')).detach().appendTo(b.$original);
      });
      b.triggerOriginalChange($(ui.item).attr('rel'), 'sort');
    }
  });
})(jQuery);

