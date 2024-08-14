import React, { useState } from 'react';
import { toast } from 'react-toastify';

import Link from 'next/link';

import * as yup from 'yup'
import { useFormik } from 'formik';

import { authService } from '@/services/session.service';

import { Button, InputField } from '@/stories/form-inputs';

import { closeModal } from '@/utils/helpers';
import { mail, modalClose } from '@/assets/images';
import Image from 'next/image';

const ResetPasswordModal = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      username: ''
    },

    validationSchema: yup.object().shape({
      username: yup.string().email().label('Email').required('Email is required')
    }),

    onSubmit: async (values) => {
      setLoading(true)
      const response = await authService.forgotPassword(values.username)
      if (response.success) {
        closeModal('ResetPasswordModal')
        formik.resetForm();
        toast.success('Send your email reset password link.')
      }
      setLoading(false)
    }
  })

  return (
    <div className="modal fade" id="ResetPasswordModal" tabIndex={-1} aria-labelledby="ResetPasswordModal" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">

            <h3 className="justify-between mb-0">
							Reset Password
              <button type="button" onClick={() => formik.resetForm()} className="btn border-0 modal-close" data-bs-dismiss="modal" aria-label="Close">
                <Image src={modalClose} alt="" />
              </button>
            </h3>
            <p>Enter the e-mail address associated with the account. <br />
							We&#39;ll e-mail a link to reset your password.</p>
            <form onSubmit={formik.handleSubmit}>
              <InputField
                placeholder="Email"
                image={mail}
                name="username"
                type="email"
                required={true}
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.errors.username}
              />
              <div className="btn-login">
                <Button type="submit" label="Send Reset Link" className="primary w-100" loading={loading} disabled={loading}
                />
              </div>
              <Link href="#" onClick={() => formik.resetForm()} className="btn border-0 py-0" data-bs-toggle="modal" data-bs-target="#LoginModal">
								Back to log in
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordModal