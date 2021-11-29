const cloudinaryCustomLoader = ({src, width, quality }) => {
    let srcPublicId = src.split('?')[0];
    srcPublicId = new Buffer(srcPublicId).toString('base64');
    const finalSrcManual = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/image/upload/from-notion/${srcPublicId}`;

    // console.log(`url manual: ${finalSrcManual}`);
    return finalSrcManual;
}

export default cloudinaryCustomLoader;