using GLMakie
using Pickle
# using PythonCall, CondaPkg
# CondaPkg.add("numpy")
# np = pyimport("numpy")
# file = np.load(joinpath(@__DIR__, "results_dict.npy"))

pkl = Pickle.npyload(open(joinpath(@__DIR__, "results_dict.pkl")))
pkl[1]
pkl[1]["attentions"]