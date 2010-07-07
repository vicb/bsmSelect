# bsmSelect - Better Select Multiple #

based on asmSelect - Alternate Select Multiple by Ryan Cramer

  * [Google code project](http://code.google.com/p/jquery-asmselect/)
  * [Ryan's article about asmSelect](http://www.ryancramer.com/journal/entries/select_multiple/)
  * the original README can be found in the project root folder

## Demo ##

[bsmSelect demo](http://www.suumit.com/projects/bsmSelect/examples/index.html)

## Requirements ##

* jQuery 1.4+
* jQueryUi 1.8+ when using a sortable list (requires Draggables, Droppables, and Sortables)

## Options ##

### Primary Options ###

* listType:

  * Specify what type of list will be created as part of the bsmSelect.
  * Allowed values: 'ol' or 'ul'
  * Default: 'ol'

* sortable:

  * May the user drag and drop to sort the list of elements they have selected?
  * Allowed values: true or false
  * Default: false
  * Note: In order to use this option, you must have jQuery-UI Draggables, Droppables, and Sortables enabled.

* highlight:

  * Show a quick highlight of what item was added or removed?
  * Allowed values:
    * true/false
    * an animation function
    * the name of an animation function as a properties of $.fn.bsmSelect.effects
  * Default: false

* animate:

  * Animate the adding or removing of items from the list?
  * Allowed values: 
    * true/false
    * an object with properties 'add' and 'drop' which are either:
      * animation function,
      * the name of an animation function as a properties of $.fn.bsmSelect.effects
  * Default: false

* hideWhenAdded:

  * Stop showing in select after item has been added?
  * Allowed values: true or false
  * Default: false
  * Note: Only functional in Firefox 3 at this time.

* addItemTarget:

  * Where to place new selected items that are added to the list.
  * Allowed values: 'top' or 'bottom'
  * Default: 'bottom'

* debugMode:

  * Keeps original select multiple visible so that you can monitor live changes made to it when debugging.
  * Default: false

* extractLabel:

  * A function to compute the list element name from the option object
  * Default: extract the option html

### Text Labels ###

* title

  * Text used for the default select label (when original select title attribute is not set)
  * Default: 'Select...'

* removeLabel:

  * Text used for the remove link of each list item.
  * Default: 'remove'

* highlightAddedLabel:

  * Text that precedes highlight of item added.
  * Default: 'Added: '

* highlightRemovedLabel:

  * Text that precedes highlight of item removed.
  * Default: 'Removed: '

### Modifiable CSS Classes ###

* containerClass:

  * Class for container that wraps the entire bsmSelect.
  * Default: 'bsmContainer'

* selectClass:

  * Class for the newly created <select>.
  * Default: 'bsmSelect'

* listClass:

  * Class for the newly created list of listType (ol or ul).
  * Default: 'bsmList'

* listSortableClass:

  * Another class given to the list when sortable is active.
  * Default: 'bsmListSortable'

* listItemClass:

  * Class given to the <li> list items.
  * Default: 'bsmListItem'

* listItemLabelClass:

  * Class for the label text that appears in list items.
  * Default: 'bsmListItemLabel'

* removeClass:

  * Class given to the remove link in each list item.
  * Default: 'bsmListItemRemove'

* highlightClass:

  * Class given to the highlight <span>.
  * Default: 'bsmHighlight'

## History ##

github latest:

  * improved custom animations
  * support for optgroup
  * ability to set the default select title via the configuration
  * make the original label point to the new select
  * ability to customize the way list label gets extracted from the option

2010-07-02:

  * Renamed asmSelect to bsmSelect
  * Refactor the code in order to implement plugin best practices
  * Ability to use custom animations (see options and examples)


