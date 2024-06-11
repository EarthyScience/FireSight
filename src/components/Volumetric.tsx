import { HTTPStore, openArray, slice } from "zarr";
const url = 'http://localhost:5173/SeasFireCube_v3.zarr'

// fetch the metadata 
const meta = await fetch(url + '/.zgroup').then(res => res.json());
console.log(meta)

const newStore = new HTTPStore(url)
// const xyzVals = await openArray({ store: newStore, path: "ws10" });
