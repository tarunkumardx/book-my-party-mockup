import React, { useEffect, useState } from 'react';

interface CheckBoxProps {
	name?: string;
	values?: string[] | undefined;
	options: { value: string; label: string }[];
	checked?: boolean;
	onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
	className?: string;
	label?: string;
	error?: string | boolean;
	displayInline?: boolean;
	disabled?: boolean;
	showMoreOption?: boolean
}

const CheckBox: React.FC<CheckBoxProps> = ({
  name,
  values,
  options,
  checked,
  onChange,
  className = '',
  label,
  displayInline,
  error,
  disabled,
  showMoreOption = false
}: CheckBoxProps) => {
  const [showMore, setShowMore] = useState(true);
  const visibleOptions = showMore ? options : options?.slice(0, 5);

  const handleShowMore = () => {
    // setShowMore(!showMore);
    setShowMore(true)
  };
  useEffect(()=>{
    if(window.innerWidth < 768){
      setShowMore(true)
    }
  },[])
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="form-label mb-1 d-block">{label}</label>}

      {showMoreOption ?
        visibleOptions?.map((option, i) => (
          <div className={`form-check ${displayInline ? 'form-check-inline' : ''}`} key={i}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              onChange={onChange}
              checked={checked ? checked : values?.includes(option.value)}
              className="form-check-input"
              id={`${name}-${i}-${option.value}`}
              disabled={disabled ? disabled : false}
            />
            <label htmlFor={`${name}-${i}-${option.value}`} className="form-check-label">
              {option.label}
            </label>
          </div>
        ))
        :
        options?.map((option, i) => (
          <div className={`form-check ${displayInline ? 'form-check-inline' : ''}`} key={i}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              onChange={onChange}
              checked={checked ? checked : values?.includes(option.value)}
              className="form-check-input"
              id={`${name}-${i}-${option.value}`}
              disabled={disabled ? disabled : false}
            />
            <label htmlFor={`${name}-${i}-${option.value}`} className="form-check-label">
              {option.label}
            </label>
          </div>
        ))
      }
      {showMoreOption && options.length > 5 && (
        <button className="btn btn-link showMore p-0" type="button" onClick={handleShowMore}>
          {!showMore && 'Show More'}
        </button>
      )}
      {error && <span className="text-danger">{error}</span>}
    </div>
  );
};

export default CheckBox;
