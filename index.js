import React, { useEffect, useState } from 'react';
import Controller from './src/controller';
const controller = new Controller();

export const ExternalSVG = (props) => {

    const { applyStyles, applyProps, src, onError } = props;
    const [render, setRender] = useState(null);

    useEffect(() => {
        if (src.includes('/') && src.includes('.svg')) {
            try {
                controller.fetchAndConvert(src, { applyProps, applyStyles }).then((converted) => setRender(converted))
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
            try {
                const converted = controller.convert(src, { applyProps, applyStyles });
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

    }, [src]);

    return (<>{render}</>)
}

export default ExternalSVG;