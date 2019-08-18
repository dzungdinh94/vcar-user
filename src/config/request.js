import axios from 'axios';
import moment from 'moment'
import { config } from '.';
import io from 'socket.io-client'
// import RNFetchBlob from 'react-native-fetch-blob'

// socket = io(`${config.domain}/mobile`, { query: `fcmId=${fcm}&token=${this.props.User.token}` });
export function connectSocketIO(fcm, token) {

    if (!config.socket || !config.socket.connected) {//Neu chua connect socket 
        console.log('++++++++connecting++++++++++')
        config.socket = io(
            `${config.domain}/mobile`,
            {
                query: `fcmId=${fcm}&token=${token}`,
                jsonp: false,
                // keepalive: true,
                reconnection: true,
                reconnectionAttempts: 100,
                reconnectionDelay: 10000,
                // forceNew: true,
                pingInterval: 3000,
                pingTimeout: 7000,
                timeout: 10000
            }
        );

    } else {
        console.log('Đã connect socket')
    }
};

export function PostNoToken(url, json, callback) {
    var instance = axios.create({
        headers: { 'Content-Type': 'application/json' },
        timeout: 20 * 1000,
        baseURL: config.domain
    });
    instance.post(url, json).then(function (response) {
        callback(response.data, true);
    }).catch(function (error) {
        callback(error, true);
        if (error.response) {

            if (error.response.status === 500) {
                console.log(error)
            }
            if (error.response.status === 404) {
                console.log(error)
            }
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
    });
    // console.log(instance)
}

export function PostWithToken(url, json, token, callback) {

    var instance = axios.create({
        headers: { 'x-access-token': token, 'Content-Type': 'application/json; charset=utf-8' },
        timeout: 20 * 1000,
        baseURL: config.domain
    });
    instance.post(url, json).then(function (response) {
        // console.log(response.data);
        callback(response.data, true);
    }).catch(function (error) {
        callback(error, false);
        if (error.response) {
            if (error.response.status === 500) {
                console.log(error)
            }

        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error);
        }
    });
}

export function GetWithToken(url, token, callback) {
    var instance = axios.create({
        headers: { 'x-access-token': token },
        timeout: 20 * 1000,
        baseURL: config.domain
    });
    instance.get(url).then(function (response) {
        callback(response.data, true);
    }).catch(function (error) {
        console.log("error: " + JSON.stringify(error))
        callback(error, false);
        if (error.response) {
            console.log(error)
            if (error.response.status === 500) {
                console.log(error)
            }
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
    });
}

export function GetNoToken(link, callback) {
    var instance = axios.create({
        timeout: 20 * 1000,
        baseURL: config.domain
    });
    instance.get(link).then(function (response) {
        callback(response.data, true);
    }).catch(function (error) {
        callback(error.message, false);
    });
}

export function PostWithTokenChat(url, json, token, callback) {
    var instance = axios.create({
        headers: { 'Authorization': 'token=' + token, 'Content-Type': 'application/json' },
        timeout: 20 * 1000,
        baseURL: config.domain
    });
    instance.post(url, json).then(function (response) {
        // console.log(response.data);
        callback(response.data, true);
    }).catch(function (error) {
        callback(error, false);
        if (error.response) {
            if (error.response.status === 500) {
                console.log(error)
            }
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error);
        }
    });
}


// export function UploadImage(url, path, user_id, callback) {
//     console.log("path   " + path)
//     RNFetchBlob.fetch('POST', url, {
//         // 'Authorization': 'Apecsoft ' + token,
//         'Content-Type': 'multipart/form-data',
//     }, [
//             { name: 'id', data: user_id + '' },
//             { name: 'files', filename: 'IMG_' + moment(new Date()).format('YYYYMMDD_HHmmss') + '.jpg', type: 'image/jpg', data: RNFetchBlob.wrap(path) }
//         ]
//     )
//         //Với RNFetchBlob > 0.9.6
//         // listen to upload progress event, emit every 250ms  ===nghe sự kiện tải lên, phát đi mỗi 250ms 
//         .uploadProgress({ interval: 250 }, (written, total) => {
//             console.log('uploaded', written / total)
//         })
//         // listen to download progress event, every 10%  
//         // .progress({ count : 10 }, (received, total) => {
//         //     console.log('progress', received / total)
//         // })

//         //Với RNFetchBlob > 0.42=> 0.7.0
//         // listen to upload progress event 
//         // .uploadProgress((written, total) => {
//         //     console.log('uploaded', written / total)
//         // })

//         // listen to download progress event 
//         // .progress((received, total) => {
//         //     console.log('progress', received / total)
//         // })
//         .then((resp) => {
//             console.log('resp: ' + resp.data)
//             callback(JSON.parse(resp.data), true)
//         }).catch((err) => {
//             callback(err, false)
//             console.log('err: ' + err)
//         })
// };
export function UploadImageAxios(url, dataURI, token, callback, cb) {
    //Upload to server
    let data = new FormData();
    // "data:image/png;base64," +
    data.append('files',
        {
            uri: dataURI, type: 'image/jpg',
            name: `IMG_${moment(new Date()).format('YYYYMMDD_HHmmss')}.jpg`
        },
        `IMG_${moment(new Date()).format('YYYYMMDD_HHmmss')}.jpg`
    );
    var instance = axios.create({
        timeout: 20 * 1000,
        baseURL: config.domain,
        headers: { 'content-type': 'multipart/form-data', 'x-access-token': token },
        onUploadProgress: function (progressEvent) {

            let t = Math.floor(progressEvent.loaded / progressEvent.total * 100)
            cb(t)
        }
    });

    instance.post(url, data).then(function (response) {
        callback(response.data);
    });
}

// export function UploadImageWithToken(url, path, token, callback) {
//     RNFetchBlob.fetch('POST', url, {
//         'Authorization': 'Apecsoft ' + token,
//         'Content-Type': 'multipart/form-data',
//     }, [{ name: 'photo', filename: 'IMG_' + moment(new Date()).format('YYYYMMDD_HHmmss') + '.jpg', type: 'image/jpg', data: RNFetchBlob.wrap(path) },]
//     )

//         //Với RNFetchBlob > 0.9.6
//         // listen to upload progress event, emit every 250ms  ===nghe sự kiện tải lên, phát đi mỗi 250ms 
//         // .uploadProgress({ interval: 250 }, (written, total) => {
//         //     console.log('written: ' + written)
//         //     console.log('total: ' + total)
//         //     console.log('uploaded: ', written / total)
//         // })
//         //listen to download progress event, every 10% 
//         .progress({ count: 10 }, (received, total) => {
//             console.log('writtendownload: ' + received)
//             console.log('totaldownload: ' + total)
//             console.log('progress', received / total)
//         })

//         //Với RNFetchBlob > 0.42=> 0.7.0
//         // listen to upload progress event 
//         .uploadProgress((written, total) => {
//             console.log('written: ' + written)
//             console.log('total: ' + total)
//             console.log('uploaded', written / total)
//         })

//         // listen to download progress event 
//         // .progress((received, total) => {
//         //     console.log('progress', received / total)
//         // })
//         .then((resp) => {
//             console.log('resp: ' + JSON.stringify(resp))
//             callback(JSON.parse(resp.data), true)
//         }).catch((err) => {
//             callback(err, false)
//             console.log('err: ' + err)
//         })
// }


