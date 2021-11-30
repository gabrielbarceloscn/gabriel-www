const cloudinaryCustomLoader = ({src, width, quality }) => {
    if (src === undefined)
        return undefined;

    if (src.indexOf("cloudinary") > 0)
        return src;

    if (src.indexOf("notion") > 0){
        let srcPublicId = src.split('?')[0];
        srcPublicId = new Buffer(srcPublicId).toString('base64');
        return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/image/upload/from-notion/${srcPublicId}`;
    }

    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/image/upload/from-external/${src}`;
}

export default cloudinaryCustomLoader;