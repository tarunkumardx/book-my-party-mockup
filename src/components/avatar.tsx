import React from 'react'
type data={
  data:string
}
const Avatar = ({ data }: data) => {
  const matches = data?.match(/\b(\w)/g)
  const avtar = matches?.join('').toUpperCase()

  return (
    <span className="avatar">{avtar}</span>
  )
}
export default Avatar
