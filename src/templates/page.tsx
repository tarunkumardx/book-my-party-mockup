import React from 'react'

import { _Object } from '@/utils/types'
import Link from 'next/link';
import { VenueTemplate } from '@/components';

const PageTemplate = ({ args }: _Object) => {
  return (
    <>
      {
        args?.template?.templateName === 'Page Builder Template' ?
          <section className="perfect-for-section">
            <div className="container">
              <div className="row">
                <div className="col">

                  <div className="row">
                    {args.template.pagesPagebuilder.pageLayout?.map((item: _Object, i: number) => {
                      if (item?.fieldGroupName === 'PagesPagebuilderPageLayoutHeadingLayout') {
                        return (
                          <div key={i} className="col-12">
                            <div dangerouslySetInnerHTML={{ __html: `<${item.headingType}>${item.title}</${item.headingType}>` }} />
                          </div>
                        );
                      }

                      if (item?.fieldGroupName === 'PagesPagebuilderPageLayoutContentBoxLayout') {
                        return (
                          <div className="col-12" key={i}>
                            <div dangerouslySetInnerHTML={{ __html: item.content }} />
                          </div>
                        );
                      }

                      if (item?.fieldGroupName === 'PagesPagebuilderPageLayoutVenuesLayout') {
                        return item?.items?.nodes?.map((venueItem: _Object, j: number) => (
                          <React.Fragment key={j}>
                            {j === 0 && (
                              <div className="justify-content-between d-flex book-birthday-pary-content">
                                <div dangerouslySetInnerHTML={{ __html: `<${item.headingType}>${item.title}</${item.headingType}>` }} />

                                {item?.link?.target?.length > 0 && (
                                  <div className="justify-content-end bekal-cafe-button">
                                    <Link className="btn btn-primary" href={item?.link?.target}>{item?.link?.label}</Link>
                                  </div>
                                )}
                              </div>

                            )}
                            <div className="col-lg-4 col-md-6 mb-2" key={j}>
                              <VenueTemplate props={venueItem} i={j} />
                            </div>

                          </React.Fragment>
                        ));
                      }

                      return null; // Default return to handle other cases or if no condition matches
                    })}
                  </div>

                </div>

              </div>
            </div>
          </section>
          :
          <>
            {args.content ?
              <section className="page-content">
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <div dangerouslySetInnerHTML={{ __html: args.content }} />
                    </div>
                  </div>
                </div>
              </section>
              :
              <></>
            }
          </>
      }
    </>
  );
};

export default PageTemplate;
