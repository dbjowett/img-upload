'use client';
import { TabType } from '@/app/page';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CloudUpload, Loader2, Plus, XIcon } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface UploadData {
  image: File;
  title: string;
}

const uploadImage = async ({ image, title }: UploadData) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('title', title.trim());

  const res = await fetch('/api/images', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Upload failed');
  }

  return res.json();
};

export const ImageSelection = ({
  setCurrentTab,
}: {
  setCurrentTab: Dispatch<SetStateAction<TabType>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [imageTitle, setImageTitle] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!image) return;
    setPreviewImg(URL.createObjectURL(image));
  }, [image]);

  const clearImage = () => {
    setImageTitle('');
    setImage(null);
  };

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length < 1) return;
    const file = e.target.files[0];
    setImage(file);
    e.target.value = '';
  };

  const { mutate, isPending } = useMutation({
    mutationFn: uploadImage,
    onSuccess: (_, { title }) => {
      queryClient.invalidateQueries({ queryKey: ['carouselImages'] });
      toast({
        title: 'Success!',
        description: `Image with title: ${title} was successfully uploaded`,
      });
      setTimeout(() => {
        setCurrentTab('images');
      }, 1000);
      clearImage();
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

  const startUpload = () => {
    if (!image) return;

    mutate({
      image,
      title: imageTitle.trim(),
    });
  };

  // TODO: Change func name
  const onSelectImage = () => {
    if (!inputRef.current || image) return;
    inputRef.current.click();
  };

  const buttonContent = {
    default: {
      text: 'Upload File',
      icon: <CloudUpload />,
    },
    pending: {
      text: 'Uploading..',
      icon: <Loader2 className="animate-spin" />,
    },
  }[isPending ? 'pending' : 'default'];

  return (
    <Card className="flex flex-col p-3 gap-3">
      <div
        className="flex rounded-2xl overflow-hidden border w-full h-[400px] p-1 flex-col justify-center items-center relative"
        onClick={onSelectImage}
      >
        {previewImg && image ? (
          <Image
            alt={image?.name}
            src={previewImg}
            width={400}
            height={400}
            className="h-[400px] object-contain"
          />
        ) : (
          <div className="flex flex-col justify-center gap-2 h-full items-center">
            <Button>
              <Plus /> Select an Image
            </Button>
          </div>
        )}
        {image && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-1 top-1 z-10"
            onClick={() => setImage(null)}
          >
            <XIcon />
          </Button>
        )}
      </div>

      <div className="w-full">
        <Input
          required
          placeholder="Please give your image a title"
          value={imageTitle}
          onChange={({ target }) => setImageTitle(target.value)}
        />
      </div>

      <Button onClick={startUpload} disabled={!imageTitle || !image}>
        {buttonContent.icon}
        {buttonContent.text}
      </Button>

      <input
        ref={inputRef}
        type="file"
        key="image-uploader"
        accept="image/jpeg, image/jpg, image/png"
        className="hidden"
        onChange={onImageChange}
      />
    </Card>
  );
};
