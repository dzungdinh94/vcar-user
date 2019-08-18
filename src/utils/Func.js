import React, { Component } from "react";
import _ from 'lodash'
import polyline from '@mapbox/polyline';
import { ImageBackground, View, StatusBar, Image, Alert, Platform } from "react-native";
import Permissions from 'react-native-permissions'
import SimpleToast from 'react-native-simple-toast'
import { values, api_key_google, config, status_api_google, } from "../config";
import { GetNoToken, GetWithToken } from '../config/request'
export const clog = (message, data) => {
    console.log(`${message}: ` + JSON.stringify(data));
};
export function Toast(txt) {
    SimpleToast.show(txt)
}
export function checkPhoneNumber(phoneNumber) {
    const textRegex = /(09|01[2|6|8|9])+([0-9]{8})\b/g
    if (textRegex.test(phoneNumber)) {
        return true
    } else {
        return false
    }
};
export function checkPhone(phone) {
    let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    console.log('phone: ' + phone)
    console.log('phone.lenght: ' + phone.length)
    console.log('re.test(phone): ' + re.test(phone))
    if ((phone + '').length >= 10 && (phone + '').length <= 11) {
        return re.test(phone)
    } else {
        return false;
    }
};

export function _alertForPhotosAndCameraPermission(title, messeage) {
    if (values.platform === 'ios') {
        Alert.alert(title, messeage,
            [
                {
                    // text: 'No way',
                    text: 'Từ chối',
                    onPress: () => console.log('Permission denied'),
                    style: 'cancel',
                },
                {
                    text: 'Mở Cài Đặt',
                    //  text: 'Open Settings',
                    onPress: Permissions.openSettings
                }//vao setting xin quyen
                ,],
        )
    } else {
        SimpleToast.show('Ứng dụng chưa được cấp quyền truy cập vào thiết bị của bạn !');
    }
}


export function getAddressFromLatlng(latitude, longitude, callback) {
    // http://maps.googleapis.com/maps/api/geocode/json?latlng=21.100147,105.887545&sensor=true&key=
    GetNoToken("https://maps.googleapis.com/maps/api/geocode/json?latlng="
        + latitude + "," + longitude
        + "&sensor=false"
        + "&key=" + api_key_google
        ,
        (data, status) => {
            console.log('--: ' + "https://maps.googleapis.com/maps/api/geocode/json?latlng="
                + latitude + "," + longitude
                + "&sensor=false"
                + "&key=" + api_key_google
            )
            // console.log('Dữ liệu gợi ý địa chỉ: ' + JSON.stringify(data))
            if (status) {
                if (data.status == 'OK') {
                    callback(data.results, true)
                } else if (data.status == 'ZERO_RESULTS') {
                    callback([], true)
                } else {
                    // alert('0')
                    callback(data.status, false)
                }
            } else {
                SimpleToast.show('Lỗi kết nối!')
                callback('Lỗi kết nối!', false)
            }
        })
}

export function getLocationFromPlaceId(placeId, callback) {
    let error = 'Có lỗi xảy ra!'
    if (placeId) {
        GetNoToken(urlGetLocationFromPlaceId(api_key_google, placeId), (data, status) => {
            // console.log('lấy location từ placeID: ' + JSON.stringify(data))
            if (status) {
                if (data && data.status && data.status == 'OK') {
                    callback(data, true)
                } else {
                    callback(error, false)
                }
            } else {
                callback(error, false)
            }
        })
    }
};

export function getSuggestAddress(text, callback) {
    GetNoToken(getListSuggestAddress(api_key_google, text), (data, status) => {
        // console.log('------- ======== ========--goi y: ======== ======== ======== getSuggestAddress: ' + JSON.stringify(data))
        if (status) {
            if (data.status == status_api_google.OK) {
                callback(data.predictions, true)
            } else if (data.status == status_api_google.ZERO_RESULTS) {
                callback([status_api_google.ZERO_RESULTS], true)
            } else if (data.status == status_api_google.OVER_QUERY_LIMIT) {
                callback([status_api_google.OVER_QUERY_LIMIT], true)
            } else {
                callback(data.status, false)
            }
        } else {
            SimpleToast.show('Lỗi kết nối!')
            callback('Lỗi kết nối!', false)
        }
    })
};
export function getNameAddressCallback(lat,lng, callback) {
    GetNoToken(getNameAddress(api_key_google, lat,lng), (data, status) => {
        // console.log('------- ======== ========--goi y: ======== ======== ======== getSuggestAddress: ' + JSON.stringify(data))
        if (status) {
            callback(data,true)
        } else {
            SimpleToast.show('Lỗi kết nối!')
            callback('Lỗi kết nối!', false)
        }
    })
};

export function radToDeg(rad) {
    return parseFloat((180 * rad) / Math.PI);
}
export function getDegree(startPoint, endPoint) {
    let data = Math.atan2(endPoint.longitude - startPoint.longitude, endPoint.latitude - startPoint.latitude);
    let dt = (radToDeg(data + Math.PI / 2))
    if (dt < 0) {
        dt += 360;
    }
    // console.log('dt: ' + dt)
    return dt;
}


export function getLinkDirectionsLine(startLocation, destinationLocation) {
    // let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`)
    // api trả ra danh sách toạ độ để chỉ đường gữa 2 điểm
    return `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation}&destination=${destinationLocation}&key=${api_key_google}`
}
export function urlGetLocationFromPlaceId(key_api_map, placeid) {
    return "https://maps.googleapis.com/maps/api/place/details/json?key=" + key_api_map + "&placeid=" + placeid + "&language=vi"
}

export function getNameAddress(key_api_map,lat,lng){
    return `https://maps.googleapis.com/maps/api/geocode/json?language=vi&latlng=${lat},${lng}&key=${key_api_map}`
}
export function getListSuggestAddress(api_key_map, text) {
    let type = 'json';//loai output tra ve
    {
        console.log("https://maps.googleapis.com/maps/api/place/autocomplete/"
            + type
            + "?input=" + text
            // + "&types=all"
            + "&language=vi"
            + "&components=country:vn|"
            + ""
            + "&key=" + api_key_map)
    }
    return "https://maps.googleapis.com/maps/api/place/autocomplete/"
        + type
        + "?input=" + text
        // + "&types=all"
        + "&language=vi"
        + "&components=country:vn|"
        + ""
        + "&key=" + api_key_map;
}

export function getPositionListDirection(fromLatlng, toLatlng, callback) {
    var self = this;
    // https://maps.googleapis.com/maps/api/directions/json?origin=10.883139,106.629758&destination=10.880002,106.619522
    // let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`)
    let isFirst = true;
    console.log('link: ' + `https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=` + fromLatlng.latitude + ',' + fromLatlng.longitude +
        `&destination=` +
        toLatlng.latitude + ',' + toLatlng.longitude + '&key=' + api_key_google)
    fetch(`https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=` + fromLatlng.latitude + ',' + fromLatlng.longitude +
        `&destination=` +
        toLatlng.latitude + ',' + toLatlng.longitude + '&key=' + api_key_google, {
            method: "GET",
            timeout: 20 * 1000,
        })
        .then(function (response) {
            // console.log(response)
            if (response.status == 200) {
                return response.json()
            } else {
                console.log('An error occurred: ' + response.status + ' getPositionListDirection')
                SimpleToast.show('An error occurred: ' + response.status)
            }
        })
        .then(json => {
            // console.log('~~~~~~~````lấy point  chỉ đường rồi decode ra arr chỉ đường: ```~~~ ' + JSON.stringify(json))
            if (json && json.routes[0]) {
                let points = polyline.decode(json.routes[0].overview_polyline.points);
                let distance = json.routes[0].legs[0].distance.value;
                let duration = json.routes[0].legs[0].duration.value;
                if (points.length > 0) { // neu co chi dg
                    let coords = points.map((point, index) => {
                        return {
                            latitude: point[0],
                            longitude: point[1]
                        }
                    })

                    callback({ coords: coords, duration: duration, distance: distance }, 1, true)
                } else { // k thay chi dg
                    callback({}, 1, false)
                    console.log('01: fromLatlng: ' + JSON.stringify(fromLatlng) + ' toLatlng: ' + JSON.stringify(toLatlng))
                    console.log('No path found from Google Map!')
                }
            } else {
                callback({}, 2, false)
                console.log('02: fromLatlng: ' + JSON.stringify(fromLatlng) + ' toLatlng: ' + JSON.stringify(toLatlng))
                console.log('No path found from Google Map.An error occurred.')
            }
        })
        .catch(error => {
            callback([], 3, false)
            // SimpleToast.show(error)
            // console.log(error)
        });

    // Change this array to test.
    const points = [
        { lat: 21.027763, lng: 105.834160 },
        { lat: 20.257990, lng: 105.975940 }
    ];

    function getBoundsZoomLevel(bounds, mapDim) {
        var WORLD_DIM = { height: values.deviceHeight, width: values.deviceWidth };
        var ZOOM_MAX = 21;

        function latRad(lat) {
            var sin = Math.sin(lat * Math.PI / 180);
            var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
            return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
        }

        function zoom(mapPx, worldPx, fraction) {
            return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
        }

        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();

        var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

        var lngDiff = ne.lng() - sw.lng();
        var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

        var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
        var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

        return Math.min(latZoom, lngZoom, ZOOM_MAX);
    }

    function createMarkerForPoint(point) {
        return new google.maps.Marker({
            position: new google.maps.LatLng(point.lat, point.lng)
        });
    }

    function createBoundsForMarkers(markers) {
        var bounds = new google.maps.LatLngBounds();
        $.each(markers, function () {
            bounds.extend(this.getPosition());
        });
        return bounds;
    }

    // var $mapDiv = $('#mapDiv');

    // var mapDim = {
    //     height: $mapDiv.height(),
    //     width: $mapDiv.width()
    // }

    // var markers = [];
    // $.each(points, function () { markers.push(createMarkerForPoint(this)); });

    // var bounds = (markers.length > 0) ? createBoundsForMarkers(markers) : null;

    // var map = new google.maps.Map($mapDiv[0], {
    //     center: (bounds) ? bounds.getCenter() : new google.maps.LatLng(0, 0),
    //     mapTypeId: google.maps.MapTypeId.ROADMAP,
    //     zoom: (bounds) ? getBoundsZoomLevel(bounds, mapDim) : 0
    // });

    // $.each(markers, function () { this.setMap(map); });

}

export function getPositionListDirectionLegs(fromLatlng, toLatlng, callback) {
    var self = this;
    // https://maps.googleapis.com/maps/api/directions/json?origin=10.883139,106.629758&destination=10.880002,106.619522
    // let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`)
    let isFirst = true;
    console.log('link: ' + `https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=` + fromLatlng.latitude + ',' + fromLatlng.longitude +
        `&destination=` +
        toLatlng.latitude + ',' + toLatlng.longitude + '&key=' + api_key_google)
    fetch(`https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=` + fromLatlng.latitude + ',' + fromLatlng.longitude +
        `&destination=` +
        toLatlng.latitude + ',' + toLatlng.longitude + '&key=' + api_key_google, {
            method: "GET",
            timeout: 20 * 1000,
        })
        .then(function (response) {
            // console.log(response)
            if (response.status == 200) {
                return response.json()
            } else {
                console.log('An error occurred: ' + response.status + ' getPositionListDirection')
                SimpleToast.show('An error occurred: ' + response.status)
            }
        })
        .then(json => {
            // console.log('~~~~~~~````lấy point  chỉ đường rồi decode ra leg```~~~ ' + JSON.stringify(json))
            if (json && json.routes[0]) {
                console.log('json.routes[0].legs[0]: ' + JSON.stringify(json.routes[0].legs[0]))
                // let legs = json.routes[0].legs[0].duration.value;
                let legs = { duration: json.routes[0].legs[0].duration.value, distance: json.routes[0].legs[0].distance.value }
                callback(legs, 1, true)

            } else {
                callback({}, 2, false)
                console.log('02: fromLatlng: ' + JSON.stringify(fromLatlng) + ' toLatlng: ' + JSON.stringify(toLatlng))
                console.log('No path found from Google Map.An error occurred.')
            }
        })
        .catch(error => {
            callback([], 3, false)
            // SimpleToast.show(error)
            // console.log(error)
        });

}
