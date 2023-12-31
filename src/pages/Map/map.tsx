import axios from 'axios';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';

type MapProps = {
    address?: string,
    id?: string
}
const Map: React.FC<MapProps> = ({ address, id }) => {
    const [map, setMap] = useState<L.Map | null>(null);

    useEffect(() => {
        // Tạo bản đồ
        const mapId = id ? id : 'map';
        const leafletMap = L.map(mapId).setView([0, 0] as LatLngExpression, 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(leafletMap);

        setMap(leafletMap);
    }, []);

    const geocodeAddress = (address: string) => {
        axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: address,
                format: 'json',
                limit: 1
            }
        }).then((response) => {
            const result = response.data[0];
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);

            // Hiển thị kết quả trên bản đồ
            if (map) {
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`<b>${address}</b><br>Latitude: ${lat}<br>Longitude: ${lon}`)
                    .openPopup();

                map.setView([lat, lon], 15); // Đặt tọa độ mới và mức zoom
            }
        })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (map) {
            // Gọi hàm geocode với địa chỉ cần tìm
            geocodeAddress(address ? address : 'FPT University HCMC, Đường D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam');
        }
    }, [map]);

    return <div id={id ? id : 'map'} style={{ height: '300px', width: '300px' }}></div>;
};

export default Map;
