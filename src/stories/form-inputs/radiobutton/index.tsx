/* eslint-disable no-mixed-spaces-and-tabs */
import { _Object } from '@/utils/types';
import Image from 'next/image';
import React from 'react';

interface RadioButtonProps {
	name?: string;
	value?: string[] | undefined;
	checked?: boolean;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	options: _Object;
	required?: boolean;
	className?: string;
	label?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error?: any;
	displayInline?: boolean;
	disabled?: boolean;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  value,
  checked,
  onChange,
  options,
  required,
  className = '',
  label,
  error,
  displayInline,
  disabled
}: RadioButtonProps) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className={`label-form mb-1 d-block ${displayInline ? 'form-check-inline' : ''} `}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      {options &&
				options?.map((option: _Object, i: number) => (
				  <div className={`form-check ${displayInline ? 'form-check-inline' : ''} ${value?.includes(option.value) == true ? 'active' : ''}`} key={i}>
				    {option.image && <div> <Image src={value?.includes(option.value) ? option.imagec : option.image} width="50" height="50" alt="" /> </div>}
				    <input
				      type="radio"
				      name={name}
				      onChange={onChange}
				      value={option.value}
				      checked={checked ? checked : value?.includes(option.value)}
				      className={'form-check-input'}
				      id={`${name}-${i}-${option.value}`}
				      disabled={disabled ? disabled : false}
				    />
				    <label htmlFor={`${name}-${i}-${option.value}`} className="form-check-label">
				      {option.label}
				    </label>
				  </div>
				))}

      {error && <span className="invalid-feedback text-danger d-block mt-1">{error}</span>}
    </div>
  );
};

export default RadioButton;