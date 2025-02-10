'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { ImageAndMetadata } from '@/lib/types';

import { TabType } from '@/app/page';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { toast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, EllipsisVertical, ImageMinus, ImagePlus, Settings, Trash } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { ClickableImage } from './clickable-image';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

const getCarouselImages = async () => {
  const res = await fetch('/api/images');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  // ** Fix this
  const { images } = await res.json();
  return images;
};

const deleteImage = async ({ id }: { id: string; title: string }) => {
  const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
  return await res.json();
};

export const ImageCarousel = ({
  setCurrentTab,
}: {
  setCurrentTab: Dispatch<SetStateAction<TabType>>;
}) => {
  const queryClient = useQueryClient();
  const { data: images, isLoading } = useQuery<ImageAndMetadata[]>({
    queryKey: ['carouselImages'],
    queryFn: getCarouselImages,
  });

  const mutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: (_, { title }) => {
      toast({
        title: 'Success!',
        description: `Image with title: ${title} was successfully deleted`,
      });
      queryClient.invalidateQueries({ queryKey: ['carouselImages'] });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      console.error(error);
    },
  });

  const handleDelete = (image: ImageAndMetadata) => {
    mutation.mutate({ id: image.id.toString(), title: image.title });
  };

  const handleDownload = ({
    image,
    size,
  }: {
    image: ImageAndMetadata;
    size: 'compressed' | 'original';
  }) => {
    const imageData = size === 'compressed' ? image.base64 : image.fullBase64;
    const a = document.createElement('a');
    a.href = 'data:image/jpeg;base64,' + imageData;
    a.download = image.originalTitle;
    a.click();
  };

  return (
    <Carousel>
      <CarouselContent>
        {/* PLACEHOLDER */}
        {!images?.length && !isLoading && (
          <CarouselItem onClick={() => setCurrentTab('upload')}>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Button className="w-full">
                    <div className="flex items-center gap-1">
                      <ArrowLeft />
                      Upload an image to view
                    </div>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  className="rounded-lg"
                  src={'https://placehold.co/400x470?text=Image+will+appear+here&font=roboto'}
                  height={470}
                  width={400}
                  alt="placeholder image"
                />
              </CardContent>
            </Card>
          </CarouselItem>
        )}

        {/* SKELETON LOADER */}

        {!images?.length && isLoading && (
          <CarouselItem onClick={() => setCurrentTab('upload')}>
            <Card>
              <div className="flex flex-col p-3 space-y-3 h-[470px] w-full">
                <Skeleton className="h-4 w-[45%]" />
                <Skeleton className="h-full w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[45%]" />
                </div>
              </div>
            </Card>
          </CarouselItem>
        )}

        {/* IMAGE CAROUSEL */}
        {images
          ?.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
          .map((image) => {
            const date = new Date(image.createdAt).toLocaleString();
            return (
              <CarouselItem key={image.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{image.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ClickableImage image={image} />
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between w-full items-center">
                      <p className="font-medium text-sm">{date}</p>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>
                            <div className="flex gap-1 items-center justify-between">
                              Image Options
                              <Settings size={14} />
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDownload({ image, size: 'original' })}
                          >
                            <ImagePlus />
                            Download Original
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload({ image, size: 'compressed' })}
                          >
                            <ImageMinus />
                            Download Compressed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(image)}>
                            <Trash className="text-red-400" />
                            <div className="text-red-400">Delete</div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
