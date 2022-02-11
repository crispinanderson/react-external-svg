
import React from "react";
import { render, waitFor } from '@testing-library/react'
import ExternalSVG from '../src/index';


const validSVG = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 208 105.7" style="enable-background:new 0 0 208 105.7;" xml:space="preserve">
    <g>
        <polyline  points="59,26.3 59,2 84.3,2 "/>
        <polyline points="83.3,79.3 59,79.3 59,46.7 "/>
        <polyline points="136.3,45.4 136.3,79.3 111.7,79.3 "/>
        <polyline points="112,2 136.3,2 136.3,25.3 "/>
    </g>
</svg>`




it('renders svg from string', async () => {
    const { container } = render(<ExternalSVG src={validSVG} />);
    await waitFor(() => {
        expect(container.querySelector('svg').id).toBe('Layer_1');
        expect(container.getElementsByTagName('g').length).toBe(1);
        expect(container.getElementsByTagName('polyline').length).toBe(4);
    })

});

it('renders svg from url', async () => {
    const { container } = render(<ExternalSVG src={'https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg'} />);
    await waitFor(() => {
        expect(container.getElementsByTagName('path').length).toBe(2)
        expect(container.getElementsByTagName('circle').length).toBe(3);
    })

});

it('applies the applyProps to an element using element id', async () => {
    const { container } = render(<ExternalSVG src={validSVG} applyProps={{ Layer_1: { width: '100%' } }} />);
    await waitFor(() => {
        expect(container.querySelector('svg').getAttribute('width')).toBe('100%');
    })

});

it('applies the applyProps to an element using > deliniated tags', async () => {
    const { container } = render(<ExternalSVG src={validSVG} applyProps={{ 'svg>g': { width: '100%' } }} />);
    await waitFor(() => {
        expect(container.querySelector('g').getAttribute('width')).toBe('100%');
    })
});

it('applies the applyProps to an element using > deliniated tags and child specifier', async () => {
    const { container } = render(<ExternalSVG src={validSVG} applyProps={{ 'svg>child0': { width: '100%' } }} />);
    await waitFor(() => {
        expect(container.querySelector('g').getAttribute('width')).toBe('100%');
    })
});

it('applies the applyProps to a specific child element using > deliniated tags and child:number', async () => {
    const { container } = render(<ExternalSVG src={validSVG} applyProps={{ 'svg>child0>child2': { fill: "rgb(186, 218, 51)" } }} />);
    await waitFor(() => {
        expect(container.getElementsByTagName('polyline')[2].getAttribute('fill')).toBe("rgb(186, 218, 51)");
    })
});

it('applies the applyStyles to an element using element id', async () => {
    const { container } = render(<ExternalSVG src={validSVG} applyStyles={{ Layer_1: { backgroundColor: "rgb(186, 218, 51)" } }} />);
    await waitFor(() => {
        expect(container.querySelector('svg').style.backgroundColor).toBe("rgb(186, 218, 51)");
    })

});

it('applies the applyStyles to main svg using child0> reference', async () => {
    const { container } = render(<ExternalSVG src={validSVG} applyStyles={{ 'child0>': { backgroundColor: "rgb(186, 218, 51)" } }} />);
    await waitFor(() => {
        expect(container.querySelector('svg').style.backgroundColor).toBe("rgb(186, 218, 51)");
    })

});

it('applies the applyStyles to main svg using svg> tag reference', async () => {
    const { container } = render(<ExternalSVG src={validSVG} applyStyles={{ 'svg>': { backgroundColor: "rgb(186, 218, 51)" } }} />);
    await waitFor(() => {
        expect(container.querySelector('svg').style.backgroundColor).toBe("rgb(186, 218, 51)");
    })

});
