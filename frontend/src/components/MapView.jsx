import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MapView = ({ logs }) => {
    // Filter logs with valid coordinates
    const markers = logs
        .filter(log => log.latitude && log.longitude)
        .map(log => ({
            name: log.geo_city || 'Unknown',
            coordinates: [log.longitude, log.latitude], // react-simple-maps uses [lon, lat]
            isTor: log.is_tor_traffic
        }));

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-slate-50 dark:bg-gray-800 transition-colors duration-300">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 100,
                }}
                style={{ width: "100%", height: "100%" }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#EAEAEC"
                                stroke="#D6D6DA"
                                style={{
                                    default: { outline: "none", fill: "#EAEAEC", stroke: "#D6D6DA" },
                                    hover: { outline: "none", fill: "#F5F5F5", stroke: "#D6D6DA" },
                                    pressed: { outline: "none", fill: "#EAEAEC", stroke: "#D6D6DA" },
                                }}
                                className="dark:fill-gray-700 dark:stroke-gray-600 dark:hover:fill-gray-600"
                            />
                        ))
                    }
                </Geographies>
                {markers.map((marker, index) => (
                    <Marker key={index} coordinates={marker.coordinates}>
                        <circle r={4} fill="#EF4444" stroke="#fff" strokeWidth={1} />
                        <title>{marker.name} {marker.isTor ? '(Tor)' : ''}</title>
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    );
};

export default MapView;
