/*
 * Better Select Multiple - jQuery Plugin
 *
 * based on Alternate Select Multiple (asmSelect) 1.0.4a beta (http://www.ryancramer.com/projects/asmselect/)
 * 
 * Copyright (c) 2009 by Ryan Cramer - http://www.ryancramer.com
 * Copyright (c) 2010 by Victor Berchet - http://www.github.com/vicb
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
 *
 */

(function($) {

  $.fn.bsmSelect = function(customOptions) {

    var options = $.extend({}, $.fn.bsmSelect.conf, customOptions);

    return this.each(function(index) {

      var conf = $.extend({}, options, {
        $original:      $(this),          // the original select multiple
        $container:     null,             // a container that is wrapped around our widget
        $select:        null,             // the new select we have created
        $selectRemoved: null,
        $ol:            null,             // the list that we are manipulating
        buildingSelect: false,            // is the new select being constructed right now?
        ieClick:        false,            // in IE, has a click event occurred? ignore if not
        ignoreOriginalChangeEvent: false, // originalChangeEvent bypassed when this is true
        index:          index
      });


      // initialize the alternate select multiple

      // this loop ensures uniqueness, in case of existing bsmSelects placed by ajax (1.0.3)
      while($("#" + conf.containerClass + conf.index).size() > 0) conf.index++;

      conf.$select = $("<select>", {
        "class": conf.selectClass,
        name: conf.selectClass + conf.index,
        id: conf.selectClass + conf.index
      }).bind("change", {conf: conf}, selectChangeEvent)
        .bind("click", {conf: conf}, selectClickEvent);

      conf.$selectRemoved = $("<select>");

      conf.$ol = $("<" + conf.listType + ">", {
        "class" : conf.listClass,
        id: conf.listClass + conf.index
      });

      conf.$container = $("<div>", {
        "class":  conf.containerClass,
        id: conf.containerClass + conf.index
      });

      buildSelect(conf);

      conf.$original
        .bind("change", {conf: conf}, originalChangeEvent)
        .wrap(conf.$container).before(conf.$select).before(conf.$ol);

      if(conf.sortable) makeSortable(conf);

      if($.browser.msie && $.browser.version < 8) conf.$ol.css('display', 'inline-block'); // Thanks Matthew Hutton
    });
  };

  function makeSortable(conf) {

    // make any items in the selected list sortable
    // requires jQuery UI sortables, draggables, droppables

    conf.$ol.sortable({
      items: 'li.' + conf.listItemClass,
      handle: '.' + conf.listItemLabelClass,
      axis: 'y',
      update: function(e, data) {

        var updatedOptionId;

        $(this).children("li").each(function(n) {

          var $option = $('#' + $(this).attr('rel'));

          if($(this).is(".ui-sortable-helper")) {
            updatedOptionId = $option.attr('id');
            return;
          }

          conf.$original.append($option);
        });

        if(updatedOptionId) triggerOriginalChange(updatedOptionId, 'sort', conf);
      }

    }).addClass(conf.listSortableClass);
  }

  function selectChangeEvent(e) {

    // an item has been selected on the regular select we created
    // check to make sure it's not an IE screwup, and add it to the list

    var conf = e.data.conf;
    if($.browser.msie && $.browser.version < 7 && !conf.ieClick) return;
    var id = $(this).children("option:selected").eq(0).attr('rel');
    addListItem(id, conf);
    conf.ieClick = false;
    triggerOriginalChange(id, 'add', conf); // for use by user-defined callbacks
  }

  function selectClickEvent(e) {

    // IE6 lets you scroll around in a select without it being pulled down
    // making sure a click preceded the change() event reduces the chance
    // if unintended items being added. there may be a better solution?
    var conf = e.data.conf;
    conf.ieClick = true;
  }

  function originalChangeEvent(e) {

    // select or option change event manually triggered
    // on the original <select multiple>, so rebuild ours

    var conf = e.data.conf;
    if(conf.ignoreOriginalChangeEvent) {
      conf.ignoreOriginalChangeEvent = false;
      return;
    }

    conf.$select.empty();
    conf.$ol.empty();
    buildSelect(conf);

    // opera has an issue where it needs a force redraw, otherwise
    // the items won't appear until something else forces a redraw
    if($.browser.opera) conf.$ol.hide().fadeIn("fast");
  }

  function buildSelect(conf) {

    // build or rebuild the new select that the user
    // will select items from

    conf.buildingSelect = true;

    // add a first option to be the home option / default selectLabel
    conf.$select.prepend("<option>" + conf.$original.attr('title') + "</option>");

    conf.$original.children("option").each(function(n) {

      var $t = $(this);
      var id;

      if(!$t.attr('id')) $t.attr('id', 'bsm' + conf.index + 'option' + n);
      id = $t.attr('id');

      if($t.is(":selected")) {
        addListItem(id, conf);
        addSelectOption(id, conf, true);
      } else {
        addSelectOption(id, conf);
      }
    });

    if(!conf.debugMode) conf.$original.hide(); // IE6 requires this on every buildSelect()
    selectFirstItem(conf);
    conf.buildingSelect = false;
  }

  function addSelectOption(optionId, conf, disabled) {

    // add an <option> to the <select>
    // used only by buildSelect()

    if (typeof(disabled) == "undefined") var disabled = false;

    var $O = $('#' + optionId);
    var $option = $("<option>" + $O.text() + "</option>")
      .val($O.val())
      .attr('rel', optionId);

    if(disabled) disableSelectOption($option, conf);

    conf.$select.append($option);
  }

  function selectFirstItem(conf) {

    // select the firm item from the regular select that we created

    conf.$select.children(":eq(0)").attr("selected", "selected");
  }

  function disableSelectOption($option, conf) {

    // make an option disabled, indicating that it's already been selected
    // because safari is the only browser that makes disabled items look 'disabled'
    // we apply a class that reproduces the disabled look in other browsers

    $option.addClass(conf.optionDisabledClass)
      .removeAttr("selected")
      .attr("disabled", "disabled");

    if(conf.hideWhenAdded) $option.hide();
    if($.browser.msie) conf.$select.hide().show(); // this forces IE to update display
  }

  function enableSelectOption($option, conf) {

    // given an already disabled select option, enable it

    $option.removeClass(conf.optionDisabledClass).removeAttr("disabled");

    if(conf.hideWhenAdded) $option.show();
    if($.browser.msie) conf.$select.hide().show(); // this forces IE to update display
  }

  function addListItem(optionId, conf) {

    // add a new item to the html list

    var $O = $('#' + optionId);

    if(!$O) return; // this is the first item, selectLabel

    var $removeLink = $("<a>", {
      href: "#",
      "class": conf.removeClass,
      click: function() {dropListItem($(this).parent('li').attr('rel'), conf); return false; }
    }).prepend(conf.removeLabel);

    var $itemLabel = $("<span>", {
      "class": conf.listItemLabelClass,
      html: $O.html()
    });

    var $item = $("<li>", {
      rel:  optionId,
      "class": conf.listItemClass
    }).append($itemLabel)
      .append($removeLink)
      .hide();

    if(!conf.buildingSelect) {
      if($O.is(":selected")) return; // already have it
      $O.attr("selected", "selected");
    }

    if(conf.addItemTarget == 'top' && !conf.buildingSelect) {
      conf.$ol.prepend($item);
      if(conf.sortable) conf.$original.prepend($O);
    } else {
      conf.$ol.append($item);
      if(conf.sortable) conf.$original.append($O);
    }

    addListItemShow($item, conf);

    disableSelectOption($("[rel=" + optionId + "]", conf.$select), conf);

    if(!conf.buildingSelect) {
      setHighlight($item, conf.highlightAddedLabel, conf);
      selectFirstItem(conf);
      if(conf.sortable) conf.$ol.sortable("refresh");
    }

  }

  function addListItemShow($item, conf) {

    // reveal the currently hidden item with optional animation
    // used only by addListItem()

    if(conf.animate && !conf.buildingSelect) {
      $item.animate({
        opacity: "show",
        height: "show"
      }, 100, "swing", function() {
        $item.animate({
          height: "+=2px"
        }, 50, "swing", function() {
          $item.animate({
            height: "-=2px"
          }, 25, "swing");
        });
      });
    } else {
      $item.show();
    }
  }

  function dropListItem(optionId, conf, highlightItem) {

    // remove an item from the html list

    if (typeof(highlightItem) == "undefined") var highlightItem = true;
    var $O = $('#' + optionId);

    $O.removeAttr("selected");
    var $item = conf.$ol.children("li[rel=" + optionId + "]");

    dropListItemHide($item, conf);
    enableSelectOption($("[rel=" + optionId + "]", conf.removeWhenAdded ? conf.$selectRemoved : conf.$select), conf);

    if(highlightItem) setHighlight($item, conf.highlightRemovedLabel, conf);

    triggerOriginalChange(optionId, 'drop', conf);

  }

  function dropListItemHide($item, conf) {

    // remove the currently visible item with optional animation
    // used only by dropListItem()

    if(conf.animate && !conf.buildingSelect) {

      var $prevItem = $item.prev("li");

      $item.animate({
        opacity: "hide",
        height: "hide"
      }, 100, "linear", function() {
        $prevItem.animate({
          height: "-=2px"
        }, 50, "swing", function() {
          $prevItem.animate({
            height: "+=2px"
          }, 100, "swing");
        });
        $item.remove();
      });

    } else {
      $item.remove();
    }
  }

  function setHighlight($item, label, conf) {

    // set the contents of the highlight area that appears
    // directly after the <select> single
    // fade it in quickly, then fade it out

    if(!conf.highlight) return;

    label = label || "";

    conf.$select.next("#" + conf.highlightClass + conf.index).remove();

    var $highlight = $("<span>")
      .hide()
      .addClass(conf.highlightClass)
      .attr('id', conf.highlightClass + conf.index)
      .html(label + $item.children("." + conf.listItemLabelClass).eq(0).text());

    conf.$select.after($highlight);

    $highlight.fadeIn("fast", function() {
      setTimeout(function() {
        $highlight.fadeOut("slow");
      }, 50);
    });
  }

  function triggerOriginalChange(optionId, type, conf) {

    // trigger a change event on the original select multiple
    // so that other scripts can pick them up

    conf.ignoreOriginalChangeEvent = true;
    var $option = $("#" + optionId);

    conf.$original.trigger('change', [{
      'option': $option,
      'value': $option.val(),
      'id': optionId,
      'item': conf.$ol.children("[rel=" + optionId + "]"),
      'type': type
    }]);
  }

  // Default configuration
  $.fn.bsmSelect.conf = {
    listType: 'ol',                             // Ordered list 'ol', or unordered list 'ul'
    sortable: false,                            // Should the list be sortable?
    highlight: false,                           // Use the highlight feature?
    animate: false,                             // Animate the the adding/removing of items in the list?
    addItemTarget: 'bottom',                    // Where to place new selected items in list: top or bottom
    hideWhenAdded: false,                       // Hide the option when added to the list? works only in FF
    debugMode: false,                           // Debug mode keeps original select visible

    removeLabel: 'remove',                      // Text used in the "remove" link
    highlightAddedLabel: 'Added: ',             // Text that precedes highlight of added item
    highlightRemovedLabel: 'Removed: ',         // Text that precedes highlight of removed item

    containerClass: 'bsmContainer',             // Class for container that wraps this widget
    selectClass: 'bsmSelect',                   // Class for the newly created <select>
    optionDisabledClass: 'bsmOptionDisabled',   // Class for items that are already selected / disabled
    listClass: 'bsmList',                       // Class for the list ($ol)
    listSortableClass: 'bsmListSortable',       // Another class given to the list when it is sortable
    listItemClass: 'bsmListItem',               // Class for the <li> list items
    listItemLabelClass: 'bsmListItemLabel',     // Class for the label text that appears in list items
    removeClass: 'bsmListItemRemove',           // Class given to the "remove" link
    highlightClass: 'bsmHighlight'              // Class given to the highlight <span>
  };

})(jQuery);