'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CloudUpload, Loader2, Plus, XIcon } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';

export default function Home() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [imageTitle, setImageTitle] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const previewImage = image ? URL.createObjectURL(image) : null;

  const clearImage = () => {
    setImageTitle('');
    setImage(null);
  };

  const startUpload = async () => {
    if (!image) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', imageTitle);

    try {
      await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });
      // ** Success
      toast({
        title: 'Success!',
        description: `Image with title: ${imageTitle} was successfully uploaded`,
      });

      clearImage();
    } catch (error) {
      // ** Error
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // TODO: Change func name
  const onSelectImage = () => {
    if (!inputRef.current || image) return;
    inputRef.current.click();
  };

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('HEREERERER', e.target);
    if (!e.target.files || e.target.files.length < 1) return;
    const file = e.target.files[0];
    setImage(file);
    setImageTitle(file.name);
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
  }[isUploading ? 'pending' : 'default'];

  return (
    <div className="flex flex-col justify-center items-center min-h-svh mx-auto max-w-[400px] gap-4">
      <div className="text-2xl font-bold">Select an Image</div>

      {/* Image Preview */}
      <div
        className="rounded-md overflow-hidden border w-full h-[400px] p-1 flex justify-center items-center relative"
        onClick={onSelectImage}
      >
        {previewImage && image ? (
          <Image
            alt={image?.name}
            src={previewImage}
            width={400}
            height={400}
            className="h-[400px] object-contain"
          />
        ) : (
          <div className="flex flex-col justify-center gap-2 h-full items-center">
            <Button>
              <Plus /> Upload an Image
            </Button>
          </div>
        )}
        {image && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 z-10"
            onClick={clearImage}
          >
            <XIcon />
          </Button>
        )}
      </div>
      {image && (
        <>
          <div className="w-full">
            <Input
              placeholder="Please give your image a title"
              value={imageTitle}
              onChange={({ target }) => setImageTitle(target.value)}
            />
          </div>

          <Button onClick={startUpload}>
            {buttonContent.icon}
            {buttonContent.text}
          </Button>
        </>
      )}

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onImageChange} />
    </div>
  );
}
