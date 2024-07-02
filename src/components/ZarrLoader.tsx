import React, { useEffect, useState } from 'react'

import { HTTPStore, openArray } from "zarr";
import {slice as zarrSlice}  from "zarr";

const baseURL = 'http://localhost:5173/SeasFireCube_v3.zarr'

const ZarrLoader = ({variable,setData,setMeta,slice}) => {
  const timeStart = slice.min
  const timeEnd = slice.max

  useEffect(()=>{
    if (!variable){return}
    const store = new HTTPStore(baseURL)
    const fullPath = `${baseURL}/${variable}/.zattrs`;
    fetch(fullPath)
      .then(res => res.json())
      .then(data=>{
        setMeta(data)
      })

    openArray({ store: store, path: variable })
      .then((zarrArray) => {
        return zarrArray.get([zarrSlice(timeStart,timeEnd), null,null]); //Dims are Z,Y,X
      })
      .then((data) => {
        // You can assign the data to a variable here
        setData(data)
      })
      .catch((error) => {
        console.error(error);
      });

  },[variable,slice])

  return (
    <></>
  )
}

export default ZarrLoader
