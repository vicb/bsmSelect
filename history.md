# bsmSelect #

v1.3.0-dev

  * API break: animate & highlight effects (the compatibility plugin might be use for backward compatibility),
  * core (bsmSelect) code cleanup,
  * store relations in element data

v1.3.0 - 2010-09-03

  * API BREAK: $.fn.bsmSelect moved to $.bsmSelect,
  * new basic plugin infrastructure,
  * restore the sortable functionality through a plugin.

v1.2.2 - 2010-08-27

  * ensure id uniqueness (fix github issue #3)

v1.2.1 - 2010-08-14

  * fix the highlight effect
  * a few tweaks
  * syntax

v1.2.0 - 2010-08-13

  * refactoring,
  * drop of the sortable functionality

v1.1.1 - 2010-07-26:

  * Latest changes from Ryan Cramer's asmSelect
  * Enhancements from Andy Fowler
  * improved custom animations
  * support for optgroup
  * ability to set the default select title via the configuration
  * make the original label point to the new select
  * ability to customize the way list label gets extracted from the option

v1.0 - 2010-07-02:

  * Renamed asmSelect to bsmSelect
  * Refactor the code in order to implement plugin best practices
  * Ability to use custom animations (see options and examples)

# bsmSelect plugins #

## sortable ##

Allow sorting the item list.

v1.0.0-dev

  * Can be instanciated without the new keyword,
  * Ability to override default options,
  * Reflect core code updates.

v1.0.0 - 2010-09-03

  * initial relase

## compatibility ##

Allow backward compatibility for animate & highlight options (dropped after bsmSelect v1.3.0)

v1.0.0-dev

  * intial release