import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ImageRes } from '@/lib/types';
import Image from 'next/image';

const createSrcFromBase64 = (src: string) => `data:image/jpeg;base64,${src}`;

export const ClickableImage = ({ image }: { image: ImageRes }) => {
  // fetch full image

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={createSrcFromBase64(image.base64)}
          alt={image.title}
          sizes="100vw"
          className="cursor-zoom-in rounded w-full h-auto"
          width={500}
          height={100}
        />
      </DialogTrigger>
      <DialogContent className="max-w-7xl border-0 bg-transparent p-0">
        <div className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent shadow-md">
          <Image
            src={createSrcFromBase64(image.base64)}
            fill
            alt={image.title}
            className="h-full w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
