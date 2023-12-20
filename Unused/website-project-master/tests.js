'use strict';

var Shuffle = window.shuffle;

// ES7 will have Array.prototype.includes.
function arrayIncludes(array, value) {
	return array.indexOf(value) !== -1;
}

// Convert an array-like object to a real array.
function toArray(thing) {
	return Array.prototype.slice.call(thing);
}

var Demo = function (element) {
	this.schools = toArray(document.querySelectorAll('.js-school input'));
	this.levels = toArray(document.querySelectorAll('.js-level input'));
	this.subjects = toArray(document.querySelectorAll('.js-subject input'));

	this.shuffle = new Shuffle(element, {
		easing: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', // easeOutQuart
		sizer: '.the-sizer',
	});

	this.filters = {
		schools: [],
		levels: [],
		subjects: [],
	};

	this._bindEventListeners();
};

/**
 * Bind event listeners for when the filters change.
 */
Demo.prototype._bindEventListeners = function () {
	this._onSchoolChange = this._handleSchoolChange.bind(this);
	this._onLevelChange = this._handleLevelChange.bind(this);
	this._onSubjectChange = this._handleSubjectChange.bind(this);

	this.schools.forEach(function (input) {
		input.addEventListener('change', this._onSchoolChange);
	}, this);

	this.levels.forEach(function (button) {
		button.addEventListener('change', this._onLevelChange);
	}, this);
  
	this.subjects.forEach(function (button) {
		button.addEventListener('change',this._onSubjectChange);
	},this);
};

/**
 * Get the values of each checked input.
 * @return {Array.<string>}
 */
Demo.prototype._getCurrentSchoolFilters = function () {
	return this.schools.filter(function (input) {
		return input.checked;
	}).map(function (input) {
		return input.value;
	});
};

/**
 * Get the values of each `active` button.
 * @return {Array.<string>}
 */
Demo.prototype._getCurrentLevelFilters = function () {
	return this.levels.filter(function (input) {
		return input.checked;
	}).map(function (input) {
		return input.value;
	});
};

Demo.prototype._getCurrentSubjectFilters = function () {
	return this.subjects.filter(function (input) {
		return input.checked;
	}).map(function (input) {
		return input.value;
	});
};

/**
 * A shape input check state changed, update the current filters and filte.r
 */
Demo.prototype._handleSchoolChange = function () {
	this.filters.schools = this._getCurrentSchoolFilters();
	this.filter();
};

/**
 * A color button was clicked. Update filters and display.
 * @param {Event} evt Click event object.
 */
Demo.prototype._handleLevelChange = function () {
	this.filters.levels = this._getCurrentLevelFilters();
	this.filter();
};

Demo.prototype._handleSubjectChange = function () {
	this.filters.subjects = this._getCurrentSubjectFilters();
	this.filter();
};


/**
 * Filter shuffle based on the current state of filters.
 */
Demo.prototype.filter = function () {
	if (this.hasActiveFilters()) {
		this.shuffle.filter(this.itemPassesFilters.bind(this));
	} else {
		this.shuffle.filter(Shuffle.ALL_ITEMS);
	}
};

/**
 * If any of the arrays in the `filters` property have a length of more than zero,
 * that means there is an active filter.
 * @return {boolean}
 */
Demo.prototype.hasActiveFilters = function () {
	return Object.keys(this.filters).some(function (key) {
		return this.filters[key].length > 0;
	}, this);
};

/**
 * Determine whether an element passes the current filters.
 * @param {Element} element Element to test.
 * @return {boolean} Whether it satisfies all current filters.
 */
Demo.prototype.itemPassesFilters = function (element) {
	var schools = this.filters.schools;
	var levels = this.filters.levels;
	var subjects = this.filters.subjects;
	var level = element.getAttribute('data-level');
	var school = element.getAttribute('data-school');
	var subject = element.getAttribute('data-subject');
	// If there are active shape filters and this shape is not in that array.
	if (schools.length > 0 && !arrayIncludes(schools, school)) {
		return false;
	}

	// If there are active color filters and this color is not in that array.
	if (levels.length > 0 && !arrayIncludes(levels, level)) {
		return false;
	}
  
	// If there are active subject filters and this subject is not in that array
	if (subjects.length > 0 && !arrayIncludes(subjects,subject)) {
		return false;
	}
	return true;
};

document.addEventListener('DOMContentLoaded', function () {
	window.demo = new Demo(document.querySelector('.js-shuffle'));
});