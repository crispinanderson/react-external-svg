
import utils from './utils';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { parse } from 'svg-parser';
import axios from 'axios';


export default class {
    constructor() {
        this.uuid = uuid();
        this.defaults = {
            styles: {},
            props: {}
        }
    }


    _parseSVG(svg) {
        const parsedSVG = parse(svg);
        if (parsedSVG.children.length !== 1) throw 'Only an svg with a single top level <svg>...</svg> wrapper is valid';
        if (parsedSVG.children[0].tagName !== 'svg') throw 'Passed svg string does not include an <svg> tag as the parent wrapper';
        return parsedSVG.children[0]
    }

    _conformSVG(parsedSVG) {
        const conformedSVG = { ...parsedSVG }
        conformedSVG.properties = utils.sanitizeAttributes(conformedSVG.properties);
        utils.noUnSupportedTagNames(conformedSVG.children)

        conformedSVG.children = conformedSVG.children
            ? conformedSVG.children
                .map(
                    (child) => {
                        return {
                            ...child,
                            properties: utils.sanitizeAttributes(child.properties),
                            children: child.children.length
                                ? this._conformSVG(child.children)
                                : conformedSVG.children
                        }
                    }) : conformedSVG.children;

        return conformedSVG;
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

    _fetchSVG(src) {
        return axios.get(src)
            .then((response) => {
                if (response.status !== 200 || !response.data) {
                    throw `Could not fetch file, server responded with ${response.status}: ${response.Text}`
                }
                if (response.data.includes('<svg')) {
                    return response.data;
                }
            })
            .catch((err) => {
                throw `Could not fetch file, server responded error ${err}`
            })
    }


    convert(svg, opts) {

        const options = { ...this.defaults, ...opts };


        const parsedSVG = this._parseSVG(svg);
        const conformedSVG = this._conformSVG(parsedSVG);
        const elements = this._createReactElements(conformedSVG, options);

        return elements;


    }

    fetchAndConvert(src, opts) {

        return this._fetchSVG(src).then((svg) => {
            return this.convert(svg, opts);
        })

    }
}




