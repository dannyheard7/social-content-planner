import FileWithPreview from './FIleWithPreview';
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
          var img = new Image();

          img.onload = function() {
            var width = img.width,
              height = img.height,
              ctx = canvas.getContext('2d');

            ctx!.clearRect(0, 0, canvas.width, canvas.height);

            // set proper canvas dimensions before transform & export
            if (4 < orientation && orientation < 9) {
              canvas.width = height;
              canvas.height = width;
            } else {
              canvas.width = width;
              canvas.height = height;
            }

            // transform context before drawing image
            switch (orientation) {
              case 2:
                ctx!.transform(-1, 0, 0, 1, width, 0);
                break;
              case 3:
                ctx!.transform(-1, 0, 0, -1, width, height);
                break;
              case 4:
                ctx!.transform(1, 0, 0, -1, 0, height);
                break;
              case 5:
                ctx!.transform(0, 1, 1, 0, 0, 0);
                break;
              case 6:
                ctx!.transform(0, 1, -1, 0, height, 0);
                break;
              case 7:
                ctx!.transform(0, -1, -1, 0, height, width);
                break;
              case 8:
                ctx!.transform(0, -1, 1, 0, 0, width);
                break;
              default:
                break;
            }
            ctx!.drawImage(img, 0, 0);

            const rotatedImage: FileWithPreview = {
              ...image,
              preview: canvas.toDataURL(),
            };

            resolve(rotatedImage);
          };

          img.src = base64;
        },
        { canvas: true },
      );
    });
  });
}
