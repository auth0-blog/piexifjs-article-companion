// 
// Piexifjs exercise
// =================
// 

// Reading a Photo’s Exif Data
// ---------------------------

// Modules required for most of these exercises
const fs = require('fs');
const piexif = require('piexifjs');

// Handy utility functions
const getBase64DataFromJpegFile = filename => fs.readFileSync(filename).toString('binary');
const getExifFromJpegFile = filename => piexif.load(getBase64DataFromJpegFile(filename));

// Get the EXIF data for the palm tree photos
// (Assumes that the photos “palm tree 1.jpg” and “palm tree 2.jpg”
// are in a directory named “images”)
const palm1Exif = getExifFromJpegFile("./images/palm tree 1.jpg");
const palm2Exif = getExifFromJpegFile("./images/palm tree 2.jpg");
const palmExifs = [palm1Exif, palm2Exif];

// Show the Exif data for the two palm tree photos:
console.log(palm1Exif);
console.log(palm2Exif);


// Making Exif Data Easier to Read
// -------------------------------

// Given a Piexifjs object, this function displays its Exif tags
// in a human-readable format
function debugExif(exif) {
    for (const ifd in exif) {
        if (ifd == 'thumbnail') {
            const thumbnailData = exif[ifd] === null ? "null" : exif[ifd]
            console.log(`- thumbnail: ${thumbnailData}`);
        } else {
            console.log(`- ${ifd}`);
            for (const tag in exif[ifd]) {
                console.log(`    - ${piexif.TAGS[ifd][tag]['name']}: ${exif[ifd][tag]}`);
            }
        }
    }
}

// Show the Exif data for the two palm tree photos in
// an easier to read format:
console.log(palm1Exif);
console.log(palm2Exif);


// What Device Took the Photo, and What OS Version Did It Use?
// -----------------------------------------------------------

// Show the make, model, and OS versions of the devices that
// took the palm tree photos
for (const [index, exif] of palmExifs.entries()) {
    console.log(`Device information - Image ${index}`);
    console.log("----------------------------");
    console.log(`Make: ${exif['0th'][piexif.ImageIFD.Make]}`);
    console.log(`Model: ${exif['0th'][piexif.ImageIFD.Model]}`);
    console.log(`OS version: ${exif['0th'][piexif.ImageIFD.Software]}\n`);
}


// When was the Photo Taken?
// -------------------------

// Show the dates and times when the palm tree photos were taken
for (const [index, exif] of palmExifs.entries()) {    
    const dateTime = exif['0th'][piexif.ImageIFD.DateTime]
    const dateTimeOriginal = exif['Exif'][piexif.ExifIFD.DateTimeOriginal]
    const subsecTimeOriginal = exif['Exif'][piexif.ExifIFD.SubSecTimeOriginal]
    
    console.log(`Date/time taken - Image ${index}`)
    console.log("-------------------------")
    console.log(`DateTime: ${dateTime}`)
    console.log(`DateTimeOriginal: ${dateTimeOriginal}.${subsecTimeOriginal}\n`)
}


// Where was the Photo Taken?
// --------------------------

// Show the latitudes and longitudes where the palm tree photos were taken 
for (const [index, exif] of palmExifs.entries()) {    
    const latitude = exif['GPS'][piexif.GPSIFD.GPSLatitude];
    const latitudeRef = exif['GPS'][piexif.GPSIFD.GPSLatitudeRef];
    const longitude = exif['GPS'][piexif.GPSIFD.GPSLongitude];
    const longitudeRef = exif['GPS'][piexif.GPSIFD.GPSLongitudeRef];
    
    console.log(`Coordinates - Image ${index}`);
    console.log("---------------------");
    console.log(`Latitude: ${latitude} ${latitudeRef}`);
    console.log(`Longitude: ${longitude} ${longitudeRef}\n`);
}


// Displaying Photo Locations on a Map
// -----------------------------------

// Given the latitude, latitudeRef, longitude, and longitudeRef values
// from Exif, open a Google Map page for that location
function drawMapForLocation(latitude, latitudeRef, longitude, longitudeRef) {
    const open = require('open');
    
    // Convert the latitude and longitude into the format that Google Maps expects
    // (decimal coordinates and +/- for north/south and east/west)
    const latitudeMultiplier = latitudeRef == 'N' ? 1 : -1;
    const decimalLatitude = latitudeMultiplier * piexif.GPSHelper.dmsRationalToDeg(latitude);
    const longitudeMultiplier = longitudeRef == 'E' ? 1 : -1;
    const decimalLongitude = longitudeMultiplier * piexif.GPSHelper.dmsRationalToDeg(longitude);
    
    const url = `https://www.google.com/maps?q=${decimalLatitude},${decimalLongitude}`;
    open(url);
    
    latitudeDegrees = piexif.GPSHelper.dmsRationalToDeg(latitude);
    longitudeDegrees = piexif.GPSHelper.dmsRationalToDeg(longitude);
    console.log("Original coordinates");
    console.log("--------------------");
    console.log(`Latitude: ${latitudeDegrees} ${latitudeRef}`);
    console.log(`Longitude: ${longitudeDegrees} ${longitudeRef}\n`);
}

// Open maps showing where the palm tree photos were taken
for (const [index, exif] of palmExifs.entries()) {
    const latitude = exif['GPS'][piexif.GPSIFD.GPSLatitude]
    const latitudeRef = exif['GPS'][piexif.GPSIFD.GPSLatitudeRef]
    const longitude = exif['GPS'][piexif.GPSIFD.GPSLongitude]
    const longitudeRef = exif['GPS'][piexif.GPSIFD.GPSLongitudeRef]
    drawMapForLocation(latitude, latitudeRef, longitude, longitudeRef)
}


// What was the altitude where the photo was taken?
// ------------------------------------------------

// Given a numerator/denominator pair expressed as a 2-element array,
// return it as a single numeric value
function rationalToDecimal(rationalValue) {
    return rationalValue[0] / rationalValue[1];
}

// Given the altitude and altitudeRef values from Exif, 
// return a string expressing these values in terms of 
// meters above or below sea level
function formatAltitude(altitude, altitudeRef) {
    altitudeRefText = "(above or below sea level not specified)";
    if (altitudeRef == 0) {
        altitudeRefText = "above sea level";
    } else if (altitude_ref == 1) {
        altitudeRefText = "below sea level";
    }
    return `${altitude} meters ${altitudeRefText}`;
}


// Load the altitude photos
// (Assumes that the photos “altitude 1.jpg” and “altitude 2.jpg”
// are in a directory named “images”)
altitudeExifs = [];
for (let index = 1; index <= 2; index++) {
    const filename = `./images/altitude ${index}.jpg`;
    altitudeExifs.push(getExifFromJpegFile(filename));
}

// Show the altitudes where the photos were taken 
for (const [index, exif] of altitudeExifs.entries()) {
    const altitudeRational = exif['GPS'][piexif.GPSIFD.GPSAltitude];
    const altitudeDecimal = rationalToDecimal(altitudeRational);
    const altitudeRef = exif['GPS'][piexif.GPSIFD.GPSAltitudeRef];
    
    console.log(`Altitude - Image ${index}`);
    console.log("------------------");
    console.log(`${formatAltitude(altitudeDecimal, altitudeRef)}\n`);
}


// Which direction was the camera facing?
// --------------------------------------

// Convert a numeric compass heading to the nearest
// cardinal, ordinal, or secondary intercardinal direction
function degreesToDirection(degrees) {
    const COMPASS_DIRECTIONS = [
        "N",
        "NNE",
        "NE",
        "ENE",
        "E", 
        "ESE", 
        "SE", 
        "SSE",
        "S", 
        "SSW", 
        "SW", 
        "WSW", 
        "W", 
        "WNW", 
        "NW", 
        "NNW"
    ];
    
    const compassDirectionsCount = COMPASS_DIRECTIONS.length;
    const compassDirectionArc = 360 / compassDirectionsCount;
    return COMPASS_DIRECTIONS[Math.round(degrees / compassDirectionArc) % compassDirectionsCount];
}

// Given the directionRef value from Exif, 
// return a string expressing if the direction is relative
// to true north or magnetic north
function formatDirectionRef(directionRef) {
    let directionRefText = "(true or magnetic north not specified)";
    if (directionRef == 'T') {
        directionRefText = "true north";
    } else if (directionRef == 'M') {
        directionRefText = "magnetic north";
    }
    return directionRefText;
}

// Load lake photos
// (Assumes that the photos “lake 1.jpg”, “lake 2.jpg”,
// “lake 3.jpg”, and “lake 4.jpg” are in a directory 
// named “images”)
lakeExifs = [];
for (let index = 1; index <= 4; index++) {
    const filename = `./images/lake ${index}.jpg`;
    lakeExifs.push(getExifFromJpegFile(filename));
}

// Show the directions the camera was facing 
// when the photos were taken 
for (const [index, exif] of lakeExifs.entries()) {
    const directionRational = exif['GPS'][piexif.GPSIFD.GPSImgDirection];
    const directionDecimal = directionRational[0] / directionRational[1];
    const directionRef = exif['GPS'][piexif.GPSIFD.GPSImgDirectionRef];
    
    console.log(`Image direction - Image ${index}`);
    console.log("-------------------------");
    console.log(`Image direction: ${degreesToDirection(directionDecimal)} (${directionDecimal}°)`);
    console.log(`Image direction ref: ${formatDirectionRef(directionRef)}\n`);
}


// Was the photographer moving?
// ----------------------------

// Given the speedRef value from Exif, 
// return a string expressing if the spped is expressed
// in kilometers per hour, miles per hour, or knots
function formatSpeedRef(speedRef) {
    speedRefText = "(speed units not specified)";
    
    if (speedRef == 'K') {
        speedRefText = "km/h";
    } else if (speedRef == 'M') {
        speedRefText = "mph";
    } else if (speedRef == 'N') {
        speedRefText = "knots";
    }
    
    return speedRefText;
}

// Load lake photos
// (Assumes that the photos “speed 1.jpg”, “speed 2.jpg”,
// and “speed 3.jpg” are in a directory 
// named “images”)
speedExifs = []
for (let index = 1; index <= 3; index++) {
    const filename = `./images/speed ${index}.jpg`;
    speedExifs.push(getExifFromJpegFile(filename));
}

// Show the speeds at which the camera was moving 
// when the photos were taken 
for (const [index, exif] of speedExifs.entries()) {
    const speedRational = exif['GPS'][piexif.GPSIFD.GPSSpeed];
    const speedDecimal = rationalToDecimal(speedRational);
    const speedRef = exif['GPS'][piexif.GPSIFD.GPSSpeedRef];
    
    console.log(`Speed - Image ${index}`);
    console.log("---------------");
    console.log(`Speed: ${speedDecimal} ${formatSpeedRef(speedRef)}\n`);
}


// Updating a photo’s coordinates
// ------------------------------

// Load hotel photo
// (Assumes that the photo “hotel original.jpg”
// is in a directory named “images”)
hotelExif = getExifFromJpegFile('./images/hotel original.jpg');

// Show the hotel’s location on a map
latitudeDMS = hotelExif['GPS'][piexif.GPSIFD.GPSLatitude];
latitudeRef = hotelExif['GPS'][piexif.GPSIFD.GPSLatitudeRef];
longitudeDMS = hotelExif['GPS'][piexif.GPSIFD.GPSLongitude];
longitudeRef = hotelExif['GPS'][piexif.GPSIFD.GPSLongitudeRef];
drawMapForLocation(latitudeDMS, latitudeRef, longitudeDMS, longitudeRef);

// Copy the original photo’s picture and Exif data
const newImageData = getBase64DataFromJpegFile('./images/hotel original.jpg');
const newExif = {
    '0th': { ...hotelExif['0th'] },
    'Exif': { ...hotelExif['Exif'] },
    'GPS': { ...hotelExif['GPS'] },
    'Interop': { ...hotelExif['Interop'] },
    '1st': { ...hotelExif['1st'] },
    'thumbnail': null
};

// Change the latitude to Area 51’s: 37° 14' 3.6" N
const newLatitudeDecimal = 37.0 + (14 / 60) + (3.6 / 3600);
newExif['GPS'][piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(newLatitudeDecimal);
newExif['GPS'][piexif.GPSIFD.GPSLatitudeRef] = 'N';
       
// Change the longitude to Area 51’s: 115° 48' 23.99" W
const newLongitudeDecimal = 115.0 + (48.0 / 60) + (23.99 / 3600);
newExif['GPS'][piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(newLongitudeDecimal);
newExif['GPS'][piexif.GPSIFD.GPSLongitudeRef] = 'W';

// Convert the new Exif object into binary form
const newExifBinary = piexif.dump(newExif);

// Embed the Exif data into the image data
const newPhotoData = piexif.insert(newExifBinary, newImageData);

// Save the new photo to a file
let fileBuffer = Buffer.from(newPhotoData, 'binary');
fs.writeFileSync('./images/hotel revised.jpg', fileBuffer);

// Let’s load the file and see its Exif coordinates specify Area 51
const revisedExif = getExifFromJpegFile('./images/hotel revised.jpg');
const revisedLatitude = revisedExif['GPS'][piexif.GPSIFD.GPSLatitude];
const revisedLatitudeRef = revisedExif['GPS'][piexif.GPSIFD.GPSLatitudeRef];
const revisedLongitude = revisedExif['GPS'][piexif.GPSIFD.GPSLongitude];
const revisedLongitudeRef = revisedExif['GPS'][piexif.GPSIFD.GPSLongitudeRef];
drawMapForLocation(revisedLatitude, revisedLatitudeRef, revisedLongitude, revisedLongitudeRef);


// Deleting the Exif Data and Saving the “Scrubbed” Photo
// ------------------------------------------------------

// Create a “scrubbed” copy of the original hotel photo and save it
const hotelImageData = getBase64DataFromJpegFile('./images/hotel original.jpg');
const scrubbedHotelImageData = piexif.remove(hotelImageData);
fileBuffer = Buffer.from(scrubbedHotelImageData, 'binary');
fs.writeFileSync('./images/hotel scrubbed.jpg', fileBuffer);

// Let’s load the file and see its Exif data has been scrubbed
debugExif(getExifFromJpegFile('./images/hotel scrubbed.jpg'));