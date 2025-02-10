'use client';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageAndMetadata } from '@/lib/types';
import { DialogDescription } from '@radix-ui/react-dialog';
import Image from 'next/image';

const createSrcFromBase64 = (src: string) => `data:image/jpeg;base64,${src}`;

// const fetchFullImage = async (id: string): Promise<string> => {
//   const res = await fetch(`/api/images/${id}`);
//   return await res.json();
// };

export const ClickableImage = ({ image }: { image: ImageAndMetadata }) => {
  // ** Was planning on only loading this image when Dialog renders
  // const { data: fullImage } = useQuery<string>({
  //   queryKey: ['full-image', image.id],
  //   queryFn: () => fetchFullImage(image.id.toString()),
  //   enabled: !!image.id,
  // });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={createSrcFromBase64(image.base64)}
          alt={`${image.title} | Please reload page if this appears`}
          sizes="100vw"
          className="cursor-zoom-in rounded w-full h-auto"
          width={500}
          height={100}
        />
      </DialogTrigger>
      <DialogContent className="text-white max-w-7xl border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="my-0 mx-auto text-4xl">{image.title}</DialogTitle>
        <div className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent">
          <Image
            src={createSrcFromBase64(image.fullBase64 || image.base64)}
            fill
            alt={image.title}
            className="h-full w-full object-contain"
          />
        </div>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
