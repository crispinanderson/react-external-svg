# react-external-svg
A simple tool to load external SVG files and convert to react elements and attach props, styles and methods

###Usage
```
npm install react-external-svg
```

```Javascript
import { ExternalSVG } from 'react-external-svg';

export cont MySvg = () => {
  const applyStyles={
    'svg>g>path': {
      fill: '#bada33'
      }
  }
  
  const applyProps={
    Layer_2_1_: {
      width: '100%',
      height: '100%'
      }
  }
  
  return <ExternalSVG applyStyles applyProps />
}

```
