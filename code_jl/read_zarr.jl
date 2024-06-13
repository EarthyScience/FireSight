using YAXArrays, Zarr, DimensionalData
using YAXArrayBase
using JSON3
using Random

sds = open_dataset("./public/SeasFireCube_v3.zarr")
ds = Zarr.zopen("./public/SeasFireCube_v3.zarr", consolidated=true)

# ws10 = sds["ws10"]
# ws10.chunks

# dschunked = setchunks(ws10, Dict("Ti"=>46))

# dschunked_all = setchunks(sds, Dict("Ti"=>46))
#savedataset(dschunked_all, path=f, driver=:zarr)


dschunked.chunks

ws10_2 = sds["ws10"]

ks = string.(keys(ds.arrays))
ks = setdiff!(ks, ["time", "longitude", "latitude"])

function getAllDims(sds, ks)
    all_dims = []
    for k in ks
        tmp_ks = dims(sds[k])
        if tmp_ks ∉ all_dims
            push!(all_dims, tmp_ks)
        end
    end
    return [d for d in all_dims]
end

allDims = getAllDims(sds, ks)
# just to make sure that we only have 3 different kinda of axes.
#
function getClusteredVars(sds, ks)
    d_variables = Dict()
    one_dim = []
    two_dims = []
    drei_dims = []
    for k in ks
        tmp_ks = dims(sds[k])
        length(tmp_ks)==1 ? push!(one_dim, k) : length(tmp_ks)==2 ? push!(two_dims, k) : push!(drei_dims, k)
    end
    d_variables["Vars_1D"] = sort([o for o in one_dim])
    d_variables["Vars_2D"] = sort([two for two in two_dims])
    d_variables["Vars_3D"] = sort([drei for drei in drei_dims])
    return d_variables
end

groupedVars = getClusteredVars(sds, ks)

open("./src/utils/variables.json", "w") do io
    JSON3.write(io, groupedVars)
end