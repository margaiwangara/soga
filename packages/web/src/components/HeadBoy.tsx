import React from 'react';
import Head from 'next/head';

interface HeadBoyProps {
  title: string;
  description?: string;
}

const HeadBoy: React.FC<HeadBoyProps> = ({
  title = 'Home',
  description = 'A chat web application for the everyday user',
}) => {
  return (
    <Head>
      <title>Soga | {title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="keywords" content="soga,soga chat,chat" />
      <meta name="og:description" content={description} />
      <meta name="og:title" content={title} />
      <meta name="og:image" content="" />
    </Head>
  );
};

export default HeadBoy;
