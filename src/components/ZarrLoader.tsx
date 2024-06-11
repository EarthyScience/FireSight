import React, { useEffect, useState } from 'react'

import { HTTPStore, openArray, slice } from "zarr";

const ZarrLoader = ({variable,setter,slice}) => {
  const [store, setStore] = useState()
  console.log(variable)
  useEffect(()=>{
    if (!variable){return}
    console.log(variable)
    let data = null
    const store = new HTTPStore('http://localhost:5173/Datasets/seasfire.zarr')
    const z = openArray({ store: store, path: 'cams_co2fire' }).then(
      (e)=>e.get(0).then((d)=>{
        data = d;
        console.log(data)}
      }

        
      )

      }

    
    )
  },[variable])

  return (
    <></>
  )
}

export default ZarrLoader
