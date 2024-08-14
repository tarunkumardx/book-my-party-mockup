import React from 'react'
import { _Object } from '@/utils/types';

const FAQs = ({ data }: _Object) => {
  return (
    <>
      <div className="frequently-asked">
        <div className="row">
          <h5 className="main-head">
						FREQUENTLY ASKED QUESTIONS
          </h5>
          <div className="col">
            <div className="accordion" id="accordionBookMyParty">
              {data?.map((item: _Object, i: number) => {
                const headingId = `heading${i}`;
                const collapseId = `collapse${i}`;
                const isExpanded = i === 0;
                return (

                  <div key={i} className="accordion-item">
                    <h2 className="accordion-header" id={headingId}>
                      <button
                        className={`accordion-button ${!isExpanded ? 'collapsed' : ''}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${collapseId}`}
                        aria-expanded={isExpanded ? 'true' : 'false'}
                        aria-controls={collapseId}
                      >
                        {/* <Image
												src={question}
												width={20}
												height={20}
												alt=""
											/> */}
                        {item?.question?.length > 0 && item.question}
												&nbsp;&nbsp;
                      </button>
                    </h2>
                    <div id={collapseId}
                      className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}
                      aria-labelledby={headingId} data-bs-parent="#accordionBookMyParty">
                      <div className="accordion-body">
                        <p className="mb-0"> {item?.answer?.length > 0 && item.answer} </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQs;
