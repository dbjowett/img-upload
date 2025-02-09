'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';

import { ImageRes } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { ImageDown, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

const getCarouselImages = async () => {
  const res = await fetch('/api/images');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const { images } = await res.json();
  return images;
};

export const ImageCarousel = () => {
  const { data, isLoading } = useQuery<ImageRes[]>({
    queryKey: ['carouselImages'],
    queryFn: getCarouselImages,
  });

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <Carousel>
      <CarouselContent>
        {data
          ?.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
          .map((image) => {
            const date = new Date(image.createdAt).toLocaleString();
            return (
              <CarouselItem key={image.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{image.title}</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                  </CardHeader>
                  <CardContent>
                    <Image
                      className="max-h-[400px] object-contain cursor-pointer"
                      height={400}
                      width={400}
                      src={`data:image/jpeg;base64,${image.base64}`}
                      alt={image.title}
                    />
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between w-full items-center">
                      <p className="font-semibold text-sm">{date}</p>
                      <div>
                        <Button variant="ghost" size="icon">
                          <ImageDown />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ImageDown />
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </CarouselItem>
            );
          })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
