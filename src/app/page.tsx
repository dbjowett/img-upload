'use client';
import { ImageCarousel } from '@/components/image-carousel';
import { ImageSelection } from '@/components/image-selection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export type TabType = 'upload' | 'images';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<TabType>('upload');

  return (
    <div className="max-w-[400px] mx-auto h-full mt-4 md:mt-16 w-full">
      <Tabs
        value={currentTab}
        onValueChange={(val) => setCurrentTab(val as TabType)}
        className="px-2 w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <ImageSelection setCurrentTab={setCurrentTab} />
        </TabsContent>
        <TabsContent value="images">
          <ImageCarousel setCurrentTab={setCurrentTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
