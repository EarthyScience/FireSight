import { HTTPStore, openArray, slice } from "zarr";
const url = 'http://localhost:5173/SeasFireCube_v3.zarr'

// fetch the metadata 
export const meta = await fetch(url + '/.zgroup').then(res => res.json());
console.log(meta)

const newStore = new HTTPStore(url)
console.log(newStore)

// const xyzVals = await openArray({ store: newStore, path: "ws10" });
