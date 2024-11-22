import React from 'react';

const ComingSoon = () => {
  return (
    <div className="modal fade" id="comingSoonModal" aria-labelledby="comingSoonModalLabel" aria-hidden="true">
      <div className="modal-dialog comingSoonModal">
        <div className="modal-content">
          <button type="button" className="btn border-0 modal-close comingSoonModal" data-bs-dismiss="modal" aria-label="Close">
            X
          </button>
          <div className="modal-body comingSoonModal">
            <h3 className="pt-2">Coming Soon</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
