/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components';
import { useRouter } from 'next/router';
import { _Object } from '@/utils/types';
import { listService } from '@/services/venue.service';
import VenueDetails from './venues/[slug]';

export default function FourOhFour() {
  const router: _Object = useRouter();

  const [props, setProps] = useState({})
  const [locations, setLocations] = useState({})
  const [occasions, setOccassions] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const data = await listService.getVenueDetails(router.asPath.split('/')[2].split('?')[0]);
      const locations = await listService.getLocations();
      const occasions = await listService.getOccasions();

      setProps(data);
      setLocations(locations);
      setOccassions(occasions);

      setLoading(false);
    }

    if (router.asPath.split('/')[1] === 'venues') {
      fetchData();
    } else if (router.asPath.split('/')[1] === '404') {
      setLoading(false)
    } else {
      router.push(router.asPath)
    }
  }, [router.asPath]);
  return (
    <>
      {
        router.asPath.split('/')[1] === 'venues' ?
          <>
            {
              loading ?
                <Layout>
                  <section className="order-placeholder-menu">
                    <div className="container-fluid">
                      <div className="row placeholder-glow">
                        <div className="row">
                          <div className="col-lg-4 col-md-6">
                            <p className="card-text placeholder-glow">
                              <span className="placeholder col-1 me-3"></span>
                              <span className="placeholder col-1 me-3"></span>
                              <span className="placeholder col-1 me-3"></span>
                              <span className="placeholder col-1 me-3"></span>
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </section>

                  <section className="order-single-1">
                    <div className="container-fluid">
                      <div className="row placeholder-glow">
                        <div className="col-12 col-xl-6">
                          <span className="placeholder venue-image-placeholder"></span>
                        </div>

                        <div className="col-12 col-xl-6">
                          <div className="row starting-main">
                            <div className="col-12 col-sm-6">
                              <span className="placeholder thumbnail-img"></span>

                              <span className="placeholder thumbnail-img"></span>
                            </div>

                            <div className="col-12 col-sm-6">
                              <div className="starting-price-wrap">
                                <div className="starting-price">
                                  <span className="placeholder"></span>

                                  <span className="placeholder"></span>

                                </div>

                                <div className="starting-price-list">
                                  <div>
                                    <span className="placeholder dot"></span>
                                    <span className="placeholder"></span>
                                  </div>

                                  <div>
                                    <span className="placeholder"></span>
                                  </div>
                                </div>

                                <div className="starting-price-list">
                                  <div>
                                    <span className="placeholder dot"></span>
                                    <span className="placeholder"></span>
                                  </div>

                                  <div>
                                    <span className="placeholder"></span>
                                  </div>
                                </div>

                                <div className="starting-price-list">
                                  <div>
                                    <span className="placeholder dot"></span>
                                    <span className="placeholder"></span>
                                  </div>

                                  <div>
                                    <span className="placeholder"></span>
                                  </div>
                                </div>

                                <div className="starting-price-list">
                                  <div>
                                    <span className="placeholder dot"></span>
                                    <span className="placeholder"></span>
                                  </div>

                                  <div>
                                    <span className="placeholder"></span>
                                  </div>
                                </div>

                                <span className="placeholder btn"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </Layout>
                :
                <VenueDetails {...{ data: props, locations: locations, occassions: occasions }} />
            }
          </>
          :
          <Layout>
            {!loading &&
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
							  <div style={{ textAlign: 'center' }}>
							    <h1>Oops! Page Not Found</h1>
							    <p>We&apos;re sorry, but the page you&apos;re looking for cannot be found.</p>
							    <p>It may have been moved, deleted, or temporarily unavailable.</p>
							  </div>
							</div>
            }
          </Layout>
      }
    </>
  );
}