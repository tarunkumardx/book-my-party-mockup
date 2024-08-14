import { _Object } from '@/utils/types';
import React from 'react';

const Loading = ({ small }: _Object) => {
  return (
    <div className={`spinner-border ${small && 'spinner-border-sm'}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

export default Loading