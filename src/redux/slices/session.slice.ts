import { userProfileService } from '@/services/profile.service'
import { listService } from '@/services/venue.service'
import { _Object } from '@/utils/types'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import store from 'store'

const initialState = {
  cartData1: [],
  isUserLoggedIn: store.get(`${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY}`) ? true : false,
  sessionToken: store.get(`${process.env.NEXT_PUBLIC_SECESSION_TOKEN_KEY}`) ? true : false,
  loggedInUser: {},
  me: {},
  shrinkSidebar: true,
  userWishlist: [],
  amenities: [],
  cuisines: [],
  franchiseChain: [],
  locations: [],
  occasions: [],
  venueTypes: [],
  activities: [],
  ageGroups: [],
  venueMenuItems: [],
  propertyRules: []
}

export const setLoggedInUser = createAsyncThunk('setLoggedInUser', async () => {
  const loggedInUser = await userProfileService.getMe()
  return { loggedInUser }
})
export const setVenueTypes = createAsyncThunk('setVenueTypes', async () => {
  const venueTypes = await listService.getVenueTypes()
  return venueTypes
})

export const setActivities = createAsyncThunk('setActivities', async () => {
  const activities = await listService.getActivities()
  return activities
})

export const setAgeGroups = createAsyncThunk('setAgeGroups', async () => {
  const ageGroups = await listService.getAgeGroups()
  return ageGroups
})

export const setAmenities = createAsyncThunk('setAmenities', async () => {
  const amenities = await listService.getAmenities()
  return amenities
})

export const setCuisines = createAsyncThunk('setCuisines', async () => {
  const cuisines = await listService.getCuisines()
  return cuisines
})

export const setFranchiseChain = createAsyncThunk('setFranchiseChain', async () => {
  const franchiseChain = await listService.getFranchises()
  return franchiseChain
})

export const setLocations = createAsyncThunk('setLocations', async () => {
  const locations = await listService.getLocations()
  return locations
})

export const setOccasions = createAsyncThunk('setOccasions', async () => {
  const occasions = await listService.getOccasions()
  return occasions
})

export const setVenueMenuItems = createAsyncThunk('setVenueMenuItems', async (params: _Object) => {
  const venueMenuItems = await listService.getVenueMenuItems(params);
  return venueMenuItems
})

export const setPropertyRules = createAsyncThunk('setPropertyRules', async () => {
  const propertyRules = await listService.getPropertyRules();
  return propertyRules
})

export const getUserWishlist = createAsyncThunk('getUserWishlist', async () => {
  const wishlists = await listService.getVenueWsihlist()
  return wishlists
})

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    setAuthToken: (state, action) => {
      store.set(`${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY}` || '7FGzMoYvy7Zst3sJEQp', action.payload.authToken)
      store.set(`${process.env.NEXT_PUBLIC_ACCESS_TOKEN_REFRESH_KEY}` || '8FGzMoYvy7Zstyu3sJP', action.payload.refreshToken)
      state.isUserLoggedIn = true
    },

    destroyAuthSession: (state) => {
      store.clearAll()
      state.isUserLoggedIn = false
    },

    cartDataRedux: (state, action) => {
      state.cartData1 = action.payload
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(setLoggedInUser.fulfilled, (state, action) => {
        state.loggedInUser = action.payload.loggedInUser
      })
    builder
      .addCase(setAmenities.fulfilled, (state, action) => {
        state.amenities = action.payload
      })
    builder
      .addCase(setCuisines.fulfilled, (state, action) => {
        state.cuisines = action.payload
      })
    builder
      .addCase(setFranchiseChain.fulfilled, (state, action) => {
        state.franchiseChain = action.payload
      })
    builder
      .addCase(setLocations.fulfilled, (state, action) => {
        state.locations = action.payload
      })
    builder
      .addCase(setOccasions.fulfilled, (state, action) => {
        state.occasions = action.payload
      })
    builder
      .addCase(setVenueTypes.fulfilled, (state, action) => {
        state.venueTypes = action.payload
      })
    builder
      .addCase(setActivities.fulfilled, (state, action) => {
        state.activities = action.payload
      })
    builder
      .addCase(setAgeGroups.fulfilled, (state, action) => {
        state.ageGroups = action.payload
      })
    builder
      .addCase(setVenueMenuItems.fulfilled, (state, action) => {
        state.venueMenuItems = action.payload
      })
    builder
      .addCase(setPropertyRules.fulfilled, (state, action) => {
        state.propertyRules = action.payload
      })
    builder
      .addCase(getUserWishlist.fulfilled, (state, action) => {
        state.userWishlist = action.payload
      })
  }

})

export const { destroyAuthSession, setAuthToken, cartDataRedux } = sessionSlice.actions

export default sessionSlice.reducer