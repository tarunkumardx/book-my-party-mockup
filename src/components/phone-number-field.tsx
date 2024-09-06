import { _Object } from '@/utils/types';
import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneNumberField = ({ args }: _Object) => {
  const [phoneNumber, setPhoneNumber] = useState<string>(args.value);

  const handleChange = (phone: string, country: _Object) => {
    const isIndia = country.countryCode === 'in';
    const maxLength = isIndia ? 12 : 16; // 12 for India, 16 for general case

    if (phone.length <= maxLength) {
      setPhoneNumber(phone);
      args.onChange(phone, country);
    }
  };

  const handleKeyPress = (e: _Object) => {
    const isIndia = args.country === 'in';
    const maxLength = isIndia ? 12 : 16; // 12 for India, 16 for general case

    if (phoneNumber.length >= maxLength && ![8, 46, 37, 38, 39, 40].includes(e.keyCode)) {
      e.preventDefault();
    }
  };
  return (
    <div className={`form-group mb-3 ${args?.className}`}>
      {args.label && (
        <label className="form-label">
          {args.label} {args.required && <span className="text-danger">*</span>}
        </label>
      )}

      <PhoneInput
        country={args.country}
        onlyCountries={['in']}
        autoFormat={false} // Auto format is set to false
        inputClass="invalid"
        value={args.value}
        onChange={handleChange}
        onKeyDown={handleKeyPress} // Add onKeyDown to handle key press events
        disabled={args.disabled}
        placeholder={args.placeholder ? args.placeholder : 'Enter mobile number'}
      />
      {args.error && (
        <span className="invalid-feedback text-danger d-block mt-1">
          {args.error}
        </span>
      )}
    </div>
  );
};

export default PhoneNumberField;
