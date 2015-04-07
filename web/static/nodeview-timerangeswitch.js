/**
 * Nodeview - Time range switch
 * Quickly change time range for every graph in the column
 */

$(document).ready(function() {
	$('.timeRangeSwitch').find('ul > li').click(function() {
		if ($(this).hasClass('disabled') || $(this).hasClass('selected'))
			return;

		var currentRange = $(this).parent().find('.selected').first().text();
		var newRange = $(this).text();

		// Remove "selected" attribute
		$(this).parent().find('li').removeClass('selected');

		// Add "selected" class to this
		$(this).addClass('selected');

		// Add "disabled" class to the other time range switch
		var thisRSIndex = $(this).parent().parent().index();
		var otherRS = $($('.timeRangeSwitch')[thisRSIndex == 1 ? 0 : 1]);
		var otherLi = otherRS.find('li');
		otherLi.removeClass('disabled');
		otherLi.each(function() {
			if ($(this).text() == newRange)
				$(this).addClass('disabled');
		});


		// Replace src attribute of current column (all images that matches current range)
		// => contains "-day." for day (don't force extension since there can be pngs/svgs)
		var srcSelector = '-' + currentRange + '.';
		var newSrcSelector = '-' + newRange + '.';

		var images = $("img[src*='" + srcSelector + "']");
		images.each(function() {
			var currentImg = $(this).attr('src');
			$(this).attr('src', currentImg.replace(srcSelector, newSrcSelector));
		});

		// Tell that the image is loading
		images.each(function() {
			setImageLoading($(this), true);
		});

		updateURL();
	});

	// Keep it on top of window on scroll
	var timeRangeSwitchContainer = $('.timeRangeSwitchContainer');
	var header = $('#header');
	$(window).scroll(function() {
		if ($(this).scrollTop() > header.height())
			timeRangeSwitchContainer.addClass('timeRangeFixed');
		else
			timeRangeSwitchContainer.removeClass('timeRangeFixed');
	});

	// Check if URL contains stuff like ?1=day&2=month
	var urlParams = getURLParams();
	if ('1' in urlParams)
		setTimeRange(0, urlParams['1']);
	if ('2' in urlParams)
		setTimeRange(1, urlParams['2']);
});

/**
 * Update current time range
 * @param columnIndex 0/1
 * @param val hour/day/...
 */
function setTimeRange(columnIndex, val) {
	$($('.timeRangeSwitch').find('ul')[columnIndex]).children().each(function() {
		if ($(this).text() == val)
			$(this).click();
	});
}

/**
 * Time ranges are added to URL whenever they change so they are kept when
 * 	refreshing the page / copy-pasting URL
 */
function updateURL() {
	var uls = $('.timeRangeSwitch').find('ul');
	var firstTR = $(uls[0]).find('.selected').text();
	var secondTR = $(uls[1]).find('.selected').text();

	window.history.replaceState('', 'Overview', '?1=' + firstTR + '&2=' + secondTR);
}

/**
 * Returns an array of the parameters sitting in the URL
 * 	Source: http://stackoverflow.com/posts/2880929/revisions
 */
function getURLParams() {
	var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
		query  = window.location.search.substring(1);

	var urlParams = {};
	while (match = search.exec(query))
		urlParams[decode(match[1])] = decode(match[2]);

	return urlParams;
}
