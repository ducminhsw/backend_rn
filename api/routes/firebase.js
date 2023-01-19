require("dotenv").config();
const admin = require("firebase-admin");
const { firebaseKey } = require(process.env.PATH_TO_CREDENTIAL);

// Initialize firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert(firebaseKey),
    storageBucket: "gs://hust-it4788.appspot.com/",
});
// Cloud storage
const bucket = admin.storage().bucket();

module.exports = {
    bucket,
};
