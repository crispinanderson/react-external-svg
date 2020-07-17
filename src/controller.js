
import utils from './utils';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { parse } from 'svg-parser';


export default class {
    constructor() {
        this.uuid = uuid();
        this.defaults = {
            styles: {},
            props: {}
        }
    }


    _parseSVG(svg) {
        return parse(svg).children[0]
    }

    _conformSVG(parsedSVG) {

        parsedSVG.properties = utils.sanitizeAttributes(parsedSVG.properties);
        parsedSVG.children = utils.sanitizeChildren(parsedSVG.children);
        parsedSVG.children = parsedSVG.children
            ? parsedSVG.children
                .map(
                    (child) => {
                        return {
                            ...child,
                            properties: utils.sanitizeAttributes(child.properties),
                            children: child.children.length
                                ? this._conformSVG(child.children)
                                : parsedSVG.children
                        }
                    }) : parsedSVG.children;

        return parsedSVG;
    }

    _convertToReactElem(elem, options, layers = [], keyID = 0) {

        const { props, styles } = options;

        //layerDepth is evealuated to layerString > seperated identifier ie. svg>g>path -- currently will apply to all children at same layer with same tagName
        const layerDepth = [...layers, elem.tagName];
        const layerString = layerDepth.join('>');

        return React.createElement(elem.tagName, {
            //create a unique key, class enables this be the same with each react redraw, thus prevents complete redraw of elements
            key: this.uuid + '_' + keyID,
            ...elem.properties,
            //Merge passed properties and styles, either by id or layerString
            ...props[elem.properties.id] || props[layerString] ? props[elem.properties.id] || props[layerString] : {},
            style: styles[elem.properties.id] || styles[layerString] ? styles[elem.properties.id] || styles[layerString] : {},
            //Recursive map for all nested children
            children: elem.children.length
                ? elem.children.map(function (c, i) {
                    return this._convertToReactElem(c, options, layerDepth, keyID + i)
                }.bind(this))
                : elem.children
        })
    }

    _createReactElements(parsedSVG, options) {
        return this._convertToReactElem(parsedSVG, options);
    }

    async fetchSVG(url) {
        fetch(src)
            .then((response) => {
                if (response.status !== 200) {
                    throw `Could not fetch file, server responded with ${response.status}: ${response.Text}`
                }
                return response.body;
            })
            .catch((err) => {
                throw `Could not fetch file, server responded error ${err}`
            })
    }


    async convertSVG(svg, opts) {

        const options = { ...this.defaults, ...opts };

        const parsedSVG = this._parseSVG(svg);
        const conformedSVG = this._conformSVG(parsedSVG);
        return this._createReactElements(conformedSVG, options);

    }
}




