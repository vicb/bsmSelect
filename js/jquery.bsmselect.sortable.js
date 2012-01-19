/*
 * Better Select Multiple Sortable Plugin
 *
 * Copyright (c) 2010 by Victor Berchet - http://www.github.com/vicb
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
 *
 * version: v1.1.4 - 2012-01-19
 */
(function($) {
  $.bsmSelect.plugins.sortable = function(sortConfig, options)
  {
    if (!(this instanceof $.bsmSelect.plugins.sortable)) {
      return new $.bsmSelect.plugins.sortable(sortConfig, options);
    }
    this.sortConfig = sortConfig;
    this.options = $.extend({}, this.defaultOpt, options || {});
  }

  $.extend($.bsmSelect.plugins.sortable.prototype, {
    defaultOpt: {
      listSortableClass:  'bsmListSortable'
    },

    init: function(bsm) {
      var o = $.extend({}, this.options, bsm.options),
        config = $.extend({}, this.sortConfig, { items: '.' + o.listItemClass }),
        self = this;
      bsm.$list.addClass(o.listSortableClass).sortable(config);
      if ($('html').css('overflow') == 'auto' || $('html').css('overflow') == 'scroll' || $('html').css('overflow-x') == 'auto' || $('html').css('overflow-x') == 'scroll' || $('html').css('overflow-y') == 'auto' || $('html').css('overflow-y') == 'scroll') {
	 $('.'+o.listSortableClass).css('overflow', 'auto').css('padding-bottom', '1px');
      }
      bsm.$original.bind('change', function(e, info) { self.onChange.call(self, bsm, e, info); } );
      bsm.$list.bind('sortupdate', function(e, ui) { self.onSort.call(self, bsm, e, ui); } );
    },

    onChange: function(bsm, e, info) {
      if (info && info.type == 'add' && !bsm.buildingSelect) {
        info.option.detach()[bsm.options.addItemTarget == 'top' ? 'prependTo' : 'appendTo'](bsm.$original);
        bsm.$list.sortable('refresh');
      }
    },

    onSort: function(bsm, e, ui) {
      $('.' + bsm.options.listItemClass, bsm.$list).each(function() {
        $(this).data('bsm-option').data('orig-option').detach().appendTo(bsm.$original);
      });
      bsm.triggerOriginalChange($(ui.item).data('bsm-option').data('orig-option'), 'sort');
    }
  });
})(jQuery);

