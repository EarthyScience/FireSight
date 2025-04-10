import * as zarr from "zarrita";

function GetZarrVariables(obj: Object) {
	//Parses out variables in a Zarr group for variable list
    const result = [];
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const item = obj[key];
            if (item.path && 
                item.path.length > 1 && 
                item.kind === 'array') {
                result.push(item.path.substring(1));
            }
        }
    }
    
    return result;
}

async function GetVariables(storePath: string){
	const d_store = zarr.tryWithConsolidated(
		new zarr.FetchStore(storePath)
	);
	const group = await d_store.then(store => zarr.open(store, {kind: 'group'}))
	return GetZarrVariables(group.store.contents())
}

async function GetArray(storePath: string, variable: string ){
	const d_store = zarr.tryWithConsolidated(
		new zarr.FetchStore(storePath)
	);
	//Will need to add dependencies in here to check if it is a group or direct array
	const group = await d_store.then(store => zarr.open(store, {kind: 'group'}))
	const outVar = await zarr.open(group.resolve(variable), {kind:"array"})
	
	const arr = await zarr.get(outVar)

	return arr	

}

//For now we export variables. But we will import these functions over to the plotting component eventually
export const variables = await GetVariables("https://s3.bgc-jena.mpg.de:9000/esdl-esdc-v3.0.2/esdc-16d-2.5deg-46x72x1440-3.0.2.zarr")

export const arr = GetArray("https://s3.bgc-jena.mpg.de:9000/esdl-esdc-v3.0.2/esdc-16d-2.5deg-46x72x1440-3.0.2.zarr","burnt_area")

//export const arr = await myVar.get();

// console.log(d_store)

// const local_store = new zarr.FetchStore("http://localhost:5173/GlobalForcingTiny.zarr");
// ! note that for local dev you only use `http` without the `s`.
// ? log a file with proper metadata, set consolidated=true when saving your zarr file
// export const local_node = await zarr.open.v2(local_store);
// export const arr = await zarr.open(local_node.resolve("t2m"), { kind: "array" });
// console.log(local_node)