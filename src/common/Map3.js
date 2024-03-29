import React, { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader"

const containerStyle = {
  width: '600px',
  height: '500px'
};

export default function Map(props) {
  const [hospitals] = useState(
    ["Bệnh viện FV", "Bệnh viện Chợ Rẫy", "Bệnh viện Bình Thạnh"]);
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    console.log('map', map)
    const loader = new Loader({
      apiKey: "AIzaSyBTdA_CZDkBE3mEJKA7f_9BB9k092w390Q",
      libraries: ["places"],
      version: "weekly",
    });


    loader.load().then(() => {
      setMap(new window.google.maps.Map(mapRef.current, {
        center: { lat: 10.8005, lng: 106.6612 }, // 10.800598741780846, 106.66123584862284
        zoom: 12,
      }));
    });
  }, []);

  useEffect(() => {
    if (!map) return;

    // V Hospital
    // Place ID: ChIJJeoQtogvdTERC5kIIDyUWrc
    // 6 Nguyễn Lương Bằng, Tân Phú, Quận 7, Thành phố Hồ Chí Minh, 베트남
    // new window.google.maps.Marker({
    //   position: { lat: 10.7324, lng: 106.7180 }, // 10.732487518470277, 106.7180109986744
    //   map: map,
    // });

    // 208 Nguyễn Hữu Cảnh
    // Place ID: ChIJt85Z4agodTERZuaQW5_D0jo
    // 208 Nguyễn Hữu Cảnh, Vinhomes Tân Cảng, Bình Thạnh, Thành phố Hồ Chí Minh 72324 베트남

    const request = {
      placeId: "ChIJJeoQtogvdTERC5kIIDyUWrc",
      fields: ["name", "formatted_address", "place_id", "geometry"],
    };
    const infowindow = new window.google.maps.InfoWindow();
    const service = new window.google.maps.places.PlacesService(map);

    service.getDetails(request, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place &&
        place.geometry &&
        place.geometry.location
      ) {
        const marker = new window.google.maps.Marker({
          map,
          position: place.geometry.location,
        });

        window.google.maps.event.addListener(marker, "click", () => {
          const content = document.createElement("div");
          const nameElement = document.createElement("h2");

          nameElement.textContent = place.name;
          content.appendChild(nameElement);

          const placeIdElement = document.createElement("p");

          placeIdElement.textContent = place.place_id;
          content.appendChild(placeIdElement);

          const placeAddressElement = document.createElement("p");

          placeAddressElement.textContent = place.formatted_address;
          content.appendChild(placeAddressElement);
          infowindow.setContent(content);
          infowindow.open(map, marker);
        });
      }
    });
  }, [map]);


  return (
    <>
      <div style={{ width: "600px", height: "600px" }} ref={mapRef} />
    </>
  )
}
