import React, { useState, useEffect, useRef, useId } from 'react';
import { _Object } from '@/utils/types';
import Select, { StylesConfig } from 'react-select';
import Image from 'next/image';

const SelectField = ({ name, value, onChange, disabled, onBlur, imageSize = 17, options, getOptionLabel, getOptionValue, label, required, imageSrc, placeholder = 'Choose option', error, className = '', isSearchable = true, ...props }: _Object) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const isSelected = () => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      const flag = Object.keys(value)[0];
      if (options && options[0]?.options) {
        return options[0]?.options?.filter(
          (item: { [key: string]: string | number }) => value[flag].includes(item[flag])
        );
      } else {
        return options && options?.filter(
          (item: { [key: string]: string | number }) => value[flag] === item[flag]);
      }
    }
    return value;
  };

  const customStyles: StylesConfig = {
    control: (provided: Record<string, unknown>) => ({
      ...provided,
      border: error && '1px solid #FF0000'
    })
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderOptionLabel: any = (option: any) => (
    <div className="icon">
      {option.icon && <Image src={option.icon} width={imageSize} height={imageSize} alt="" />}{'  '}
      {getOptionLabel && getOptionLabel(option)}
    </div>
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={selectRef} className={`form-group mb-3 ${className} ${error ? 'invalid' : ''} ${isDropdownOpen ? 'active' : ''}`} onClick={toggleDropdown}>
      {label && (
        <label className="label-form mb-1">
          {label} {required && <span className="text-danger">*</span>}
          {imageSrc && <Image src={imageSrc} alt="Image" width={20} height={20} style={{ marginLeft: '25px' }} />}
        </label>
      )}
      <>
        {
          isSearchable ?
            <Select
              className={'react-dropdown'}
              classNamePrefix="react-select"
              styles={customStyles}
              name={name}
              placeholder={placeholder}
              isDisabled={disabled}
              options={options}
              value={isSelected()}
              onChange={onChange}
              onBlur={onBlur}
              getOptionLabel={renderOptionLabel}
              getOptionValue={getOptionValue}
              menuIsOpen={isDropdownOpen}
              instanceId={useId()}
              {...props}
            />
            :
            <Select
              className={'react-dropdown'}
              classNamePrefix="react-select"
              styles={customStyles}
              name={name}
              placeholder={placeholder}
              isDisabled={disabled}
              options={options}
              value={isSelected()}
              onChange={onChange}
              onBlur={onBlur}
              getOptionLabel={renderOptionLabel}
              getOptionValue={getOptionValue}
              menuIsOpen={isDropdownOpen}
              onMenuOpen={toggleDropdown}
              onMenuClose={toggleDropdown}
              instanceId={useId()}
              {...props}
            />
        }
      </>
      {error && <span className="invalid-feedback text-danger d-block mt-1">{error}</span>}
    </div>
  );
}

export default SelectField;
