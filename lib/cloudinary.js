export const uploadImageToCloudAndGetNewPublicUrl = async (cloudinaryClient, originUrl) => {
    let cleanUrl = originUrl.split('?')[0];
    let cleanUrlEncoded = new Buffer(cleanUrl).toString('base64');
    let cdnUploadResponse = await cloudinaryClient.uploader.upload(originUrl, {
        "public_id": cleanUrlEncoded,
        folder: "from-notion",
        unique_filename: false,
        ovewrite: false,
        resource_type: 'image',
    });
    return cdnUploadResponse.secure_url;
}