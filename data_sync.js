
import RNFetchBlob from 'rn-fetch-blob'


let loginInfo = require('./login_info.json')

var AWS = require('aws-sdk');

/**
 * Returns promise of a file write to android/app/src/main/assets.
 *
 * @param {string} filename The file to write to.
 * @return Promise - The promise of the file write attempt.
 */
export function writeFile(filename, data) {
    let dirs = RNFetchBlob.fs.dirs;

    let outFilePath = dirs.MainBundleDir + "/" + filename

    return RNFetchBlob.fs.writeFile(outFilePath, data, 'utf8') // expects a string as data
}

/**
 * Returns promise of a file read from android/app/src/main/assets.
 *
 * @param {string} filename The file to read (utf8).
 * @return Promise - The promise of the file read attempt.
 */
export function readFile(filename) {
    // Note - file must be in asset folder - android/app/src/main/assets
    let dirs = RNFetchBlob.fs.dirs;

    let path = dirs.MainBundleDir + "/" + filename

    // Return the promise
    return RNFetchBlob.fs.readFile( path, 'utf8');
}

/**
 * Returns promise of a check to see if a file exists
 *
 * @param {string} filename The file to check
 * @return Promise - The promise of the file exists check.
 */
export function fileExists( filename ) {
    // This returns the promise. The promise can be successful but the value returned is false, error is a bad call
    return RNFetchBlob.fs.exists(filename)
}

/**
 * Returns promise of append file attemp
 *
 * @param {string} filename The file to append to.
 * @param {string} newData - The new data to add to the file.
 * @return Promise - The promise of the write file attempt.
 */
export function appendJsonFile( filename, newData ) {
    return readFile( filename )
    .then( (data) => {
        let json = JSON.parse(data);
        json.push( newData );

        return writeFile( filename, JSON.stringify( json ) );
    });
}

/**
 * Returns promise of an s3 download
 *
 * @param {string} filename The file to download.
 * @return Promise - The promise of the upload attempt.
 */
export function s3Download(filename) {
    var s3 = new AWS.S3();

    // Promise wrapper explained here: https://medium.com/bithubph/creating-a-promise-wrapper-for-old-callback-api-methods-fa1b03b82a90
    const s3DownloadPromiseWrapper = (params) => new Promise
    ((resolve, reject) => {
        s3.getObject(params, (s3Err, data) => {
            if (s3Err) {
                console.log("s3 download error..")
                return reject(s3Err);
            }
            console.log(`Downloaded ${data.ContentLength} bytes. File: ${params.Key}`);
            return resolve(data.Body);
        } );
    } );

    const params = {
        Bucket: loginInfo.bucketName,
        Key: filename,
    };

    return s3DownloadPromiseWrapper(params);
}

/**
 * Returns promise of an s3 upload
 *
 * @param {string} data The data to upload.
 * @param {string} filename The file to upload to.
 * @return Promise - The promise of the upload attempt.
 */
export function s3Upload(data, filename) {
    var s3 = new AWS.S3();
    
    console.log('data: ' + data);

    // Promise wrapper explained here: https://medium.com/bithubph/creating-a-promise-wrapper-for-old-callback-api-methods-fa1b03b82a90
    const s3UploadPromiseWrapper = (params) => new Promise
    ((resolve, reject) => {
        s3.upload(params, (s3Err, data) => {
            if (s3Err) {
                console.log("s3 upload error..")
                return reject(s3Err);
            }
            console.log(`File uploaded successfully at ${data.Location}`);
            return resolve(data);
        } );
    } );

    const params = {
        Bucket: loginInfo.bucketName,
        Key: filename,
        Body: JSON.stringify(data, null, 2)
    };

    return s3UploadPromiseWrapper(params);
}
