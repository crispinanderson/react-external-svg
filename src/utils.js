const ALLOWED_SVG_ATTRIBUTES = `accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan`.split(/([\s\n\r])/);

const ALLOWED_HTML_ATTRIBUTES = `accept acceptCharset accessKey action allowFullScreen allowTransparency alt
async autoComplete autoFocus autoPlay capture cellPadding cellSpacing charSet
challenge checked classID className cols colSpan content contentEditable contextMenu
controls coords crossOrigin data dateTime defer dir disabled download draggable
encType form formAction formEncType formMethod formNoValidate formTarget frameBorder
headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode
keyParams keyType label lang list loop low manifest marginHeight marginWidth max
maxLength media mediaGroup method min minLength multiple muted name noValidate open
optimum pattern placeholder poster preload radioGroup readOnly rel required role
rows rowSpan sandbox scope scoped scrolling seamless selected shape size sizes
span spellCheck src srcDoc srcSet start step style summary tabIndex target title
type useMap value width wmode wrap`.split(/([\s\n\r])/);

const ALLOWED_ATTRIBUTES = [...ALLOWED_HTML_ATTRIBUTES, ...ALLOWED_SVG_ATTRIBUTES];

const ALLOWED_TAGS = `circle clipPath defs ellipse g line linearGradient mask path pattern polygon polyline
radialGradient rect stop svg text tspan use`.split(/([\s\n\r])/);

const DATA_ATTRIBUTE = /^data-/i;

const camelCase = function (string) {
    return string.replace(/(?:-|_)([a-z])/g, function (g) { return g[1].toUpperCase(); });
};

const processAttributeName = function (name) {
    return utils.DATA_ATTRIBUTE.test(name) ? name : utils.camelCase(name);
};

const unnamespaceAttributeName = function (name) {
    return name.replace(/(\w+):(\w)/i, function (match, namespace, char) {
        return namespace + char.toUpperCase();
    });
};

const sanitizeAttributes = function (attributes) {
    if (!attributes) return null;

    if (attributes.class) {
        attributes.className = attributes.class;
        delete attributes.class;
    }

    const allowed = utils.ALLOWED_ATTRIBUTES.reduce(function (hash, name) {
        if (name in attributes) {
            var unnamespacedName = utils.unnamespaceAttributeName(name);
            hash[unnamespacedName] = unnamespacedName !== 'style' ? attributes[name] : styleAttribute(attributes[name]);
        }

        return hash;
    }, {});

    const custom = Object.keys(attributes)
        .filter(function (name) {
            return utils.DATA_ATTRIBUTE.test(name);
        })
        .reduce(function (data, name) {
            data[name] = attributes[name];
            return data;
        }, {});

    return { ...allowed, ...custom };
};

const noUnSupportedTagNames = function (children) {
    if (!children) return null;

    for (let child of children) {
        if (utils.ALLOWED_TAGS.indexOf(child.tagName) === -1) {
            throw 'Unsupported tags - cannot process element of type: ' + child.tagName;
        }
        if (child.children.length) {
            return noUnSupportedTagNames(child.children);
        }
    }
    return true;
};

const styleAttribute = function (string) {
    var object = string.split(/\s*;\s*/g).reduce(function (hash, keyValue) {
        var split = keyValue.split(/\s*:\s*/);
        var key = utils.camelCase((split[0] || '').trim());
        var value = (split[1] || '').trim();

        hash[key] = value;

        return hash;
    }, {});

    return JSON.stringify(object);
};

const getElementById = function (svgObject, refId) {
    if (svgObject.id === refId) {
        return svgObject
    }
    else {
        return svgObject.children.forEach((child) => utils.getElementById(child))
    }
};

export var utils = {
    ALLOWED_ATTRIBUTES,
    ALLOWED_TAGS,
    DATA_ATTRIBUTE,
    camelCase,
    processAttributeName,
    unnamespaceAttributeName,
    sanitizeAttributes,
    noUnSupportedTagNames,
    styleAttribute,
    getElementById
}

export default utils;