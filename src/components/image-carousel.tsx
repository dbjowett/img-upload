import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ImageRes } from '@/lib/types';
import Image from 'next/image';

import { useEffect, useState } from 'react';

export const ImageCarousel = () => {
  const [data, setData] = useState<ImageRes[] | null>(null);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch('/api/images');
      const { images } = await res.json();
      setData(images);
    };
    getData();
  }, []);

  return (
    <Carousel>
      <CarouselContent>
        {data?.map((image) => {
          return (
            <CarouselItem key={image.id}>
              <Image
                className="max-h-[400px]  object-contain"
                height={400}
                width={400}
                src={`data:image/jpeg;base64,${image.base64}`}
                alt={image.title}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
