// import { HTTPStore, openArray, slice } from "zarr";
// const url = 'http://localhost:5173/SeasFire_subset.zarr'
// const newStore = new HTTPStore(url)
// const xyzVals = await openArray({ store: newStore, path: "ws10" });
// // fetch the metadata 
// // const meta = await fetch(url + '/.zgroup').then(res => res.json());
// const TestData = () => (
//     // Array(3) [ 46, 720, 1440 ] -> Time, lat, lon
//     // console.log(xyzVals.shape)
//     console.log(xyzVals.get([0, slice(0,10), slice(0,10)]))
//     // console.log(meta)
// );

// export default TestData;