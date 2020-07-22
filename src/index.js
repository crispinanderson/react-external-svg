import React, { useEffect, useState } from 'react';
import Controller from './controller';
const controller = new Controller();

export const ExternalSVG = (props) => {

    const { applyStyles, applyProps, src, onError } = props;
    const [svg, setSVG] = useState(null);
    const [render, setRender] = useState(null);


    useEffect(() => {

        if (src.includes('/') && src.includes('.svg')) {
            try {
                controller.fetchSVG(src).then((data) => setSVG(data))
            }
            catch (err) {
                if (onError) {
                    onError(err)
                }
                else {
                    console.error(err)
                }
            }
        }

        if (src.includes('<svg')) {
            setSVG(src)
        }

    }, [src]);

    useEffect(() => {
        if (svg && svg.includes('<svg')) {
            try {
                const converted = controller.convert(svg, { applyProps, applyStyles });
                setRender(converted)
            }
            catch (err) {
                if (onError) {
                    onError(err)
                }
                else {
                    console.error(err)
                }
            }
        }
    }, [svg, applyProps, applyStyles])

    return (<>{render}</>)
}

export default ExternalSVG;