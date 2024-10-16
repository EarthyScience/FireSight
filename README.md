![Seasfire viz toolkit](/static/SeasFireApp.gif)

# FireSight
A browser based visualization toolkit for the SeasFire data cube.


## Easy start: Clone the repo

```sh
git clone https://github.com/EarthyScience/FireSight.git
```

Then navegate into `FireSight` and install dependencies

```
FireSight> npm install
```

That should install the necessary libraries.

## Launch the application
> ```sh
> npm run dev # if you run this from within an HPC system make sure to first do `module load nodejs/20.12.2`
> ```

That should open your default browser or give you the option to open one. 

> [!IMPORTANT]
> As of now you will to mount your data cube into `/public/` or copy the full dataset there.
>
> ### Example
> ```sh
> ln -s /scratch/u/SeasFireTimeChunks.zarr public/SeasFireTimeChunks.zarr
> ```

> [!TIP]
> Note that also you could modify the file at `/src/utils/variables.json` to match those in your Zarr Store.

## Roadmap 🛣️

Take a peek at what we've already made so far and our future plans for `FireSight`:

- [x] **UI components**
  - Landing page
- [x] **Modal About project**
  - Done by using React Portals and jotai
  - Abstract away into a new component.
- [x] **Footer component**
  - Short description / more?
- [x] **Nav/Icon component**
  - About modal descriptor, plus icon. More options? 
- [x] **Update tweekpane-react**: A PR to original repo has been made, but all changes had been integrated into this app.
  - [x] **Why this? Easy to customize and add new input parameters**
- [x] **Define a simple colormap mapping**
  - Maps values to rgb colors from a colormap
- [x] **Do a good colormap selector**
- [x] **Cube geometry / shader**
- [x] **Volumetric geometry / shader**
- [x] **Points / shader**
- [x] **Load variable for Zarr file**
- [x] **List all variables in pane controls**
- [x] **Variable selection and load data**
- [ ] **Pixel selection**
- [ ] **Plot time series per pixel**
- [ ] **Extend to model output**: TODO: Discuss approach and variables of interest.



Please note that these are our current plans and might change based on feedback and development progress. We highly encourage your ideas and contributions in shaping the future of `FireSight`.

Stay tuned for updates! 🚀

> [!TIP]
> _Have a suggestion or a feature request? Don't hesitate to open an issue or PR!_
