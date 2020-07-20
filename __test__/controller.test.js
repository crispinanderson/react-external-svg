import { isValidElement } from 'react';
import Controller from '../src/controller';
const controller = new Controller();

const validSVG = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 208 105.7" style="enable-background:new 0 0 208 105.7;" xml:space="preserve">
    <polyline  points="59,26.3 59,2 84.3,2 "/>
    <polyline points="83.3,79.3 59,79.3 59,46.7 "/>
    <polyline points="136.3,45.4 136.3,79.3 111.7,79.3 "/>
    <polyline points="112,2 136.3,2 136.3,25.3 "/>
</svg>`

const failMultipleTopLevelSvg = `<svg><rect x=0 y=0 width=100 height=100></svg>
<svg><rect x=0 y=0 width=100 height=100></svg>`

const failNoSVGWrapper = `<g>
<polyline  points="59,26.3 59,2 84.3,2 "/>
    <polyline points="83.3,79.3 59,79.3 59,46.7 "/>
    <polyline points="136.3,45.4 136.3,79.3 111.7,79.3 "/>
    <polyline points="112,2 136.3,2 136.3,25.3 "/>
</g>`

const failUnsupportedTags = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<defs>
  <!-- arrowhead marker definition -->
  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
      markerWidth="6" markerHeight="6"
      orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" />
  </marker>

  <!-- simple dot marker definition -->
  <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5"
      markerWidth="5" markerHeight="5">
    <circle cx="5" cy="5" r="5" fill="red" />
  </marker>
</defs>`


describe('convert - ', () => {

    test('it throws an error when passed svg text does not include <svg> tag', () => {
        expect(() => controller.convert(failNoSVGWrapper)).toThrow()
    })

    test('it throws an error when passed svg text with multiple top level items', () => {
        expect(() => controller.convert(failMultipleTopLevelSvg)).toThrow()
    })

    test('it throws an error as svg contains unsupported tags', () => {
        expect(() => controller.convert(failUnsupportedTags)).toThrow('Unsupported tags - cannot process element of type: marker')
    })

    test('returns a valid react element ', () => {
        expect(isValidElement(controller.convert(validSVG))).toBe(true);
    })
})

describe('fetchAndConvert - ', () => {

    test('throws an error when the requested file cannot be found', async () => {

        await controller.fetchAndConvert('https://upload.wikimedia.org/no-file-here.svg')
            .catch(err => expect(err).toBe('Could not fetch file, server responded error Error: Request failed with status code 404'));
    })

    test('returns a valid react element', async () => {
        await controller.fetchAndConvert('https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg')
            .then(element => expect(isValidElement(element)).toBe(true));
    })
})