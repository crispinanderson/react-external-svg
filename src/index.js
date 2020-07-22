import React, { useEffect, useState, useRef } from 'react';
import Controller from './controller';
const controller = new Controller();

export const ExternalSVG = (props) => {

    const { applyStyles, applyProps, src, onError } = props;

    const [svg, setSVG] = useState(null);
    const [render, setRender] = useState(null);

    //Fetch and set the svg
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

    //Object equality check prev & current props
    const prevApplyProps = useRef(applyProps);
    const prevApplyStyles = useRef(applyStyles);
    const shouldRedraw = JSON.stringify(prevApplyProps.current) !== JSON.stringify(applyProps) || JSON.stringify(prevApplyStyles.current) !== JSON.stringify(applyStyles);

    useEffect(() => {
        prevApplyProps.current = applyProps;
        prevApplyStyles.current = applyStyles;
    }, [applyProps, applyStyles])

    //Create render
    useEffect(() => {

        if (svg && svg.length && svg.includes('<svg') || shouldRedraw) {
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
    }, [svg, applyProps, applyStyles]);



    return (<>{render}</>)
}

export default ExternalSVG;