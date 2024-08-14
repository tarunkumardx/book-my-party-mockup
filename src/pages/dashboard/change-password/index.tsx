import React, { useState } from 'react';
import * as yup from 'yup'
import { useFormik } from 'formik';
import { DashboardLayout, SEOHead } from '@/components';
import { Button, InputField } from '@/stories/form-inputs';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { RootState, _Object } from '@/utils/types';
import { userProfileService } from '@/services/profile.service';
import { toast } from 'react-toastify';
import { setLoggedInUser } from '@/redux/slices/session.slice';

const ForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>()

  const [loading, setLoading] = useState<boolean>(false)
  const { loggedInUser } = useSelector((state: RootState) => state.session);

  const formik = useFormik({
    initialValues: {
      new_password: '',
      confirm_password: ''
    },

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      new_password: yup
        .string()
        .label('New Password')
        .required('New Password is required')
        .min(8, 'Minimum password length is 8 characters'),
      confirm_password: yup
        .string()
        .label('Confirm Password')
        .required('Confirm Password is required')
        .oneOf([yup.ref('new_password'), ''], 'Passwords must match')
        .min(8, 'Minimum password length is 8 characters')
    }),

    onSubmit: async (values) => {
      setLoading(true)
      userProfileService.updatePassword(loggedInUser.id, values.new_password).then((result: _Object) => {
        if (result?.email) {
          toast.success('User password updated successfully')
          dispatch(setLoggedInUser())
          formik.resetForm();
          setLoading(false)
        } else {
          setLoading(false)
        }
      })
    }
  })
  return (
    <DashboardLayout>
      <SEOHead seo={{ title: 'Change Password - Book My Party' } || ''} />

      <div className="col-lg-4 change-password-wrap">
        <h1 className="mb-3">Change Password</h1>

        <form onSubmit={formik.handleSubmit}>
          <InputField
            label="New Password"
            placeholder="New Password"
            name="new_password"
            required={true}
            value={formik.values.new_password}
            onChange={formik.handleChange}
            error={formik.touched.new_password && formik.errors.new_password}
          />

          <InputField
            label="Confirm Password"
            placeholder="Confirm Password"
            name="confirm_password"
            required={true}
            value={formik.values.confirm_password}
            onChange={formik.handleChange}
            error={formik.touched.confirm_password && formik.errors.confirm_password}
          />

          <Button className="btn btn-primary mb-3" type="submit" label="Update Password" loading={loading} />
        </form>
      </div>
    </DashboardLayout >
  )
}

export default ForgotPassword