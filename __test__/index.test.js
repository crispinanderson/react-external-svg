
import React from "react";
import { render, waitFor } from '@testing-library/react'
import ExternalSVG from '../index';

const validSVG = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 208 105.7" style="enable-background:new 0 0 208 105.7;" xml:space="preserve">
    <polyline  points="59,26.3 59,2 84.3,2 "/>
    <polyline points="83.3,79.3 59,79.3 59,46.7 "/>
    <polyline points="136.3,45.4 136.3,79.3 111.7,79.3 "/>
    <polyline points="112,2 136.3,2 136.3,25.3 "/>
</svg>`

it('renders svg from string', async () => {
    const { container } = render(<ExternalSVG src={validSVG} />);
    await waitFor(() => {
        expect(container.querySelector('svg').id).toBe('Layer_1');
        expect(container.getElementsByTagName('polyline').length).toBe(4);
    })

});

it('renders svg from url', async () => {
    const { container } = render(<ExternalSVG src={'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'} />);
    await waitFor(() => {
        expect(container.getElementsByTagName('g').length).toBe(1);
        expect(container.getElementsByTagName('path').length).toBe(1)
        expect(container.getElementsByTagName('polygon').length).toBe(2);
        expect(container.getElementsByTagName('circle').length).toBe(1);
    })

});