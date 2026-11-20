import imageCompression, { Options } from 'browser-image-compression';
export async function compressImage(imageFile: File) {
  console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

  const options: Options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

    return compressedFile;
  } catch (error) {
    console.log(error);
  }
}

export async function generateThumbnail(imageFile: File) {
  const options: Options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 960,
    useWebWorker: true,
  };
  try {
    const thumbnailFile = await imageCompression(imageFile, options);
    console.log(
      `Thumbnail created with size ${thumbnailFile.size / 1024 / 1024} MB`
    );
    return thumbnailFile;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
  }
}
