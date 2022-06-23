const AWS = require("aws-sdk");
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const s3 = new AWS.S3({
	accessKeyId: process.env.ACCESS_KEY_ID,
	secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const BUCKET_NAME = process.env.BUCKET_NAME;
let images = [];

const listBuckets = async s3 => {
	s3.listBuckets(function (err, data) {
		if (err) {
			console.log("Error", err);
		} else {
			console.log("Bucket List", data.Buckets);
		}
	});
};

const listObjectsInBucket = async bucketName => {
	let bucketParams = {
		Bucket: bucketName
	};
	s3.listObjects(bucketParams, function (err, data) {
		if (err) {
			console.log("Error", err);
		} else {
			data.Contents.map(item => {
				console.log(`https://s3.amazonaws.com/${bucketName}/${item.Key}`);
				images.push(`https://s3.amazonaws.com/${bucketName}/${item.Key}`);
			});
		}
	});
};

async function main() {
	await listBuckets(s3);
	await listObjectsInBucket(BUCKET_NAME);
}

main();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/get-all-images", (req, res) => {
	res.send(images);
});

app.listen(PORT, () => {
	console.log("Server started on port 3000");
});
