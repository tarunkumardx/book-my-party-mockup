import React, { ChangeEvent, useState } from 'react';
import { _Object } from '@/utils/types';

const FileUpload = ({ className = '', label, onChange }: _Object) => {
  const [fileData, setFileData] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          setFileData(reader.result);
          onChange(reader.result)
        }
      };
    }
  };

  return (
    <>
      <div className={`form-group file-upload mb-3 ${className}`}>
        {label && (
          <label className="label-form mb-1" htmlFor="formFile">
            {label}
          </label>
        )}
        <input
          className="form-control"
          type="file"
          id="formFile"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {/* Display base64 encoded file data */}
        {fileData && (
          <img src={fileData} alt="File Preview" />
        )}
      </div>
    </>
  );
};

export default FileUpload;
