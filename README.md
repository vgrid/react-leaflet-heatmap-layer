# @vgrid/react-leaflet-heatmap-layer

`react-leaflet-heatmap-layer` provides a simple `<HeatmapLayer />` component for creating a heatmap layer in a `react-leaflet` map.

![A screenshot of a heatmap on a leaflet map](../master/screenshot.jpg?raw=true)

## Usage

This fork changes the behaviour to export a factory function, so that the types can be turned into a generic

Use directly as a fixed layer:

```typescript
import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import HeatmapLayerFactory from '../src/HeatmapLayer';
import { addressPoints } from './realworld.10000.js';

const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>()

class MapExample extends React.Component {

  render() {
    return (
      <div>
        <Map center={[0,0]} zoom={13}>
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={addressPoints}
            longitudeExtractor={m => m[1]}
            latitudeExtractor={m => m[0]}
            intensityExtractor={m => parseFloat(m[2])} />
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </Map>
      </div>
    );
  }

}

render(<MapExample />, document.getElementById('app'));
```

Or use it inside a layer control to toggle it:

```typescript
import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import HeatmapLayerFactory from '../src/HeatmapLayer';
import { addressPoints } from './realworld.10000.js';

const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>()

class MapExample extends React.Component {

  render() {
    return (
      <div>
      <Map center={position} zoom={13} style={{ height: '100%' }} >
            <LayersControl>
              <LayersControl.BaseLayer name="Base" checked>
                <TileLayer
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=http://osm.org/copyright>OpenStreetMap</a> contributors"
                />
              </LayersControl.BaseLayer>
              <LayersControl.Overlay name="Heatmap" checked>
                <FeatureGroup color="purple">
                  <Marker position={[50.05, -0.09]} >
                    <Popup>
                      <span>A pretty CSS3 popup.<br /> Easily customizable. </span>
                    </Popup>
                  </Marker>
                  <HeatmapLayer
                    fitBoundsOnLoad
                    fitBoundsOnUpdate
                    points={addressPoints}
                    longitudeExtractor={m => m[1]}
                    latitudeExtractor={m => m[0]}
                    intensityExtractor={m => parseFloat(m[2])}
                  />
                </FeatureGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay name="Marker">
                <FeatureGroup color="purple">
                  <Marker position={position} >
                    <Popup>
                      <span>A pretty CSS3 popup.<br /> Easily customizable. </span>
                    </Popup>
                  </Marker>
                </FeatureGroup>
              </LayersControl.Overlay>
            </LayersControl>
          </Map>
      </div>
    );
  }
}

render(<MapExample />, document.getElementById('app'));
```


## API

The `HeatmapLayer` component takes the following props:

- `points`: *required* an array of objects to be processed
- `longitudeExtractor`: *required* a function that returns the object's longitude e.g. `marker => marker.lng`
- `latitudeExtractor`: *required* a function that returns the object's latitude e.g. `marker => marker.lat`
- `intensityExtractor`: *required* a function that returns the object's intensity e.g. `marker => marker.val`
- `fitBoundsOnLoad`: boolean indicating whether map should fit data in bounds of map on load
- `fitBoundsOnUpdate`: boolean indicating whether map should fit data in bounds of map on Update
- `max`: max intensity value for heatmap (default: 3.0)
- `radius`: radius for heatmap points (default: 30)
- `maxZoom`: maximum zoom for heatmap (default: 18)
- `opacity`: the opacity of the heatmap layer (default: 1)
- `minOpacity`: minimum opacity for heatmap (default: 0.01)
- `useLocalExtrema`: whether to always have a local minimum and maximum in the viewport (default: false)
- `blur`: blur for heatmap points (default: 15)
- `gradient`: object defining gradient stop points for heatmap e.g. `{ 0.4: 'blue', 0.8: 'orange', 1.0: 'red' }` (default: `simpleheat` package default gradient)
- `onStatsUpdate`: called on redraw with a { min, max } object containing:
  - The local minimum intensity in the viewport
  - The local maximum intensity in the viewport

## Contributing

See [CONTRIBUTING.md](https://www.github.com/OpenGov/react-leaflet-heatmap-layer/blob/master/CONTRIBUTING.md)

## Credits

This package was inspired by [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat).

## License

`react-leaflet-heatmap-layer` is MIT licensed.

See [LICENSE.md](https://www.github.com/OpenGov/react-leaflet-heatmap-layer/blob/master/LICENSE.md) for details.
