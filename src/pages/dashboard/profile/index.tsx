import React, { useState } from 'react';
import * as yup from 'yup'
import { useFormik } from 'formik';
import { DashboardLayout, PhoneNumberField, SEOHead } from '@/components';
import { Button, InputField } from '@/stories/form-inputs';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setLoggedInUser } from '@/redux/slices/session.slice';
import { _Object } from '@/utils/types';
import { userProfileService } from '@/services/profile.service';

type RootState = {
	session: {
		isUserLoggedIn: boolean;
		loggedInUser: _Object;
	};
};

const Profile = () => {
	const dispatch = useDispatch<AppDispatch>()

	const [loading, setLoading] = useState<boolean>(false)
	const { loggedInUser } = useSelector((state: RootState) => state.session);

	const formik = useFormik({
		initialValues: {
			firstName: loggedInUser.firstName,
			lastName: loggedInUser.lastName,
			email: loggedInUser.email,
			mobile_number: loggedInUser?.extraOptionsUser?.mobileNumber || ''
		},

		enableReinitialize: true,

		validationSchema: yup.object().shape({
			firstName: yup.string().label('firstName').required('Full Name is required'),
			lastName: yup.string().label('lastName').required('lastName is required'),
			email: yup.string().email().label('email').required('Email is required'),
			mobile_number: yup.string().label('Mobile Number').required('Mobile Number is required')
		}),

		onSubmit: async (values) => {
			setLoading(true)
			userProfileService.updateProfile(loggedInUser.id, values.firstName, values.lastName, values.email, values.mobile_number).then((result: _Object) => {
				if (result?.email) {
					toast.success('Your profile updated successfully')
					dispatch(setLoggedInUser())
					// formik.resetForm();
					setLoading(false)
				} else {
					setLoading(false)
				}
			})
		}
	})

	return (
		<DashboardLayout>
			<SEOHead seo={{ title: 'My Profile - Book My Party' } || ''} />

			<div className="col-lg-4 profile-wrap">
				<h1 className="mb-3">Profile</h1>

				<form onSubmit={formik.handleSubmit}>
					<InputField
						type="text"
						label="First Name"
						name="firstName"
						placeholder="First Name"
						required={true}
						value={formik.values.firstName}
						onChange={formik.handleChange}
						error={formik.touched.firstName && formik.errors.firstName}
					/>

					<InputField
						type="text"
						label="Last Name"
						name="lastName"
						placeholder="Last Name"
						required={true}
						value={formik.values.lastName}
						onChange={formik.handleChange}
						error={formik.touched.lastName && formik.errors.lastName}
					/>

					<InputField
						label="Email"
						name="email"
						placeholder="Email"
						type="email"
						required={true}
						value={formik.values.email}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.email && formik.errors.email}
						readOnly
					/>

					<div className={'form-group mb-3'}>
						<label className="label-form mb-1">
							Mobile Number <span className="text-danger">*</span>
						</label>

						<PhoneNumberField
							args={{
								country: 'in',
								value: formik.values.mobile_number || '',
								onChange: (phone: string) => formik.setFieldValue('mobile_number', phone),
								error: formik.touched.mobile_number && formik.errors.mobile_number
							}}
						/>
					</div>

					<Button className="btn btn-primary mb-3" type="submit" label="Update Profile" loading={loading} />
				</form>
			</div>
		</DashboardLayout>
	)
}

export default Profile