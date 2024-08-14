import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { facebookBlack, linkedinBlack, pinterestBlack, twitterBlack } from '@/assets/images';

export interface SocialShareProps {
	id: string;
	title: string;
	slug?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	show?: any
}

const SocialShare = (props: SocialShareProps) => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(`${currentUrl}`);
  // const encodedUrl = encodeURIComponent(`https://atlas0dev.wpengine.com/${props.slug}`);
  const encodedPostTitle = encodeURIComponent(props.title || '');

  const facebookBlackUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&postId=${encodedPostTitle}`;
  const twitterBlackUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&postId=${encodedPostTitle}`;
  const pinterestShareUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&postId=${encodedPostTitle}`;
  const linkedinBlackUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`

  return (
    <div className={`collapse ${props?.show && 'show'}`} id="collapseSocialIcons">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link href={facebookBlackUrl} target="_blank">
            <Image src={facebookBlack} width="9" height="15" alt="" className="w-100" />
          </Link>
        </li>
        <li className="nav-item">
          <Link href={twitterBlackUrl} target="_blank">
            <Image src={twitterBlack} width="9" height="15" alt="" className="w-100" />
          </Link>
        </li>
        <li className="nav-item">
          <Link href={pinterestShareUrl} target="_blank">
            <Image src={pinterestBlack} width="9" height="15" alt="" className="w-100" />
          </Link>
        </li>
        <li className="nav-item">
          <Link href={linkedinBlackUrl} target="_blank">
            <Image src={linkedinBlack} width="9" height="15" alt="" className="w-100" />
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default SocialShare