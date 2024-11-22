import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { _Object } from '@/utils/types';

interface HeadTag {
	title?: string;
	metaDesc?: string;
	url?: string;
	props?: {
		title?: string;
		metaDesc?: string;
	};
	featuredImage?: _Object,
	content?: string,
	seo: _Object
}

const SEOHead: React.FC<HeadTag> = ({ seo }) => {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(`${window.location.origin}${window.location.pathname}`)
    }
  }, []);

  return (
    <Head>
      <title>{seo?.seo?.title ? seo?.seo?.title : seo?.title}</title>
      <title>{seo?.seo?.title ? seo?.seo?.title : seo?.title}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="google-site-verification" content="-Vzhzatgp4lsmhuFQLue2feATQX9s9oSX8g0oIIqcXo" />
      <meta name="description" content={seo?.seo?.metaDesc ? seo?.seo?.metaDesc : seo?.metaDesc || ''} />
      <meta property="og:title" content={seo?.seo?.title ? seo?.seo?.title : seo?.title} />
      <meta property="og:type" content="article" />
      <meta property="og:description" content={seo?.seo?.metaDesc ? seo?.seo?.metaDesc : seo?.metaDesc || ''} />
      <meta property="og:image" content={seo?.featuredImage?.node?.mediaItemUrl} />
      <meta property="og:url" content={currentPath} />
    </Head>
  );
};

export default SEOHead;