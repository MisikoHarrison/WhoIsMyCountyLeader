function InfoBubble(opt_options) {
  this.extend(InfoBubble, google.maps.OverlayView);
  this.tabs_ = [];
  this.activeTab_ = null;
  this.baseZIndex_ = 100;
  this.isOpen_ = false;

  var options = opt_options || {};

  if (options['backgroundColor'] == undefined) {
    options['backgroundColor'] = this.BACKGROUND_COLOR_;
  }

  if (options['borderColor'] == undefined) {
    options['borderColor'] = this.BORDER_COLOR_;
  }

  if (options['borderRadius'] == undefined) {
    options['borderRadius'] = this.BORDER_RADIUS_;
  }

  if (options['borderWidth'] == undefined) {
    options['borderWidth'] = this.BORDER_WIDTH_;
  }

  if (options['padding'] == undefined) {
    options['padding'] = this.PADDING_;
  }

  if (options['arrowPosition'] == undefined) {
    options['arrowPosition'] = this.ARROW_POSITION_;
  }

  if (options['disableAutoPan'] == undefined) {
    options['disableAutoPan'] = false;
  }

  if (options['disableAnimation'] == undefined) {
    options['disableAnimation'] = false;
  }

  if (options['minWidth'] == undefined) {
    options['minWidth'] = this.MIN_WIDTH_;
  }

  if (options['shadowStyle'] == undefined) {
    options['shadowStyle'] = this.SHADOW_STYLE_;
  }

  if (options['arrowSize'] == undefined) {
    options['arrowSize'] = this.ARROW_SIZE_;
  }

  if (options['arrowStyle'] == undefined) {
    options['arrowStyle'] = this.ARROW_STYLE_;
  }

  this.buildDom_();

  this.setValues(options);
}
window['InfoBubble'] = InfoBubble;
InfoBubble.prototype.ARROW_SIZE_ = 15;
InfoBubble.prototype.ARROW_STYLE_ = 0;
InfoBubble.prototype.SHADOW_STYLE_ = 1;
InfoBubble.prototype.MIN_WIDTH_ = 50;
InfoBubble.prototype.ARROW_POSITION_ = 50;
InfoBubble.prototype.PADDING_ = 10;
InfoBubble.prototype.BORDER_WIDTH_ = 1;
InfoBubble.prototype.BORDER_COLOR_ = '#ccc';
InfoBubble.prototype.BORDER_RADIUS_ = 10;
InfoBubble.prototype.BACKGROUND_COLOR_ = '#fff';
InfoBubble.prototype.extend = function(obj1, obj2) {
  return (function(object) {
    for (var property in object.prototype) {
      this.prototype[property] = object.prototype[property];
    }
    return this;
  }).apply(obj1, [obj2]);
};

InfoBubble.prototype.buildDom_ = function() {
  var bubble = this.bubble_ = document.createElement('DIV');
  bubble.style['position'] = 'absolute';
  bubble.style['zIndex'] = this.baseZIndex_;

  var tabsContainer = this.tabsContainer_ = document.createElement('DIV');
  tabsContainer.style['position'] = 'relative';

  var close = this.close_ = document.createElement('IMG');
  close.style['position'] = 'absolute';
  close.style['width'] = this.px(12);
  close.style['height'] = this.px(12);
  close.style['border'] = 0;
  close.style['zIndex'] = this.baseZIndex_ + 1;
  close.style['cursor'] = 'pointer';
  close.src = 'http://maps.gstatic.com/intl/en_us/mapfiles/iw_close.gif';

  var that = this;
  google.maps.event.addDomListener(close, 'click', function() {
    that.close();
    google.maps.event.trigger(that, 'closeclick');
  });

  var contentContainer = this.contentContainer_ = document.createElement('DIV');
  contentContainer.style['overflowX'] = 'auto';
  contentContainer.style['overflowY'] = 'auto';
  contentContainer.style['cursor'] = 'default';
  contentContainer.style['clear'] = 'both';
  contentContainer.style['position'] = 'relative';

  var content = this.content_ = document.createElement('DIV');
  contentContainer.appendChild(content);

  var arrow = this.arrow_ = document.createElement('DIV');
  arrow.style['position'] = 'relative';

  var arrowOuter = this.arrowOuter_ = document.createElement('DIV');
  var arrowInner = this.arrowInner_ = document.createElement('DIV');

  var arrowSize = this.getArrowSize_();

  arrowOuter.style['position'] = arrowInner.style['position'] = 'absolute';
  arrowOuter.style['left'] = arrowInner.style['left'] = '50%';
  arrowOuter.style['height'] = arrowInner.style['height'] = '0';
  arrowOuter.style['width'] = arrowInner.style['width'] = '0';
  arrowOuter.style['marginLeft'] = this.px(-arrowSize);
  arrowOuter.style['borderWidth'] = this.px(arrowSize);
  arrowOuter.style['borderBottomWidth'] = 0;

  var bubbleShadow = this.bubbleShadow_ = document.createElement('DIV');
  bubbleShadow.style['position'] = 'absolute';

  bubble.style['display'] = bubbleShadow.style['display'] = 'none';

  bubble.appendChild(this.tabsContainer_);
  bubble.appendChild(close);
  bubble.appendChild(contentContainer);
  arrow.appendChild(arrowOuter);
  arrow.appendChild(arrowInner);
  bubble.appendChild(arrow);

  var stylesheet = document.createElement('style');
  stylesheet.setAttribute('type', 'text/css');

  this.animationName_ = '_ibani_' + Math.round(Math.random() * 10000);

  var css = '.' + this.animationName_ + '{-webkit-animation-name:' +
      this.animationName_ + ';-webkit-animation-duration:0.5s;' +
      '-webkit-animation-iteration-count:1;}' +
      '@-webkit-keyframes ' + this.animationName_ + ' {from {' +
      '-webkit-transform: scale(0)}50% {-webkit-transform: scale(1.2)}90% ' +
      '{-webkit-transform: scale(0.95)}to {-webkit-transform: scale(1)}}';

  stylesheet.textContent = css;
  document.getElementsByTagName('head')[0].appendChild(stylesheet);
};

InfoBubble.prototype.setBackgroundClassName = function(className) {
  this.set('backgroundClassName', className);
};
InfoBubble.prototype['setBackgroundClassName'] =
    InfoBubble.prototype.setBackgroundClassName;

InfoBubble.prototype.backgroundClassName_changed = function() {
  this.content_.className = this.get('backgroundClassName');
};
InfoBubble.prototype['backgroundClassName_changed'] =
    InfoBubble.prototype.backgroundClassName_changed;

InfoBubble.prototype.setTabClassName = function(className) {
  this.set('tabClassName', className);
};
InfoBubble.prototype['setTabClassName'] =
    InfoBubble.prototype.setTabClassName;

InfoBubble.prototype.tabClassName_changed = function() {
  this.updateTabStyles_();
};
InfoBubble.prototype['tabClassName_changed'] =
    InfoBubble.prototype.tabClassName_changed;

InfoBubble.prototype.getArrowStyle_ = function() {
  return parseInt(this.get('arrowStyle'), 10) || 0;
};

InfoBubble.prototype.setArrowStyle = function(style) {
  this.set('arrowStyle', style);
};
InfoBubble.prototype['setArrowStyle'] =
    InfoBubble.prototype.setArrowStyle;

InfoBubble.prototype.arrowStyle_changed = function() {
  this.arrowSize_changed();
};
InfoBubble.prototype['arrowStyle_changed'] =
    InfoBubble.prototype.arrowStyle_changed;

InfoBubble.prototype.getArrowSize_ = function() {
  return parseInt(this.get('arrowSize'), 10) || 0;
};

InfoBubble.prototype.setArrowSize = function(size) {
  this.set('arrowSize', size);
};
InfoBubble.prototype['setArrowSize'] =
    InfoBubble.prototype.setArrowSize;

InfoBubble.prototype.arrowSize_changed = function() {
  this.borderWidth_changed();
};
InfoBubble.prototype['arrowSize_changed'] =
    InfoBubble.prototype.arrowSize_changed;

InfoBubble.prototype.setArrowPosition = function(pos) {
  this.set('arrowPosition', pos);
};
InfoBubble.prototype['setArrowPosition'] =
    InfoBubble.prototype.setArrowPosition;

InfoBubble.prototype.getArrowPosition_ = function() {
  return parseInt(this.get('arrowPosition'), 10) || 0;
};

InfoBubble.prototype.arrowPosition_changed = function() {
  var pos = this.getArrowPosition_();
  this.arrowOuter_.style['left'] = this.arrowInner_.style['left'] = pos + '%';

  this.redraw_();
};
InfoBubble.prototype['arrowPosition_changed'] =
    InfoBubble.prototype.arrowPosition_changed;

InfoBubble.prototype.setZIndex = function(zIndex) {
  this.set('zIndex', zIndex);
};
InfoBubble.prototype['setZIndex'] = InfoBubble.prototype.setZIndex;

InfoBubble.prototype.getZIndex = function() {
  return parseInt(this.get('zIndex'), 10) || this.baseZIndex_;
};

InfoBubble.prototype.zIndex_changed = function() {
  var zIndex = this.getZIndex();

  this.bubble_.style['zIndex'] = this.baseZIndex_ = zIndex;
  this.close_.style['zIndex'] = zIndex + 1;
};
InfoBubble.prototype['zIndex_changed'] = InfoBubble.prototype.zIndex_changed;

InfoBubble.prototype.setShadowStyle = function(shadowStyle) {
  this.set('shadowStyle', shadowStyle);
};
InfoBubble.prototype['setShadowStyle'] = InfoBubble.prototype.setShadowStyle;

InfoBubble.prototype.getShadowStyle_ = function() {
  return parseInt(this.get('shadowStyle'), 10) || 0;
};

InfoBubble.prototype.shadowStyle_changed = function() {
  var shadowStyle = this.getShadowStyle_();

  var display = '';
  var shadow = '';
  var backgroundColor = '';
  switch (shadowStyle) {
    case 0:
      display = 'none';
      break;
    case 1:
      shadow = '40px 15px 10px rgba(33,33,33,0.3)';
      backgroundColor = 'transparent';
      break;
    case 2:
      shadow = '0 0 2px rgba(33,33,33,0.3)';
      backgroundColor = 'rgba(33,33,33,0.35)';
      break;
  }
  this.bubbleShadow_.style['boxShadow'] =
      this.bubbleShadow_.style['webkitBoxShadow'] =
      this.bubbleShadow_.style['MozBoxShadow'] = shadow;
  this.bubbleShadow_.style['backgroundColor'] = backgroundColor;
  if (this.isOpen_) {
    this.bubbleShadow_.style['display'] = display;
    this.draw();
  }
};
InfoBubble.prototype['shadowStyle_changed'] =
    InfoBubble.prototype.shadowStyle_changed;

InfoBubble.prototype.showCloseButton = function() {
  this.set('hideCloseButton', false);
};
InfoBubble.prototype['showCloseButton'] = InfoBubble.prototype.showCloseButton;

InfoBubble.prototype.hideCloseButton = function() {
  this.set('hideCloseButton', true);
};
InfoBubble.prototype['hideCloseButton'] = InfoBubble.prototype.hideCloseButton;

InfoBubble.prototype.hideCloseButton_changed = function() {
  this.close_.style['display'] = this.get('hideCloseButton') ? 'none' : '';
};
InfoBubble.prototype['hideCloseButton_changed'] =
    InfoBubble.prototype.hideCloseButton_changed;

InfoBubble.prototype.setBackgroundColor = function(color) {
  if (color) {
    this.set('backgroundColor', color);
  }
};
InfoBubble.prototype['setBackgroundColor'] =
    InfoBubble.prototype.setBackgroundColor;

InfoBubble.prototype.backgroundColor_changed = function() {
  var backgroundColor = this.get('backgroundColor');
  this.contentContainer_.style['backgroundColor'] = backgroundColor;

  this.arrowInner_.style['borderColor'] = backgroundColor +
      ' transparent transparent';
  this.updateTabStyles_();
};
InfoBubble.prototype['backgroundColor_changed'] =
    InfoBubble.prototype.backgroundColor_changed;

InfoBubble.prototype.setBorderColor = function(color) {
  if (color) {
    this.set('borderColor', color);
  }
};
InfoBubble.prototype['setBorderColor'] = InfoBubble.prototype.setBorderColor;

InfoBubble.prototype.borderColor_changed = function() {
  var borderColor = this.get('borderColor');

  var contentContainer = this.contentContainer_;
  var arrowOuter = this.arrowOuter_;
  contentContainer.style['borderColor'] = borderColor;

  arrowOuter.style['borderColor'] = borderColor +
      ' transparent transparent';

  contentContainer.style['borderStyle'] =
      arrowOuter.style['borderStyle'] =
      this.arrowInner_.style['borderStyle'] = 'solid';

  this.updateTabStyles_();
};
InfoBubble.prototype['borderColor_changed'] =
    InfoBubble.prototype.borderColor_changed;

InfoBubble.prototype.setBorderRadius = function(radius) {
  this.set('borderRadius', radius);
};
InfoBubble.prototype['setBorderRadius'] = InfoBubble.prototype.setBorderRadius;

InfoBubble.prototype.getBorderRadius_ = function() {
  return parseInt(this.get('borderRadius'), 10) || 0;
};

InfoBubble.prototype.borderRadius_changed = function() {
  var borderRadius = this.getBorderRadius_();
  var borderWidth = this.getBorderWidth_();

  this.contentContainer_.style['borderRadius'] =
      this.contentContainer_.style['MozBorderRadius'] =
      this.contentContainer_.style['webkitBorderRadius'] =
      this.bubbleShadow_.style['borderRadius'] =
      this.bubbleShadow_.style['MozBorderRadius'] =
      this.bubbleShadow_.style['webkitBorderRadius'] = this.px(borderRadius);

  this.tabsContainer_.style['paddingLeft'] =
      this.tabsContainer_.style['paddingRight'] =
      this.px(borderRadius + borderWidth);

  this.redraw_();
};
InfoBubble.prototype['borderRadius_changed'] =
    InfoBubble.prototype.borderRadius_changed;

InfoBubble.prototype.getBorderWidth_ = function() {
  return parseInt(this.get('borderWidth'), 10) || 0;
};

InfoBubble.prototype.setBorderWidth = function(width) {
  this.set('borderWidth', width);
};
InfoBubble.prototype['setBorderWidth'] = InfoBubble.prototype.setBorderWidth;

InfoBubble.prototype.borderWidth_changed = function() {
  var borderWidth = this.getBorderWidth_();

  this.contentContainer_.style['borderWidth'] = this.px(borderWidth);
  this.tabsContainer_.style['top'] = this.px(borderWidth);

  this.updateArrowStyle_();
  this.updateTabStyles_();
  this.borderRadius_changed();
  this.redraw_();
};
InfoBubble.prototype['borderWidth_changed'] =
    InfoBubble.prototype.borderWidth_changed;

InfoBubble.prototype.updateArrowStyle_ = function() {
  var borderWidth = this.getBorderWidth_();
  var arrowSize = this.getArrowSize_();
  var arrowStyle = this.getArrowStyle_();
  var arrowOuterSizePx = this.px(arrowSize);
  var arrowInnerSizePx = this.px(Math.max(0, arrowSize - borderWidth));

  var outer = this.arrowOuter_;
  var inner = this.arrowInner_;

  this.arrow_.style['marginTop'] = this.px(-borderWidth);
  outer.style['borderTopWidth'] = arrowOuterSizePx;
  inner.style['borderTopWidth'] = arrowInnerSizePx;

  if (arrowStyle == 0 || arrowStyle == 1) {
    outer.style['borderLeftWidth'] = arrowOuterSizePx;
    inner.style['borderLeftWidth'] = arrowInnerSizePx;
  } else {
    outer.style['borderLeftWidth'] = inner.style['borderLeftWidth'] = 0;
  }

  if (arrowStyle == 0 || arrowStyle == 2) {
    outer.style['borderRightWidth'] = arrowOuterSizePx;
    inner.style['borderRightWidth'] = arrowInnerSizePx;
  } else {
    outer.style['borderRightWidth'] = inner.style['borderRightWidth'] = 0;
  }

  if (arrowStyle < 2) {
    outer.style['marginLeft'] = this.px(-(arrowSize));
    inner.style['marginLeft'] = this.px(-(arrowSize - borderWidth));
  } else {
    outer.style['marginLeft'] = inner.style['marginLeft'] = 0;
  }

  if (borderWidth == 0) {
    outer.style['display'] = 'none';
  } else {
    outer.style['display'] = '';
  }
};

InfoBubble.prototype.setPadding = function(padding) {
  this.set('padding', padding);
};
InfoBubble.prototype['setPadding'] = InfoBubble.prototype.setPadding;

InfoBubble.prototype.getPadding_ = function() {
  return parseInt(this.get('padding'), 10) || 0;
};

InfoBubble.prototype.padding_changed = function() {
  var padding = this.getPadding_();
  this.contentContainer_.style['padding'] = this.px(padding);
  this.updateTabStyles_();

  this.redraw_();
};
InfoBubble.prototype['padding_changed'] = InfoBubble.prototype.padding_changed;


InfoBubble.prototype.px = function(num) {
  if (num) {

    return num + 'px';
  }
  return num;
};

InfoBubble.prototype.addEvents_ = function() {

  var events = ['mousedown', 'mousemove', 'mouseover', 'mouseout', 'mouseup',
      'mousewheel', 'DOMMouseScroll', 'touchstart', 'touchend', 'touchmove',
      'dblclick', 'contextmenu', 'click'];

  var bubble = this.bubble_;
  this.listeners_ = [];
  for (var i = 0, event; event = events[i]; i++) {
    this.listeners_.push(
      google.maps.event.addDomListener(bubble, event, function(e) {
        e.cancelBubble = true;
        if (e.stopPropagation) {
          e.stopPropagation();
        }
      })
    );
  }
};

InfoBubble.prototype.draw = function() {
  var projection = this.getProjection();

  if (!projection) {
   
    return;
  }

  var latLng = /** @type {google.maps.LatLng} */ (this.get('position'));

  if (!latLng) {
    this.close();
    return;
  }

  var tabHeight = 0;

  if (this.activeTab_) {
    tabHeight = this.activeTab_.offsetHeight;
  }

  var anchorHeight = this.getAnchorHeight_();
  var arrowSize = this.getArrowSize_();
  var arrowPosition = this.getArrowPosition_();

  arrowPosition = arrowPosition / 100;

  var pos = projection.fromLatLngToDivPixel(latLng);
  var width = this.contentContainer_.offsetWidth;
  var height = this.bubble_.offsetHeight;

  if (!width) {
    return;
  }

  var top = pos.y - (height + arrowSize);

  if (anchorHeight) {

    top -= anchorHeight;
  }

  var left = pos.x - (width * arrowPosition);

  this.bubble_.style['top'] = this.px(top);
  this.bubble_.style['left'] = this.px(left);

  var shadowStyle = parseInt(this.get('shadowStyle'), 10);

  switch (shadowStyle) {
    case 1:
  
      this.bubbleShadow_.style['top'] = this.px(top + tabHeight - 1);
      this.bubbleShadow_.style['left'] = this.px(left);
      this.bubbleShadow_.style['width'] = this.px(width);
      this.bubbleShadow_.style['height'] =
          this.px(this.contentContainer_.offsetHeight - arrowSize);
      break;
    case 2:
      
      width = width * 0.8;
      if (anchorHeight) {
        this.bubbleShadow_.style['top'] = this.px(pos.y);
      } else {
        this.bubbleShadow_.style['top'] = this.px(pos.y + arrowSize);
      }
      this.bubbleShadow_.style['left'] = this.px(pos.x - width * arrowPosition);

      this.bubbleShadow_.style['width'] = this.px(width);
      this.bubbleShadow_.style['height'] = this.px(2);
      break;
  }
};
InfoBubble.prototype['draw'] = InfoBubble.prototype.draw;

InfoBubble.prototype.onRemove = function() {
  if (this.bubble_ && this.bubble_.parentNode) {
    this.bubble_.parentNode.removeChild(this.bubble_);
  }
  if (this.bubbleShadow_ && this.bubbleShadow_.parentNode) {
    this.bubbleShadow_.parentNode.removeChild(this.bubbleShadow_);
  }

  for (var i = 0, listener; listener = this.listeners_[i]; i++) {
    google.maps.event.removeListener(listener);
  }
};
InfoBubble.prototype['onRemove'] = InfoBubble.prototype.onRemove;

InfoBubble.prototype.isOpen = function() {
  return this.isOpen_;
};
InfoBubble.prototype['isOpen'] = InfoBubble.prototype.isOpen;

InfoBubble.prototype.close = function() {
  if (this.bubble_) {
    this.bubble_.style['display'] = 'none';

    this.bubble_.className =
        this.bubble_.className.replace(this.animationName_, '');
  }

  if (this.bubbleShadow_) {
    this.bubbleShadow_.style['display'] = 'none';
    this.bubbleShadow_.className =
        this.bubbleShadow_.className.replace(this.animationName_, '');
  }
  this.isOpen_ = false;
};
InfoBubble.prototype['close'] = InfoBubble.prototype.close;

InfoBubble.prototype.open = function(opt_map, opt_anchor) {
  var that = this;
  window.setTimeout(function() {
    that.open_(opt_map, opt_anchor);
  }, 0);
};

InfoBubble.prototype.open_ = function(opt_map, opt_anchor) {
  this.updateContent_();

  if (opt_map) {
    this.setMap(opt_map);
  }

  if (opt_anchor) {
    this.set('anchor', opt_anchor);
    this.bindTo('anchorPoint', opt_anchor);
    this.bindTo('position', opt_anchor);
  }

  this.bubble_.style['display'] = this.bubbleShadow_.style['display'] = '';
  var animation = !this.get('disableAnimation');

  if (animation) {
  
    this.bubble_.className += ' ' + this.animationName_;
    this.bubbleShadow_.className += ' ' + this.animationName_;
  }

  this.redraw_();
  this.isOpen_ = true;

  var pan = !this.get('disableAutoPan');
  if (pan) {
    var that = this;
    window.setTimeout(function() {
     
      that.panToView();
    }, 200);
  }
};
InfoBubble.prototype['open'] = InfoBubble.prototype.open;

InfoBubble.prototype.setPosition = function(position) {
  if (position) {
    this.set('position', position);
  }
};
InfoBubble.prototype['setPosition'] = InfoBubble.prototype.setPosition;

InfoBubble.prototype.getPosition = function() {
  return /** @type {google.maps.LatLng} */ (this.get('position'));
};
InfoBubble.prototype['getPosition'] = InfoBubble.prototype.getPosition;

InfoBubble.prototype.position_changed = function() {
  this.draw();
};
InfoBubble.prototype['position_changed'] =
    InfoBubble.prototype.position_changed;

InfoBubble.prototype.panToView = function() {
  var projection = this.getProjection();

  if (!projection) {

    return;
  }

  if (!this.bubble_) {

    return;
  }

  var anchorHeight = this.getAnchorHeight_();
  var height = this.bubble_.offsetHeight + anchorHeight;
  var map = this.get('map');
  var mapDiv = map.getDiv();
  var mapHeight = mapDiv.offsetHeight;

  var latLng = this.getPosition();
  var centerPos = projection.fromLatLngToContainerPixel(map.getCenter());
  var pos = projection.fromLatLngToContainerPixel(latLng);

  var spaceTop = centerPos.y - height;

  var spaceBottom = mapHeight - centerPos.y;

  var needsTop = spaceTop < 0;
  var deltaY = 0;

  if (needsTop) {
    spaceTop *= -1;
    deltaY = (spaceTop + spaceBottom) / 2;
  }

  pos.y -= deltaY;
  latLng = projection.fromContainerPixelToLatLng(pos);

  if (map.getCenter() != latLng) {
    map.panTo(latLng);
  }
};
InfoBubble.prototype['panToView'] = InfoBubble.prototype.panToView;

InfoBubble.prototype.htmlToDocumentFragment_ = function(htmlString) {
  htmlString = htmlString.replace(/^\s*([\S\s]*)\b\s*$/, '$1');
  var tempDiv = document.createElement('DIV');
  tempDiv.innerHTML = htmlString;
  if (tempDiv.childNodes.length == 1) {
    return /** @type {!Node} */ (tempDiv.removeChild(tempDiv.firstChild));
  } else {
    var fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    return fragment;
  }
};

InfoBubble.prototype.removeChildren_ = function(node) {
  if (!node) {
    return;
  }

  var child;
  while (child = node.firstChild) {
    node.removeChild(child);
  }
};

InfoBubble.prototype.setContent = function(content) {
  this.set('content', content);
};
InfoBubble.prototype['setContent'] = InfoBubble.prototype.setContent;

InfoBubble.prototype.getContent = function() {
  return /** @type {Node|string} */ (this.get('content'));
};
InfoBubble.prototype['getContent'] = InfoBubble.prototype.getContent;

InfoBubble.prototype.updateContent_ = function() {
  if (!this.content_) {
    
    return;
  }

  this.removeChildren_(this.content_);
  var content = this.getContent();
  if (content) {
    if (typeof content == 'string') {
      content = this.htmlToDocumentFragment_(content);
    }
    this.content_.appendChild(content);

    var that = this;
    var images = this.content_.getElementsByTagName('IMG');
    for (var i = 0, image; image = images[i]; i++) {
      
      google.maps.event.addDomListener(image, 'load', function() {
        that.imageLoaded_();
      });
    }
    google.maps.event.trigger(this, 'domready');
  }
  this.redraw_();
};

InfoBubble.prototype.imageLoaded_ = function() {
  var pan = !this.get('disableAutoPan');
  this.redraw_();
  if (pan && (this.tabs_.length == 0 || this.activeTab_.index == 0)) {
    this.panToView();
  }
};

InfoBubble.prototype.updateTabStyles_ = function() {
  if (this.tabs_ && this.tabs_.length) {
    for (var i = 0, tab; tab = this.tabs_[i]; i++) {
      this.setTabStyle_(tab.tab);
    }
    this.activeTab_.style['zIndex'] = this.baseZIndex_;
    var borderWidth = this.getBorderWidth_();
    var padding = this.getPadding_() / 2;
    this.activeTab_.style['borderBottomWidth'] = 0;
    this.activeTab_.style['paddingBottom'] = this.px(padding + borderWidth);
  }
};

InfoBubble.prototype.setTabStyle_ = function(tab) {
  var backgroundColor = this.get('backgroundColor');
  var borderColor = this.get('borderColor');
  var borderRadius = this.getBorderRadius_();
  var borderWidth = this.getBorderWidth_();
  var padding = this.getPadding_();

  var marginRight = this.px(-(Math.max(padding, borderRadius)));
  var borderRadiusPx = this.px(borderRadius);

  var index = this.baseZIndex_;
  if (tab.index) {
    index -= tab.index;
  }

  var styles = {
    'cssFloat': 'left',
    'position': 'relative',
    'cursor': 'pointer',
    'backgroundColor': backgroundColor,
    'border': this.px(borderWidth) + ' solid ' + borderColor,
    'padding': this.px(padding / 2) + ' ' + this.px(padding),
    'marginRight': marginRight,
    'whiteSpace': 'nowrap',
    'borderRadiusTopLeft': borderRadiusPx,
    'MozBorderRadiusTopleft': borderRadiusPx,
    'webkitBorderTopLeftRadius': borderRadiusPx,
    'borderRadiusTopRight': borderRadiusPx,
    'MozBorderRadiusTopright': borderRadiusPx,
    'webkitBorderTopRightRadius': borderRadiusPx,
    'zIndex': index,
    'display': 'inline'
  };

  for (var style in styles) {
    tab.style[style] = styles[style];
  }

  var className = this.get('tabClassName');
  if (className != undefined) {
    tab.className += ' ' + className;
  }
};

InfoBubble.prototype.addTabActions_ = function(tab) {
  var that = this;
  tab.listener_ = google.maps.event.addDomListener(tab, 'click', function() {
    that.setTabActive_(this);
  });
};

InfoBubble.prototype.setTabActive = function(index) {
  var tab = this.tabs_[index - 1];

  if (tab) {
    this.setTabActive_(tab.tab);
  }
};
InfoBubble.prototype['setTabActive'] = InfoBubble.prototype.setTabActive;

InfoBubble.prototype.setTabActive_ = function(tab) {
  if (!tab) {
    this.setContent('');
    this.updateContent_();
    return;
  }

  var padding = this.getPadding_() / 2;
  var borderWidth = this.getBorderWidth_();

  if (this.activeTab_) {
    var activeTab = this.activeTab_;
    activeTab.style['zIndex'] = this.baseZIndex_ - activeTab.index;
    activeTab.style['paddingBottom'] = this.px(padding);
    activeTab.style['borderBottomWidth'] = this.px(borderWidth);
  }

  tab.style['zIndex'] = this.baseZIndex_;
  tab.style['borderBottomWidth'] = 0;
  tab.style['marginBottomWidth'] = '-10px';
  tab.style['paddingBottom'] = this.px(padding + borderWidth);

  this.setContent(this.tabs_[tab.index].content);
  this.updateContent_();

  this.activeTab_ = tab;

  this.redraw_();
};

InfoBubble.prototype.setMaxWidth = function(width) {
  this.set('maxWidth', width);
};
InfoBubble.prototype['setMaxWidth'] = InfoBubble.prototype.setMaxWidth;

InfoBubble.prototype.maxWidth_changed = function() {
  this.redraw_();
};
InfoBubble.prototype['maxWidth_changed'] =
    InfoBubble.prototype.maxWidth_changed;

InfoBubble.prototype.setMaxHeight = function(height) {
  this.set('maxHeight', height);
};
InfoBubble.prototype['setMaxHeight'] = InfoBubble.prototype.setMaxHeight;

InfoBubble.prototype.maxHeight_changed = function() {
  this.redraw_();
};
InfoBubble.prototype['maxHeight_changed'] =
    InfoBubble.prototype.maxHeight_changed;

InfoBubble.prototype.setMinWidth = function(width) {
  this.set('minWidth', width);
};
InfoBubble.prototype['setMinWidth'] = InfoBubble.prototype.setMinWidth;

InfoBubble.prototype.minWidth_changed = function() {
  this.redraw_();
};
InfoBubble.prototype['minWidth_changed'] =
    InfoBubble.prototype.minWidth_changed;

InfoBubble.prototype.setMinHeight = function(height) {
  this.set('minHeight', height);
};
InfoBubble.prototype['setMinHeight'] = InfoBubble.prototype.setMinHeight;

InfoBubble.prototype.minHeight_changed = function() {
  this.redraw_();
};
InfoBubble.prototype['minHeight_changed'] =
    InfoBubble.prototype.minHeight_changed;

InfoBubble.prototype.addTab = function(label, content) {
  var tab = document.createElement('DIV');
  tab.innerHTML = label;

  this.setTabStyle_(tab);
  this.addTabActions_(tab);

  this.tabsContainer_.appendChild(tab);

  this.tabs_.push({
    label: label,
    content: content,
    tab: tab
  });

  tab.index = this.tabs_.length - 1;
  tab.style['zIndex'] = this.baseZIndex_ - tab.index;

  if (!this.activeTab_) {
    this.setTabActive_(tab);
  }

  tab.className = tab.className + ' ' + this.animationName_;

  this.redraw_();
};
InfoBubble.prototype['addTab'] = InfoBubble.prototype.addTab;

InfoBubble.prototype.updateTab = function(index, opt_label, opt_content) {
  if (!this.tabs_.length || index < 0 || index >= this.tabs_.length) {
    return;
  }

  var tab = this.tabs_[index];
  if (opt_label != undefined) {
    tab.tab.innerHTML = tab.label = opt_label;
  }

  if (opt_content != undefined) {
    tab.content = opt_content;
  }

  if (this.activeTab_ == tab.tab) {
    this.setContent(tab.content);
    this.updateContent_();
  }
  this.redraw_();
};
InfoBubble.prototype['updateTab'] = InfoBubble.prototype.updateTab;

InfoBubble.prototype.removeTab = function(index) {
  if (!this.tabs_.length || index < 0 || index >= this.tabs_.length) {
    return;
  }

  var tab = this.tabs_[index];
  tab.tab.parentNode.removeChild(tab.tab);

  google.maps.event.removeListener(tab.tab.listener_);

  this.tabs_.splice(index, 1);

  delete tab;

  for (var i = 0, t; t = this.tabs_[i]; i++) {
    t.tab.index = i;
  }

  if (tab.tab == this.activeTab_) {

    if (this.tabs_[index]) {

      this.activeTab_ = this.tabs_[index].tab;
    } else if (this.tabs_[index - 1]) {

      this.activeTab_ = this.tabs_[index - 1].tab;
    } else {

      this.activeTab_ = undefined;
    }

    this.setTabActive_(this.activeTab_);
  }

  this.redraw_();
};
InfoBubble.prototype['removeTab'] = InfoBubble.prototype.removeTab;

InfoBubble.prototype.getElementSize_ = function(element, opt_maxWidth,
                                                opt_maxHeight) {
  var sizer = document.createElement('DIV');
  sizer.style['display'] = 'inline';
  sizer.style['position'] = 'absolute';
  sizer.style['visibility'] = 'hidden';

  if (typeof element == 'string') {
    sizer.innerHTML = element;
  } else {
    sizer.appendChild(element.cloneNode(true));
  }

  document.body.appendChild(sizer);
  var size = new google.maps.Size(sizer.offsetWidth, sizer.offsetHeight);

  if (opt_maxWidth && size.width > opt_maxWidth) {
    sizer.style['width'] = this.px(opt_maxWidth);
    size = new google.maps.Size(sizer.offsetWidth, sizer.offsetHeight);
  }

  if (opt_maxHeight && size.height > opt_maxHeight) {
    sizer.style['height'] = this.px(opt_maxHeight);
    size = new google.maps.Size(sizer.offsetWidth, sizer.offsetHeight);
  }

  document.body.removeChild(sizer);
  delete sizer;
  return size;
};

InfoBubble.prototype.redraw_ = function() {
  this.figureOutSize_();
  this.positionCloseButton_();
  this.draw();
};

InfoBubble.prototype.figureOutSize_ = function() {
  var map = this.get('map');

  if (!map) {
    return;
  }

  var padding = this.getPadding_();
  var borderWidth = this.getBorderWidth_();
  var borderRadius = this.getBorderRadius_();
  var arrowSize = this.getArrowSize_();

  var mapDiv = map.getDiv();
  var gutter = arrowSize * 2;
  var mapWidth = mapDiv.offsetWidth - gutter;
  var mapHeight = mapDiv.offsetHeight - gutter - this.getAnchorHeight_();
  var tabHeight = 0;
  var width = /** @type {number} */ (this.get('minWidth') || 0);
  var height = /** @type {number} */ (this.get('minHeight') || 0);
  var maxWidth = /** @type {number} */ (this.get('maxWidth') || 0);
  var maxHeight = /** @type {number} */ (this.get('maxHeight') || 0);

  maxWidth = Math.min(mapWidth, maxWidth);
  maxHeight = Math.min(mapHeight, maxHeight);

  var tabWidth = 0;
  if (this.tabs_.length) {

    for (var i = 0, tab; tab = this.tabs_[i]; i++) {
      var tabSize = this.getElementSize_(tab.tab, maxWidth, maxHeight);
      var contentSize = this.getElementSize_(tab.content, maxWidth, maxHeight);

      if (width < tabSize.width) {
        width = tabSize.width;
      }

      tabWidth += tabSize.width;

      if (height < tabSize.height) {
        height = tabSize.height;
      }

      if (tabSize.height > tabHeight) {
        tabHeight = tabSize.height;
      }

      if (width < contentSize.width) {
        width = contentSize.width;
      }

      if (height < contentSize.height) {
        height = contentSize.height;
      }
    }
  } else {
    var content = (this.get('content'));
    if (typeof content == 'string') {
      content = this.htmlToDocumentFragment_(content);
    }
    if (content) {
      var contentSize = this.getElementSize_(content, maxWidth, maxHeight);

      if (width < contentSize.width) {
        width = contentSize.width;
      }

      if (height < contentSize.height) {
        height = contentSize.height;
      }
    }
  }

  if (maxWidth) {
    width = Math.min(width, maxWidth);
  }

  if (maxHeight) {
    height = Math.min(height, maxHeight);
  }

  width = Math.max(width, tabWidth);

  if (width == tabWidth) {
    width = width + 2 * padding;
  }

  arrowSize = arrowSize * 2;
  width = Math.max(width, arrowSize);


  if (width > mapWidth) {
    width = mapWidth;
  }

  if (height > mapHeight) {
    height = mapHeight - tabHeight;
  }

  if (this.tabsContainer_) {
    this.tabHeight_ = tabHeight;
    this.tabsContainer_.style['width'] = this.px(tabWidth);
  }

  this.contentContainer_.style['width'] = this.px(width);
  this.contentContainer_.style['height'] = this.px(height);
};

InfoBubble.prototype.getAnchorHeight_ = function() {
  var anchor = this.get('anchor');
  if (anchor) {
    var anchorPoint = (this.get('anchorPoint'));

    if (anchorPoint) {
      return -1 * anchorPoint.y;
    }
  }
  return 0;
};

InfoBubble.prototype.anchorPoint_changed = function() {
  this.draw();
};
InfoBubble.prototype['anchorPoint_changed'] = InfoBubble.prototype.anchorPoint_changed;

InfoBubble.prototype.positionCloseButton_ = function() {
  var br = this.getBorderRadius_();
  var bw = this.getBorderWidth_();

  var right = 2;
  var top = 2;

  if (this.tabs_.length && this.tabHeight_) {
    top += this.tabHeight_;
  }

  top += bw;
  right += bw;

  var c = this.contentContainer_;
  if (c && c.clientHeight < c.scrollHeight) {

    right += 15;
  }

  this.close_.style['right'] = this.px(right);
  this.close_.style['top'] = this.px(top);
};
