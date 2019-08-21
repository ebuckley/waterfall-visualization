import React from 'react'
import loading from './assets/loading.svg'
export default function Loading () {
  return (
    <div className='spinner'>
      <img src={loading} alt='Loading' />
    </div>
  )
}
