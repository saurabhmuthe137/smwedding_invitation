# Hindu Wedding Invitation

A responsive static wedding invitation built with HTML, CSS, and vanilla JavaScript. No database, backend, or build step is required.

## Project files and assets

The page is `Index.html` (capital I), with `style.css` and `script.js`. Static media belongs in this structure:

```text
assets/
	images/
	music/
	videos/
```

All configured media paths are relative to the project root. The existing MP3 has been renamed to the canonical `assets/music/wedding-music.mp3` path. The image and video folders currently contain no supplied media; image elements hide cleanly until their configured files are added.

## Edit the configuration

Wedding details and media paths are together in the `weddingData` object near the top of `script.js`.

- Bride and groom photos: copy files to `assets/images/bride.jpg` and `assets/images/groom.jpg`.
- Hero and venue photo: copy the couple photo to `assets/images/couple.jpg`.
- Gallery: copy `gallery1.jpg` through `gallery12.jpg` into `assets/images/`. The gallery paths are listed in `weddingData.gallery`.
- Music: use a valid MP3 named `wedding-music.mp3` in `assets/music/`. Replace that file to change tracks, keeping the same filename, or update `weddingData.music` to another relative MP3 path in that folder.
- Video: copy an MP4 to `assets/videos/wedding-video.mp4` and set `weddingVideo` to `assets/videos/wedding-video.mp4`. It is blank by default until a video is supplied.

Keep filenames and letter casing identical to the paths. Do not use Windows drive paths, `file:///` URLs, or leading-slash paths. If using different names, update the matching paths in `weddingData` and redeploy the project.

Change `brideName`, `groomName`, `weddingDate` (`YYYY-MM-DDTHH:MM:SS`), `venueName`, `venueAddress`, and `googleMapsUrl` in the same object. Edit events in `events`, timeline entries in `story`, family details in `brideFamily` and `groomFamily`, and the RSVP destination in `whatsappNumber`.

### Music playback

There is one HTML5 audio player. Music starts only after a guest clicks **Open invitation** or the floating music button; the floating controls toggle play/pause and mute. Autoplay is not used. If playback fails, check that `assets/music/wedding-music.mp3` exists, is a valid MP3, and is served by the local/static host. The music button does not store audio files or playback state in localStorage.

## Admin editing

Set a unique key of at least 24 characters in `const ADMIN_KEY` at the top of `script.js`. Use the URL query `?admin=YOUR_SECRET_KEY` to open the existing editor; the normal URL removes the admin panel. **Exit Admin** returns to the public URL.

This is client-side gating, not real authentication: the key is present in the JavaScript and can be discovered by an advanced visitor. Do not use this to protect sensitive information.

Text edits continue to use the existing `wedding-invitation-data-v1` localStorage key. Uploaded photos in the editor are local previews only and are not written into the hosted project. To publish new media, copy files into `assets/images/`, `assets/music/`, or `assets/videos/`, set the relative paths in `weddingData`, test, and redeploy. Browser-local saved edits do not change what other visitors see. **Reset changes** clears the existing saved invitation data in that browser and returns to the values in `script.js`.

## Run locally

1. Open this folder in VS Code.
2. Install the **Live Server** extension if needed.
3. Right-click `Index.html` and select **Open with Live Server**. Start Live Server again from VS Code after closing the editor.

## Deploy updates

Keep the same project/repository and replace its files when updating the hosted invitation; no new website or database is needed.

- **GitHub Pages:** Push the updated project to the existing repository. In **Settings → Pages**, publish the chosen branch and root folder. Rename `Index.html` to lowercase `index.html` for the hosting default page.
- **Netlify:** Connect the existing Git repository or deploy the updated project folder. Use the project root as the publish directory and lowercase the entry filename to `index.html`.
- **Vercel:** Import the existing repository as a static site, with no build command and the project root as the output directory. Use lowercase `index.html`.

After deployment, share only the normal public URL with clients. Keep the `?admin=YOUR_SECRET_KEY` URL private. The same static page serves both URLs.