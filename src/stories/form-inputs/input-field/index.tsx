/* eslint-disable react/no-unknown-property */
import React, { useState, ChangeEvent, FocusEvent } from 'react'
import { _Object } from '@/utils/types'
import Image from 'next/image';
import { ShowPassword } from '@/assets/images';

interface InputFieldProps extends _Object {
	name?: string;
	type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'quantity' | undefined;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
	value?: string;
	label?: string;
	placeholder?: string;
	required?: boolean;
	className?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error?: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	image?: any
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  type = 'text',
  onChange,
  onBlur,
  value,
  label,
  placeholder = 'Enter here',
  required = false,
  className = '',
  error,
  image,
  ...props
}: InputFieldProps) => {
  const [eyeOn, setEyeOn] = useState(false)
  const [fieldType, setFieldType] = useState(type)

  const toggleEyeOn = () => {
    if (eyeOn === false) {
      setEyeOn(true)
      setFieldType('text')
    } else {
      setEyeOn(false)
      setFieldType('password')
    }
  }

  return (
    <div className={`form-group mb-3 ${className} ${error && 'invalid'}`}>
      {label && (
        <label className="label-form mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <input
        type={fieldType ? fieldType : 'text'}
        autoComplete="off"
        name={name}
        min={0}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="form-control"
        {...props}
      />
      {image && type != 'password' && <Image src={image} alt="" className="position-absolute translate-middle-y form-control-icon" />}
      {type === 'password' && (
        <button
          type="button"
          className="btn p-0 position-absolute form-control-icon translate-middle-y border-0"
          onClick={toggleEyeOn}
        >
          <Image src={eyeOn ? ShowPassword : image} alt="" />
        </button>
      )}

      {error && <span className="invalid-feedback text-danger d-block mt-1">{error}</span>}
    </div>
  )
}

export default InputField
