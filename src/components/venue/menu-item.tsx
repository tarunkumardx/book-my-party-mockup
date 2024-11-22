import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import Link from 'next/link';
import { Button } from '@/stories/form-inputs';
import { RootState, _Object } from '@/utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/router';
import { venueData } from '@/redux/slices/venue.slice';
import CreateMenuItem from '../modals/create-menu-item';
import { listService } from '@/services/venue.service';
import Loading from '../loading';

const MenuItem = ({ props }: _Object) => {
  const router: _Object = useRouter();

  const dispatch = useDispatch<AppDispatch>()
  const { venueState } = useSelector((state: _Object) => state.venueDetails);
  const { loggedInUser } = useSelector((state: RootState) => state.session);

  const [initialData, setInitialData] = useState<_Object>({
    menuItems: venueState?.menuItems || []
  });
  const [venueMenuItems, setVenueMenuItems] = useState<_Object>([])
  const [loading, setLoading] = useState(false)
  const [loadingMenu, setLoadingMenu] = useState(false)

  useEffect(() => {
    if (venueState?.title?.length === 0 || !venueState?.title) {
      router.push(router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create')
    }
    setLoadingMenu(true)
    async function name() {
      const authors = await listService.authorsList()

      const authorIds = authors?.map((item: _Object) => parseInt(item.id));
      const loggedInUserId = loggedInUser?.databaseId;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mergedArray: any = [...authorIds];

      if (loggedInUserId !== undefined && loggedInUserId !== null) {
        mergedArray.push(loggedInUserId);
      }
      const venueMenuItems = await listService.getVenueMenuItems(mergedArray)
      if (venueMenuItems) {
        setVenueMenuItems(venueMenuItems)
        setLoadingMenu(false)
      }
    }

    name()
  }, [loading])

  const formik = useFormik({
    initialValues: initialData,

    enableReinitialize: true,

    onSubmit: async (values: _Object) => {
      dispatch(venueData({ ...venueState, menuItems: values.menuItems }))

      props.setSteps((prev: _Object) => ({
        ...prev,
        step5: true
      }))

      router.push({
        pathname: router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create',
        query: 'step=5'
      })
    }
  })

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>, category: string, subCategory: string, item: string) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      // Checkbox is checked
      const index = initialData.menuItems.findIndex((item: _Object) => item.item_subcategory === subCategory);

      if (index !== -1) {
        // Subcategory already exists, add item to its list
        setInitialData(prev => ({
          ...prev,
          menuItems: [
            ...initialData.menuItems.slice(0, index),
            {
              item_category: category,
              item_subcategory: subCategory,
              items: [...initialData.menuItems[index].items, item]
            },
            ...initialData.menuItems.slice(index + 1)
          ]
        }));
      } else {
        // Subcategory doesn't exist, create it with the item
        setInitialData(prev => ({
          ...prev,
          menuItems: [...initialData.menuItems, { item_category: category, item_subcategory: subCategory, items: [item] }]
        }));
      }
    } else {
      // Checkbox is unchecked
      const index = initialData.menuItems.findIndex((item: _Object) => item.item_subcategory === subCategory);

      if (index !== -1) {
        // Subcategory exists, remove item from its list if it exists
        const itemIndex = initialData.menuItems[index].items.indexOf(item);
        if (itemIndex !== -1) {
          setInitialData(prev => ({
            ...prev,
            menuItems: [
              ...initialData.menuItems.slice(0, index),
              {
                ...initialData.menuItems[index],
                items: [
                  ...initialData.menuItems[index].items.slice(0, itemIndex),
                  ...initialData.menuItems[index].items.slice(itemIndex + 1)
                ]
              },
              ...initialData.menuItems.slice(index + 1)
            ]
          }));
        }
      }
    }
  }

  const backButton = () => {
    dispatch(venueData({ ...venueState, menuItems: formik.values.menuItems }))
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="card">
          <div className="card-body">
            {
              loadingMenu ?
                <div className="justify-content-center d-flex">
                  <Loading />
                </div>
                :
                <>
                  <div className="justify-content-end d-flex">
                    <Link href="" data-bs-toggle="modal" data-bs-target="#createMenuItemModal" className="text-decoration-none">
											+ Add New
                    </Link>
                  </div>
                  <>
                    {
                      venueMenuItems?.map((item: _Object, i: number) => {
                        return (
                          <div key={i}>
                            {item?.children?.nodes?.length > 0 && (
                              <h4 className="mb-3 text-uppercase">{item.name}</h4>
                            )}
                            <div className="row row-cols-1 row-cols-xl-4">
                              {item?.children?.nodes?.map((children: _Object, j: number) => {
                                return (
                                  <div key={j} className="col">
                                    <div className="form-group mb-30">
                                      <label className="form-label title-list">
                                        <strong>{children.name}</strong>
                                      </label>
                                      {children?.foodMenuItems?.nodes?.map((option: _Object, k: number) => {
                                        const index = initialData?.menuItems?.findIndex((subCategoryItem: _Object) => subCategoryItem.item_subcategory == children.databaseId)
                                        return (
                                          <div key={k} className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              value={formik?.values?.menuItems}
                                              id={`checkbox-${i}-${j}-${k}`}
                                              checked={initialData?.menuItems[index]?.items?.includes(option.databaseId)}
                                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { handleCheckbox(e, item.databaseId, children.databaseId, option.databaseId) }}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor={`checkbox-${i}-${j}-${k}`}
                                            >
                                              {option.title}
                                            </label>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )
                      })
                    }

                  </>
                </>
            }
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3 continue-btn">
          <Link onClick={() => backButton()} href={router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}?step=3` : '/dashboard/venues/create?step=3'} className="btn btn-primary">Back</Link>
          <Button type="submit" label="Continue" className="btn btn-primary" />
        </div>
      </form>
      {venueMenuItems?.length > 0 && <CreateMenuItem props={venueMenuItems} setState={setLoading} state={loading} />}
    </>
  )
}

export default MenuItem