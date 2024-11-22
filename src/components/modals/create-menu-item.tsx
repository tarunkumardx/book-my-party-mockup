import React, { useEffect, useState } from 'react';
import { RootState, _Object } from '@/utils/types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import SelectField from '@/stories/form-inputs/select-field';
import { Button, InputField } from '@/stories/form-inputs';
import { listService } from '@/services/venue.service';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import useIsSearchable from '../useIsSearchable';

const CreateMenuItem = ({ props, setState, state }: _Object) => {
  const isSearchable = useIsSearchable();

  const [loading, setLoading] = useState<boolean>(false)
  const [category, setCategory] = useState<_Object>([])
  const [subCategory, setSubCategory] = useState<_Object>([])
  const { loggedInUser } = useSelector((state: RootState) => state.session);

  useEffect(() => {
    const data = props.filter((item: _Object) => item.children.nodes.length > 0)
    setCategory(data)
  }, []);

  const formik = useFormik({
    initialValues: {
      category: '',
      subCategory: '',
      title: ''
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      category: yup.string().label('Category').required(),
      subCategory: yup.string().label('SubCategory').required(),
      title: yup.string().label('title').required()
    }),
    onSubmit: async (values: _Object) => {
      setLoading(true)
      const result = await listService.createVenueMenueItem(values.category, values.subCategory, loggedInUser?.databaseId || 1, values.title)
      if (result?.title) {
        formik.resetForm();
        setState(!state)
        setLoading(false)
        toast.success('Menu Item added successfully')
        const modelId = document.getElementById('createMenuItemModal-id')
        if (modelId) {
          modelId.click()
        }
      } else {
        setLoading(false)
      }
    }
  });

  return (
    <div className="modal fade" id="createMenuItemModal" tabIndex={-1} aria-labelledby="createMenuItemModal" aria-hidden="true">
      <div className="modal-dialog">
        <form onSubmit={formik.handleSubmit} className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="createMenuItemModal">New Menu Item</h1>
            <button type="button" id="createMenuItemModal-id" onClick={() => formik.resetForm()} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">

            <SelectField
              className="col-12"
              label="Category"
              placeholder="Choose Category"
              name="category"
              required={true}
              value={{ value: formik.values.category }}
              options={category?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
              onChange={(val: _Object) => {
                formik.setFieldValue('category', val.value)
                setSubCategory(category.find((item: _Object) => item.slug === val.value)?.children?.nodes || [])
              }}
              isSearchable={isSearchable}
              getOptionLabel={(option: { [key: string]: string }) => option?.label}
              getOptionValue={(option: { [key: string]: string }) => option?.label}
              error={formik.touched.category && formik.errors.category}
            />

            <SelectField
              className="col-12"
              label="SubCategory"
              placeholder="Choose SubCategory"
              name="subCategory"
              required={true}
              value={{ value: formik.values.subCategory }}
              options={subCategory?.map((item: _Object) => { return { label: item.name, value: item.slug } }) || []}
              onChange={(val: _Object) => {
                formik.setFieldValue('subCategory', val.value)
              }}
              isSearchable={isSearchable}
              getOptionLabel={(option: { [key: string]: string }) => option?.label}
              getOptionValue={(option: { [key: string]: string }) => option?.label}
              error={formik.touched.subCategory && formik.errors.subCategory}
            />

            <InputField
              label="Title"
              className="col-12"
              placeholder="Title"
              type="text"
              name="title"
              required={true}
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && formik.errors.title}
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={() => formik.resetForm()} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <Button type="submit" label="Create" loading={loading} disabled={loading} className="btn btn-primary" />
          </div>

        </form>
      </div>
    </div >
  )
}

export default CreateMenuItem