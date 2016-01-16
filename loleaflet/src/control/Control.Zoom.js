/*
 * L.Control.Zoom is used for the default zoom buttons on the map.
 */

L.Control.Zoom = L.Control.extend({
	options: {
		position: 'topleft',
		zoomInText: '+',
		zoomInTitle: 'Zoom in',
		fitWidthText: '↔',
		fitWidthTitle: 'Fit Width',
		zoomOutText: '-',
		zoomOutTitle: 'Zoom out'
	},

	onAdd: function (map) {
		var zoomName = 'leaflet-control-zoom',
		    container = L.DomUtil.create('div', zoomName + ' leaflet-bar'),
		    options = this.options;

		this._zoomInButton  = this._createButton(options.zoomInText, options.zoomInTitle,
		        zoomName + '-in',  container, this._zoomIn);
		this._fitWidthButton  = this._createButton(options.fitWidthText, options.fitWidthTitle,
		        zoomName + '-fitwidth',  container, this._fitWidth);
		this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
		        zoomName + '-out', container, this._zoomOut);

		this._updateDisabled();
		map.on('zoomend zoomlevelschange', this._updateDisabled, this);

		return container;
	},

	onRemove: function (map) {
		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
	},

	disable: function () {
		this._disabled = true;
		this._updateDisabled();
		return this;
	},

	enable: function () {
		this._disabled = false;
		this._updateDisabled();
		return this;
	},

	_zoomIn: function (e) {
		if (!this._disabled) {
			this._map.zoomIn(e.shiftKey ? 3 : 1);
		}
	},

	_fitWidth: function () {
		if (!this._disabled) {
			this._map.fitWidthZoom();
		}
	},

	_zoomOut: function (e) {
		if (!this._disabled) {
			this._map.zoomOut(e.shiftKey ? 3 : 1);
		}
	},

	_createButton: function (html, title, className, container, fn) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		L.DomEvent
		    .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
		    .on(link, 'click', L.DomEvent.stop)
		    .on(link, 'click', fn, this)
		    .on(link, 'click', this._refocusOnMap, this);

		return link;
	},

	_updateDisabled: function () {
		var map = this._map,
			className = 'leaflet-disabled';

		L.DomUtil.removeClass(this._zoomInButton, className);
		L.DomUtil.removeClass(this._fitWidthButton, className);
		L.DomUtil.removeClass(this._zoomOutButton, className);

		if (this._disabled || map._zoom === map.getMinZoom()) {
			L.DomUtil.addClass(this._zoomOutButton, className);
		}
		if (this._disabled || map._zoom === map.getMaxZoom()) {
			L.DomUtil.addClass(this._zoomInButton, className);
		}
	}
});

L.control.zoom = function (options) {
	return new L.Control.Zoom(options);
};
