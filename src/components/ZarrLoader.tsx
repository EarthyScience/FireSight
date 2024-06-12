import React, { useEffect, useState } from 'react'

import { HTTPStore, openArray } from "zarr";

import {slice as zarrSlice}  from "zarr";

const ZarrLoader = ({variable,setData,slice}) => {
  useEffect(()=>{
    if (!variable){return}
    const store = new HTTPStore('http://localhost:5173/Datasets/seasfire.zarr')
    openArray({ store: store, path: variable })
      .then((zarrArray) => {
        return zarrArray.get([zarrSlice(0,5), null,null]);
      })
      .then((data) => {
        // You can assign the data to a variable here
        setData(data)
      })
      .catch((error) => {
        console.error(error);
      });

  },[variable])

  return (
    <></>
  )
}

export default ZarrLoader
