
import utils from './utils';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { parse } from 'svg-parser';
import axios from 'axios';


export default class {
    constructor() {
        this.uuid = uuid();
        this.defaults = {
            applyStyles: {},
            applyProps: {}
        }
    }


    _parseSVG(svg) {
        const parsedSVG = parse(svg);
        if (parsedSVG.children[0].tagName !== 'svg') throw 'Passed svg string does not include an <svg> tag as the parent wrapper';
        return parsedSVG.children[0]
    }

    _conformSVG(parsedSVG) {
        const conformedSVG = { ...parsedSVG }
        conformedSVG.properties = utils.sanitizeAttributes(conformedSVG.properties);
        utils.noUnSupportedTagNames(conformedSVG.children)

        conformedSVG.children = Array.isArray(conformedSVG.children)
            ? conformedSVG.children.map((child) => this._conformSVG(child))
            : conformedSVG.children;

        return conformedSVG;
    }

    _convertToReactElem(elem, options, relativePath = [], childID = 0) {

        const thisPath = [...relativePath, [elem.tagName, 'child' + childID]];
        const applyOptions = this._applyOptions

        const convertChildren = () => {

            if (Array.isArray(elem.children)) {
                return elem.children.map(function (child, i) {
                    return this._convertToReactElem(child, options, thisPath, i)
                }.bind(this))
            }

            return null;
        }

        const elements = React.createElement(elem.tagName, {
            //create a unique key, class enables this be the same with each react redraw, thus prevents complete redraw of elements
            key: this.uuid + '_' + childID,
            ...elem.properties,
            ...applyOptions(elem.properties.id, thisPath, options.applyProps),
            style: elem.properties.style ? { ...elem.properties.style, ...applyOptions(elem.properties.id, thisPath, options.applyStyles) } : applyOptions(elem.properties.id, thisPath, options.applyStyles),
            //Recursive map for all nested children
            children: convertChildren()
        })

        return elements;
    }

    _applyOptions(id, pathIdentifier, options) {
        let returnObj = {};

        for (let key in options) {
            let applyProp = true;
            if (key.includes('>')) {
                const pathToElem = key.split('>');
                if (pathToElem.length === pathIdentifier.length) {
                    for (let i = 0; i < pathToElem.length; i++) {
                        let pathID = pathToElem[i];
                        if (!pathIdentifier[i].includes(pathID)) {
                            applyProp = false;
                            break;
                        }
                    }
                }
                else {
                    applyProp = false;
                }


            }
            else if (id !== key) {
                applyProp = false;
            }

            if (applyProp) returnObj = { ...returnObj, ...options[key] };
        }
        return returnObj;
    }

    _createReactElements(parsedSVG, options) {
        return this._convertToReactElem(parsedSVG, options);
    }

    fetchSVG(src) {
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


    convert(svg, opts = {}) {

        const options = { applyProps: opts.applyProps || {}, applyStyles: opts.applyStyles || {} };
        const parsedSVG = this._parseSVG(svg);
        const conformedSVG = this._conformSVG(parsedSVG);
        const elements = this._createReactElements(conformedSVG, options);

        return elements;
    }

}




