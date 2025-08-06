import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import type { MapData } from '../types';
import L from 'leaflet';

// Fix for default icon issue with webpack/bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


interface MapComponentProps {
  mapData: MapData;
}

const MapViewUpdater: React.FC<MapComponentProps> = ({ mapData }) => {
    const map = useMap();

    useEffect(() => {
        if (mapData.view) {
            map.setView([mapData.view.lat, mapData.view.lng], mapData.view.zoom);
        } else {
            const allPoints = [
                ...mapData.locations.map(loc => [loc.lat, loc.lng]),
                ...mapData.paths.flat().map(p => [p.lat, p.lng])
            ];
            
            if (allPoints.length > 0) {
                const bounds = L.latLngBounds(allPoints as L.LatLngExpression[]);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [mapData, map]);
    
    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ mapData }) => {
  const { locations, paths, view } = mapData;
  // Default view centered on India
  const initialCenter: [number, number] = view ? [view.lat, view.lng] : (locations.length > 0 ? [locations[0].lat, locations[0].lng] : [21.1458, 79.0882]);
  const initialZoom = view ? view.zoom : (locations.length > 0 ? 13 : 5);

  return (
    <MapContainer center={initialCenter} zoom={initialZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapViewUpdater mapData={mapData} />
      {locations.map((location, idx) => (
        <Marker key={`marker-${idx}`} position={[location.lat, location.lng]}>
          <Popup>
            {location.label}
          </Popup>
        </Marker>
      ))}
      {paths.map((path, idx) => {
        const positions = path.map(p => [p.lat, p.lng] as [number, number]);
        return <Polyline key={`path-${idx}`} positions={positions} color="#0891b2" />;
      })}
    </MapContainer>
  );
};

export default MapComponent;