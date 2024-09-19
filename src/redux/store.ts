import { configureStore } from '@reduxjs/toolkit'
import sessionSlice from './slices/session.slice'
import venueSlice from './slices/venue.slice'

const store = configureStore({
  reducer: {
    session: sessionSlice,
    venueDetails: venueSlice
  }
})
console.log(store)

export default store

export type RootState = ReturnType<typeof store.getState> // Infer the `RootState` and `AppDispatch` types from the store itself

export type AppDispatch = typeof store.dispatch // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}