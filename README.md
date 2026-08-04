<div alt style="text-align: center; transform: scale(.25);">
	<picture>
		<source media="(prefers-color-scheme: dark)" srcset="assets/banner_dark.png" />
		<img alt="banner" src="assets/banner_light.png" />
	</picture>
</div>

## Feature highlights

Browser extension for Spotify Web Player that adds a playback control beside Spotify’s volume controls.
- Changes playback speed using whole semitone steps instead of decimal speed/percentage values.
- Default range is -12st to +12st:
    - -12st = half speed / one octave down
    - 0st = normal speed
    - +12st = double speed / one octave up
     
- Includes a reset button to return to 0st.
- Lets users customize the min/max semitone range in settings.                      
- Includes a Preserve Pitch toggle.                                                 
- Saves semitone, pitch, and range settings in browser localStorage.             
- Works by injecting controls into Spotify Web Player and applying the converted playback rate to Spotify’s media elements.

## Quick start


You don't need the source code if you want to just use the extension

#### Chrome ver.

1. [Install from Chrome Web Store](https://chrome.google.com/webstore/detail/spotify-playback-speed/bgehnoihoklmofgehcefiaicdcdgppck)

2. Download latest release
    *  Download latest release from Releases
    *  Enable Developer Mode on Chrome's 'Manage Extensions' page
    *  Unarchive and drag folder onto 'Manage Extensions' page

#### Bookmarklet ver.

1. Create bookmarklet
2. Load Spotify and click bookmarklet while Spotify web player is loading
3. Retry and click bookmarklet earlier if not present or not working

## Contributing

We are not accepting contributions at this time. If you've found a bug or have a feature request, please [create an issue](https://github.com/tldraw/tldraw/issues/new/choose) and we can discuss it there. See our [contributing guide](https://github.com/tldraw/tldraw/blob/main/CONTRIBUTING.md) for details.

## Acknowledgments & Credits

This project is a standalone fork/customization of [the original spotify playback speed extension](https://github.com/rnikko/spotify-playback-speed) created by [@rnikko](https://github.com/rnikko). 

* **Key Changes:** Pivoted from percentage-based playback speed control into a semitone-based control. It is not intended as a pull request to the original project.

Again, huge thanks to [@rnikko](https://github.com/rnikko) for building the foundation!