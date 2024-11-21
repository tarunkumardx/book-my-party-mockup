/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import * as yup from 'yup'
import { useFormik } from 'formik';
import { Button, InputField } from '@/stories/form-inputs';
import { toast } from 'react-toastify';
import { amountFormat, closeModal } from '@/utils/helpers';
import ReactDatePicker from 'react-datepicker';
import { _Object } from '@/utils/types';
import PhoneNumberField from '../phone-number-field';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const EnquireNow = ({router, props, minPax, maxPax}:_Object) => {
	console.log()
	const [loading, setLoading] = useState<boolean>(false)
	const formik = useFormik({
		initialValues: {
			input_1: router.query.types, // types
			input_3: props?.data?.title, // title
			input_4: '', // username
			input_5: '', // emailId
			input_6: '', // phoneNo
			input_7: '', // budget
			input_8: '', // occassion
			input_9: '', // guests
			input_10: router.query.types != 'caterers' ? props?.data?.extraOptions?.address?.address : '', // location
			input_11: '', //date
			input_12: '', // menu
			input_13: '', // drinks
			venueOwnerEmail: props?.data?.venueOwnerEmail
		},

		enableReinitialize: true,

		validationSchema: yup.object().shape({
			input_1: yup.string(),
			input_4: yup.string().label('Name').required('Name is required'),
			input_5: yup.string().label('Email').required('Email is required'),
			input_6: yup.number().label('Phone').required('Phone number is required').min(10, 'Phone number must be at least 10 digits'),
			input_7: yup.string().label('Per Person Budget').required('Budget is required'),
			input_8: yup.string().label('Occasions').required('Occasion is required'),
			input_9: yup.number().label('Number of guest').required('Number of guest is required').min(minPax, `Minimum ${minPax} guests required`).max(maxPax, `Maximum ${maxPax} guests are allowed`),
			input_10: router.query.types ==='caterers' ? yup.string().label('Locations').required('Location is required') : yup.string().notRequired(),
			input_11: yup.string().label('Date').required('Date is required'),
			input_12: yup.string().label('Menu').required('Menu is required'),
			input_13: yup.string().label('Drinks').required('Drinks are required')
		}),

		onSubmit: async (values) => {
			setLoading(true)
			const domain = new URL(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}`).hostname;
			const response = await fetch(`https://${domain}/wp-json/gf/v2/forms/15/submissions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(values)
			});

			const result = await response.json()

			if (result.is_valid) {
				// emailjs
				// 	.send(`${process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID}`, `${process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID}`, values, `${process.env.NEXT_PUBLIC_EMAILJS_USER_ID}`)
				// 	.then((response) => {
				// 		console.log('Email sent successfully!', response.status, response.text);
				// 	})
				// 	.catch((err) => {
				// 		console.error('Failed to send email. Error:', err);
				// 	});

				try {
					const response = await fetch('http://localhost:8000/submit-form', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(values)
					});

					const data = await response.json();

					if (response.ok) {
						toast.success('Thank you for your submission. We will review your details and get back to you shortly.');
						console.log({ success: true, message: 'Emails sent successfully!' });
					} else {
						toast.error('Something went wrong. Please try again later.');
						console.log({ success: false, message: data.message || 'An error occurred' });
					}
				} catch (error) {
					console.log({ success: false, message: `Failed to connect to the server ${error}` });
				}
				setLoading(false)
				// toast.success(React.createElement('div', { dangerouslySetInnerHTML: { __html: result.confirmation_message } })); // Use React.createElement instead
				formik.resetForm();
				closeModal('EnquireNow');
			} else {
				setLoading(false)
			}
		}
	})

	const budgets = [
		{ label: `${amountFormat('600', 'number')}-${'800'}`, value: 'Rs 600-800' },
		{ label: `${amountFormat('800', 'number')}-${'1000'}`, value: 'Rs 800-1000' },
		{ label: `${amountFormat('1000', 'number')}-${'1200'}`, value: 'Rs 1000-1200' },
		{ label: `${amountFormat('1200', 'number')}-${'1400'}`, value: 'Rs 1200-1400' },
		{ label: `${amountFormat('1400', 'number')}-${'1600'}`, value: 'Rs 1400-1600' },
		{ label: `${amountFormat('1600', 'number')}-${'1800'}`, value: 'Rs 1600-1800' },
		{ label: `${amountFormat('1800', 'number')}-${'2000'}`, value: 'Rs 1800-2000' },
		{ label: `${amountFormat('2000', 'number')}-${'2200'}`, value: 'Rs 2000-2200' },
		{ label: `${amountFormat('2200', 'number')}-${'2400'}`, value: 'Rs 2200-2400' },
		{ label: `${amountFormat('2400', 'number')}-${'2600'}`, value: 'Rs 2400-2600' },
		{ label: `${amountFormat('2600', 'number')}-${'2800'}`, value: 'Rs 2600-2800' },
		{ label: `${amountFormat('2800', 'number')}-${'3000'}`, value: 'Rs 2800-3000' }
	]

	const menu = [
		{label: 'Veg', value: 'veg'},
		{label: 'Non Veg', value: 'non-veg'}
	]

	const drinks = [
		{label: 'Mocktail', value: 'mocktail'},
		{label: 'Cocktail', value: 'cocktail'}
	]

	return (
		<div className="modal fade" id="EnquireNow" tabIndex={-1} aria-labelledby="EnquireNowLabel" aria-hidden="true">
			<div className="modal-dialog">
				<div className="modal-content">
					<button onClick={() => formik.resetForm()} type="button" className="btn border-0 modal-close" data-bs-dismiss="modal" aria-label="Close">
						X
					</button>
					<div className="modal-body">
						<h3 className="justify-center">
							Enquire Now
						</h3>
						<form className="row" onSubmit={formik.handleSubmit}>
							<InputField
								type="text"
								className="col-12"
								placeholder="Name"
								name="input_4"
								required={true}
								value={formik.values.input_4}
								onChange={formik.handleChange}
								error={formik.touched.input_4 && formik.errors.input_4}
							/>
							<InputField
								className="col-12 col-md-6"
								placeholder="Email"
								type="email"
								name="input_5"
								required={true}
								value={formik.values.input_5}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.input_5 && formik.errors.input_5}
							/>

							<PhoneNumberField
								args={{
									className: 'col',
									country: 'in',
									// label: 'Phone',
									value: formik.values.input_6 || '+91',
									onChange: (phone: string) => formik.setFieldValue('input_6', phone),
									error: formik.touched.input_6 && formik.errors.input_6
								}}
							/>
							<div className="form-group col-12 col-md-6 EnquireNowDropdown">
								<DropdownButton
									title={formik.values.input_8 || 'Select Occasion'}
									onSelect={(label: string | null) => {
										formik.setFieldValue('input_8', label)
									}}
								>
									{props.occasions.map((occasion:_Object) => (
										<Dropdown.Item key={occasion.slug} eventKey={occasion.name}>
											{occasion.name}
										</Dropdown.Item>
									))}
								</DropdownButton>
								{formik.errors.input_8 && formik.touched.input_8 && (
									<div className="invalid-feedback text-danger d-block mt-1">{formik.errors.input_8}</div>
								)}
							</div>
							<div className="form-group mb-3 col-12 col-md-6 plan-your-date">
								<ReactDatePicker
									name="input_11"
									placeholderText="Select Event Date"
									selected={formik?.values?.input_11 ? new Date(formik.values.input_11) : null}
									onChange={(date: Date) => { formik.setFieldValue('input_11', date) }}
									minDate={new Date()}
									dateFormat="dd/MM/YYYY"
								/>
								<p className="invalid-feedback text-danger d-block mt-1" style={{fontSize: '0.875em'}}>
									{formik.touched.input_11 && formik.errors.input_11}
								</p>
							</div>

							<InputField
								className="col-12 col-md-6"
								placeholder="Number of Guests"
								// label="No. of Guest"
								name="input_9"
								type="number"
								required={true}
								value={formik.values.input_9}
								onChange={formik.handleChange}
								error={formik.touched.input_9 && formik.errors.input_9}
							/>

							<div className="form-group col-12 col-md-6 EnquireNowDropdown">
								<DropdownButton
									title={formik.values.input_7 || 'Select Budget Range'}
									onSelect={(label: string | null) => {
										formik.setFieldValue('input_7', label)
									}}
								>
									{budgets.map((budget) => (
										<Dropdown.Item key={budget.value} eventKey={budget.label}>
											{budget.label}
										</Dropdown.Item>
									))}
								</DropdownButton>
								{formik.errors.input_7 && formik.touched.input_7 && (
									<div className="invalid-feedback text-danger d-block mt-1">{formik.errors.input_7}</div>
								)}
							</div>

							<div className="form-group col-12 col-md-6 EnquireNowDropdown">
								<DropdownButton
									title={formik.values.input_12 || 'Menu'}
									onSelect={(label: string | null) => {
										formik.setFieldValue('input_12', label)
									}}
								>
									{menu.map((menu) => (
										<Dropdown.Item key={menu.value} eventKey={menu.label}>
											{menu.label}
										</Dropdown.Item>
									))}
								</DropdownButton>
								{formik.errors.input_12 && formik.touched.input_12 && (
									<div className="invalid-feedback text-danger d-block mt-1">{formik.errors.input_12}</div>
								)}
							</div>
							<div className="form-group col-12 col-md-6 EnquireNowDropdown">
								<DropdownButton
									title={formik.values.input_13 || 'Drinks'}
									className={formik.errors.input_13 && 'invalid'}
									onSelect={(label: string | null) => {
										formik.setFieldValue('input_13', label)
									}}
								>
									{drinks.map((drink) => (
										<Dropdown.Item key={drink.value} eventKey={drink.label}>
											{drink.label}
										</Dropdown.Item>
									))}
								</DropdownButton>
								{formik.errors.input_13 && formik.touched.input_13 && (
									<div className="invalid-feedback text-danger d-block mt-1">{formik.errors.input_13}</div>
								)}</div>

							{router.query.types ==='caterers' && <>
								<InputField
									className="col-12"
									placeholder="Provide your location"
									type="text"
									name="input_10"
									required={true}
									value={formik.values.input_10}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.input_10 && formik.errors.input_10}
								/>
							</>
							}
							<center style={{display: 'flex', justifyContent:'center'}}>
								<div className="text-center mt-lg-3 mt-md-2 mt-2 ps-lg-2 ps-md-0 ps-0">
									<Button type="submit" loading={loading} label="Submit"
									/>
								</div>
							</center>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EnquireNow