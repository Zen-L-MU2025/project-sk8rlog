import { Storage } from "@google-cloud/storage";

// Enable CORS
export const enableCORSinBucket = async () => {
    const MAX_AGE = 3600,
        METHOD = ["GET", "HEAD"],
        { ORIGIN } = process.env,
        RESPONSE_HEADER = ["Content-Type", "Range"];

    try {
        // Init bucket
        const { BUCKET_NAME, PROJECT_ID, KEYFILE_NAME: keyFilename } = process.env;
        const storage = new Storage({ PROJECT_ID, keyFilename });
        const bucket = storage.bucket(BUCKET_NAME);

        // Enable CORS
        bucket.setCorsConfiguration([
            {
                MAX_AGE,
                method: [METHOD],
                origin: [ORIGIN],
                responseHeader: [RESPONSE_HEADER],
            },
        ]);

        // Uncomment if needed to get bucket metadata to check CORS config
        // const [metadata] = await bucket.getMetadata();
        // console.log(JSON.stringify(metadata, null, 2));
    } catch (error) {
        console.error(error);
    }
};

// Upload file to GCS bucket
export const uploadFile = async (file, DESTINATION) => {
    try {
        // Init bucket
        const { BUCKET_NAME, PROJECT_ID, KEYFILE_NAME: keyFilename } = process.env;
        const storage = new Storage({ PROJECT_ID, keyFilename });
        const bucket = storage.bucket(BUCKET_NAME);

        const fileBlob = bucket.file(DESTINATION);
        const fileBlobStream = fileBlob.createWriteStream();
        fileBlobStream.on("error", (err) => {
            console.error(err);
        });
        fileBlobStream.end(file.buffer);

        // Return the public URL of the uploaded file
        return `https://storage.googleapis.com/sk8rlog-media/${DESTINATION}`;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteFile = async (fileURL) => {
    try {
        // Init bucket
        const { BUCKET_NAME, PROJECT_ID, KEYFILE_NAME: keyFilename } = process.env;
        const storage = new Storage({ PROJECT_ID, keyFilename });
        const bucket = storage.bucket(BUCKET_NAME);

        // Everything after bucket_name/ is the file name in GCS, split the URL and take the second half
        const FILE_NAME = fileURL.split(`${BUCKET_NAME}/`)[1];

        await bucket.file(FILE_NAME).delete();
    } catch (error) {
        console.error(error);
    }
};
