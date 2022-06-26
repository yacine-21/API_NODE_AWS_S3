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
let images_folder_carousel = [];

const listBuckets = async s3 => {
	s3.listBuckets(function (err, data) {
		if (err) {
			console.log("Error", err);
		} else {
			// console.log("Bucket List", data.Buckets);
		}
	});
};

const listObjectFolder = async s3 => {
	s3
		.listObjectsV2({ Bucket: BUCKET_NAME, Prefix: "Carousel" }, (err, data) => {
			if (err) {
				console.log("Error", err);
			} else {
				data.Contents.map(item => {
					images_folder_carousel.push(item.Key);
				});
				console.log(data);
			}
		})
		.promise();
};

const listObjectsInBucket = async bucketName => {
	let bucketParams = {
		Bucket: bucketName,
		Prefix: "/Images"
	};
	s3.listObjects(bucketParams, function (err, data) {
		try {
			if (err) {
				console.log("Error", err);
			} else {
				data.Contents.map(item => {
					images.push(`https://s3.amazonaws.com/${bucketName}/${item.Key}`);
				});
			}
		} catch (error) {
			console.log(error);
		}
	});
};

async function main() {
	await listBuckets(s3);
	await listObjectsInBucket(BUCKET_NAME);
	await listObjectFolder(s3);
}

main();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/get-all-images", (req, res) => {
	res.send(images);
});

app.get("/get-folder-carousel", (req, res) => {
	res.send(images_folder_carousel);
});

app.listen(PORT, () => {
	console.log("Server started on port 3000");
});
