# react-external-svg
A simple tool to load external SVG files and convert to react elements and attach props, styles and methods.

##### Use if:

* No access to the svg at build time.
* Need to dynamically accept an svg.
* Need to be able to apply static or dynamic properties and styling to the loaded svg.


##### Example use case: 

* Users upload an svg logo
* Logo can be customised within your online logo editor react app
* The updated logo can then be downloaded by the user


This tool was created for a very specific use case and has an unnessecary overhead if you can build the SVG directly into your codebase, in which case i would recomend manually converting your svg to jsx or importing as a module with CRA or converting with something like <a href='https://react-svgr.com/' > SVGR </a> 

### Usage
```
npm install react-external-svg
```

#### Basic usage
```Javascript
import { ExternalSVG } from 'react-external-svg';

export cont MySvg = () => {

  return <ExternalSVG 
    src="https://my-server.com/someimage.svg"
    applyStyles={{
      Layer1: {
        width: "100%",
        height: "100%"
        }
    }} 
    applyProps={{
      myPath: {
        fill: "#bada33"
        }
    }} 
  />
}

```
#### Applying props and styles

###### Example:

```Javascript
// Example SVG passed to ExternalSVG src
<svg id="Layer_1" x="0px" y="0px" viewBox="0 0 208 105.7" >
    <g id="lines_group">
        <polyline id="polyline1" points="59,26.3 59,2 84.3,2 "/>
        <polyline points="83.3,79.3 59,79.3 59,46.7 "/>
        <polyline points="136.3,45.4 136.3,79.3 111.7,79.3 "/>
        <polyline points="112,2 136.3,2 136.3,25.3 "/>
    </g>
</svg>

```

##### In this example I can pass a width and height property to the 'Layer_1' element by passing:

```Javascript
applyProps={{
  Layer_1:{
    width: '100%',
    height: '100%'
  }
}}
```
##### Now if i wanted to apply some props to all the polyline elements within the 'lines_group' element, i could do so by referencing these by their tag identifier - eg.

```Javascript
  applyProps={{
    'Layer_1>lines_group>polyline':{
      fill: 'bada33'
    }
  }}
  ```

##### I can also mix and match thse identifiers as I like, rembering to use > to delinate each identifier - eg.

```Javascript
applyProps={{
  'Layer_1>g>polyline':{
    fill: 'bada33'
  }
}}

// or

applyProps={{
  'svg>lines_group>polyline':{
    fill: 'bada33'
  }
}}
```

##### Aside from element id or tagName we can also reference our element by the child(number) identifier for more targeted identification. eg.

```Javascript
//Apply the style only to the second polyline element
applyProps={{
  'svg>g>child1':{
    fill: 'bada33'
  }
}}

// or

applyProps={{
  'child0>child0>child1':{
    fill: 'bada33'
  }
}}

```

 ##### All examples also apply to applyStyles !

---
#### Props
##### <p><b>src: (string) - </b> Accepts either an svg string or url</P>   
##### <p><b>applyProps: (object) - </b> Accepts an object of keys (element identifier): value: (object) props to apply </P> 
##### <p><b>applyStyles: (object) - </b> Accepts an object of keys (element identifier): value: (object) style to apply </P> 
---

###### This tool is losely based on https://github.com/janjakubnanista/svg-to-jsx please check that out if need a simple tool that takes in SVG and spits out JSX 

