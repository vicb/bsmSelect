/*
 * Better Select Multiple Sortable Plugin
 *
 * Copyright (c) 2010 by Victor Berchet - http://www.github.com/vicb
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
 *
 * version: v1.1.0 - 2010-09-05
 */
(function($) {
  $.bsmSelect.plugins.sortable = function(sortConfig, options)
  {
    if (!(this instanceof arguments.callee)) {
      return new arguments.callee(sortConfig, options);
    }
    this.sortConfig = sortConfig;
    this.options = $.extend({}, this.defaultOpt, options || {});
  }

  $.extend($.bsmSelect.plugins.sortable.prototype, {
    defaultOpt: {
      listSortableClass:  'bsmListSortable'
    },

    init: function(bsm) {
      var o = $.extend(this.options, bsm.options),
        config = $.extend(this.sortConfig, { items: '.' + o.listItemClass });
      bsm.$list.addClass(o.listSortableClass).sortable(config);
      bsm.$original.bind('change', $.proxy(this.onChange, this));
      bsm.$list.bind('sortupdate', $.proxy(this.onSort, this));
      this.bsm = bsm;
    },

    onChange: function(e, info) {
      var b = this.bsm;
      if (info && info.type == 'add' && !b.buildingSelect) {
        info.option.detach()[b.options.addItemTarget == 'top' ? 'prependTo' : 'appendTo'](b.$original);
        b.$list.sortable('refresh');
      }
    },

    onSort: function(e, ui) {
      var b = this.bsm;
      $('.' + b.options.listItemClass, b.$list).each(function() {
        $(this).data('bsm-option').data('orig-option').detach().appendTo(b.$original);
      });
      b.triggerOriginalChange($(ui.item).data('bsm-option').data('orig-option'), 'sort');
    }
  });
})(jQuery);

