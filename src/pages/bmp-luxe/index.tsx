import React from 'react'
import { Breadcrumb, Layout, SEOHead } from '@/components';
import { _Object } from '@/utils/types';
import { pageService } from '@/services/page.service';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { location } from '@/assets/images';

export const getStaticProps: GetStaticProps = async () => {
  const pageData: _Object = await pageService.getPageBuilderElements('/home')
  return {
    props: {
      pageData: pageData
    }
  }
}

const currentDate = new Date();
currentDate.setDate(currentDate.getDate() + 2);
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const day = currentDate.getDate().toString().padStart(2, '0');
const year = currentDate.getFullYear();
const formattedDate = `${month}-${day}-${year}`;

const BMPLUXE = (props: _Object) => {
  props = props?.pageData?.pageBuilder?.pageLayout?.filter((item:_Object) => item?.fieldGroupName === 'PageBuilderPageLayoutBmpLuxeLayout')[0];
  console.log(props)
  return (
    <>
      <SEOHead seo={{
        title: props.title, metaDesc: 'Connect with us for unforgettable events! Whether it\'s birthdays, weddings, or corporate gatherings, our experts ensure seamless celebrations. Contact us today!'
      }} />
      <Layout {...props
      } >
        <section className="page-content-hero">
          <div className="container">
            <div className="row">
              <div className="col">
                <h1>
                  {props.title}
                </h1>
              </div>
            </div>
          </div>
        </section>

        <Breadcrumb
          data={
            [
              {
                label: 'BMP LUXE',
                target: ''
              }
            ]
          }
        />

        <section className="container my-3">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
            {props.items.map((item:_Object, i:number)=>{
              return(
                <div key={i} className="col">
                  <div className="bmpLuxe card">
                    <div className="row g-0">
                      <div className="col-lg-6 col-md-6">
                        <div className="image-wrapper">
                          <Link href={`/venues/${item.link.target}?locations=delhi-ncr&date=${formattedDate}&types=restaurant&occasions=get-together&pax=${1}`} target="_blank" passHref legacyBehavior className="btn btn-primary w-100">
                            <a target="_blank" rel="noopener noreferrer">
                              <Image src={item.image.node.mediaItemUrl} width="200" height="100" alt="feture-img" />
                            </a></Link>
                          {/* <button disabled={like.loading} onClick={() => addToWishlist(item.databaseId, i)} className="btn wishlist">
                        {like.loading && like.index === i ?
                          <div className="spinner-border spinner-border-sm text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          :
                          <Image src={userWishlist?.some((wishlist: _Object) => wishlist.id === `${item.databaseId}`) ? RedHeart : wishlistWhite} alt="" width="22" height="22" />
                        }
                      </button> */}
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-12">
                        <div className="card-body">
                          <h5 className="card-title">
                            <Link href={`/venues/${item.link.target}?locations=delhi-ncr&date=${formattedDate}&types=restaurant&occasions=get-together&pax=${1}`} target="_blank" passHref legacyBehavior className="btn btn-primary w-100">
                              <a target="_blank" rel="noopener noreferrer">{item.title}
                              </a>
                            </Link>
                          </h5>
                          <p className="card-text m-0">
                            <Image src={location} width="15" height="15" alt="Location" />
                            <span>	{item?.location}</span>
                          </p>
                          <Link href={`/venues/${item.link.target}?locations=delhi-ncr&date=${formattedDate}&types=restaurant&occasions=get-together&pax=${1}`} target="_blank" passHref legacyBehavior className="btn btn-primary w-100">
                            <a className="btn btn-primary w-100" rel="noopener noreferrer" target="_blank">View Venue</a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)
            })}</div>
        </section>
      </Layout >
    </>
  );
};

export default BMPLUXE;
