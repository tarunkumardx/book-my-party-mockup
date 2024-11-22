import { _Object } from '@/utils/types';
import React, { useEffect, useState } from 'react';

const MenuDetail = ({ data }: _Object) => {
  const [activeTab, setActiveTab] = useState(data.tab);

  useEffect(() => {
    setActiveTab(data.tab);
  }, [data]);

  return (
    <div className="menus-details-list">
      <div className="modal fade" id="MenuDetailModal" aria-labelledby="MenuDetailModal" aria-hidden="true">
        <div className="modal-dialog  modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">

              <ul className="nav nav-pills" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button onClick={() => setActiveTab('menu')} className={`nav-link ${activeTab === 'menu' ? 'active' : ''}`} id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Menu</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button onClick={() => setActiveTab('detail')} className={`nav-link ${activeTab === 'detail' ? 'active' : ''}`} id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Details</button>
                </li>

              </ul>
              {/* <ul className="list-inline mb-0">
								<li className={`list-inline-item ${data.tab === 'menu' ? 'active' : ''}`}>Menu</li>
								<li className={`list-inline-item ${data.tab === 'detail' ? 'active' : ''}`}>Details</li>

							</ul> */}
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="tab-pane fade show" role="tabpanel" aria-labelledby="pills-home-tab" >
                <div dangerouslySetInnerHTML={{ __html: data[`${activeTab}`] }} />
              </div>
            </div>

            {/* <div className="modal-header">
							<ul className="list-inline mb-0">
								<li className={`list-inline-item ${data.tab === 'menu' ? 'active' : ''}`}>Menu</li>
								<li className={`list-inline-item ${data.tab === 'detail' ? 'active' : ''}`}>Details</li>

							</ul>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>

						<div className="modal-body">
							<div dangerouslySetInnerHTML={{ __html: data?.string }} />
						</div> */}

          </div>
        </div>
      </div >
    </div>

  )
}

export default MenuDetail