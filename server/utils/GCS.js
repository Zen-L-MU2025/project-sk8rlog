// Sample of Google Cloud Storage usage in Sk8rlog

import { Storage } from '@google-cloud/storage'

// Upload file to GCS bucket
export const UploadFile = async (file_path, destination_name) => {
    try {
        // Init bucket
        const { BUCKET_NAME, PROJECT_ID, KEYFILE_NAME : keyFilename } = process.env
        const storage = new Storage({PROJECT_ID, keyFilename})
        const bucket = storage.bucket(BUCKET_NAME)

        const res = await bucket.upload(file_path, {
            destination: destination_name
        })
        console.log(res)

        // Return the public URL of the uploaded file
        console.log(`Uploaded ${file_path} to GCS as ${destination_name}`)
        return `https://storage.googleapis.com/sk8rlog-media/${destination_name}`

    } catch (error) {
        console.error(error)
        return null
    }
}
