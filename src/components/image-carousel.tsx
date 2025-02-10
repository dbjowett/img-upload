'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { ImageRes } from '@/lib/types';

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
import { EllipsisVertical, FileArchive, ImageDown, Loader2, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ClickableImage } from './ui/clickable-image';

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

export const ImageCarousel = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<ImageRes[]>({
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

  if (isLoading) return <Loader2 className="animate-spin" />;

  const handleDelete = (image: ImageRes) => {
    mutation.mutate({ id: image.id.toString(), title: image.title });
  };

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
                  </CardHeader>
                  <CardContent>
                    <ClickableImage image={image} />
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between w-full items-center">
                      <p className="font-semibold text-sm">{date}</p>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Image Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FileArchive />
                            Download Compressed
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ImageDown />
                            Download Original
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(image)}>
                            <Trash /> Delete
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
