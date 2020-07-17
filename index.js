import React, { useEffect, useState } from 'react';
import Controller from './src/controller';
const controller = new Controller();

export const LoadSVG = (props) => {

    const [status, setStatus] = useState(null);
    const [svg, setSvg] = useState(null);
    const [render, setRender] = useState(null);

    useEffect(() => {
        if (props.src.includes('.svg')) {
            try {
                controller.fetchSVG(props.src).then((fetchedSVG) => setSvg(fetchedSVG))
            }
            catch (err) {
                if (props.onError) {
                    props.onError(err)
                }
                else {
                    console.error(err)
                }
            }

        }
    }, [props.src]);

    console.log(svg)

    return (<>{render}</>)
}

export default LoadSVG;