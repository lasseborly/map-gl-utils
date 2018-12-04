module.exports = function addTo(map) {
}
const kebabCase = require('kebab-case');
const allProps = require('./keys.json');

function isPaintProp(prop) {
    return allProps.paints.indexOf(prop) >= 0;
}

const Utils = function(map, directlyIntegrate = false) {
    Object.assign(this, {
        hoverPointer(layers) {
            if (typeof layers === 'string') {
                layers = [layers];
            }
            map.on('mousemove',e => {
                const f = map.queryRenderedFeatures(e.point, {
                    layers: layers
                });
                map.getCanvas().style.cursor = f.length ? 'pointer' : '';
            }); 
        }, addLine(source, options) {
            const id = options.id || `${source}-line`;
            map.addLayer({
                id,
                type: 'line',
                source,
                ...options
            });
            return id;
        }, setProperty(layer, prop, value) {
            if (typeof prop === 'object') {
                Object.keys(prop).forEach(k => this.setProperty(layer, k, prop[k]));
            } else {
                const kprop = kebabCase(prop);
                const fn = isPaintProp(kprop) ? 'setPaintProperty' : 'setLayoutProperty';
                map[fn](layer, kprop , value);
            }
        }
    });
    
    map.U = this;
    if (directlyIntegrate) {
        Object.assign(map, this);
    }
}

module.exports = Utils;
