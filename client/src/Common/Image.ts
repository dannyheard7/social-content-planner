import FileWithPreview from './Interfaces/FIleWithPreview';
import loadImage from 'blueimp-load-image';

export async function resetOrientation(image: File): Promise<FileWithPreview> {
  let orientation: number;

  return await new Promise((resolve, reject) => {
    loadImage.parseMetaData(image, (data: any) => {
      if (data.exif && data.exif.get('Orientation'))
        orientation = data.exif.get('Orientation');
      loadImage(
        image,
        (canvas: HTMLCanvasElement) => {
          const base64 = canvas.toDataURL(image.type);
          const rotatedImage: FileWithPreview = {
            ...image,
            preview: base64,
          };
          resolve(rotatedImage);
        },
        { canvas: true, orientation },
      );
    });
  });
}
