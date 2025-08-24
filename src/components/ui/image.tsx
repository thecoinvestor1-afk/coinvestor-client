'use client';

import NextImage, { ImageProps as NextImageProps } from 'next/image';

type ImageProps = Omit<NextImageProps, 'alt'> & {
  alt?: string;
};

const Image: React.FC<ImageProps> = ({ alt = 'UI UX Inspiration', ...props }) => {
  const imageLoader = ({
    src,
    width,
    quality,
  }: {
    src: string;
    width?: number;
    quality?: number;
  }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  return <NextImage {...props} loader={imageLoader} alt={alt} />;
};

export default Image;
