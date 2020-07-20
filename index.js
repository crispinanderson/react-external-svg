import React, { useEffect, useState } from 'react';
import Controller from './src/controller';
const controller = new Controller();

export const ExternalSVG = (props) => {

    const [render, setRender] = useState(null);

    useEffect(() => {
        if (props.src.includes('/') && props.src.includes('.svg')) {
            try {
                controller.fetchAndConvert(props.src, props).then((converted) => setRender(converted))
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

        if (props.src.includes('<svg')) {
            try {
                const converted = controller.convert(props.src, props);
                setRender(converted)
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

    return (<>{render}</>)
}

export default ExternalSVG;