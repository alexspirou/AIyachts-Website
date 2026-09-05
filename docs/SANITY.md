# Manage the fleet with Sanity

The website is configured for project `g0z4g0d6` (`test-project`) and the public
dataset `fleet`. These identifiers are in `sanity.config.json` and are shared
by the website builder and Sanity Studio. No API token is needed to build from
this public dataset. Log in to Studio with the Sanity account that owns the
project to edit content.

## Start locally

Install Node.js 22.12 or newer, then run from the website folder:

```powershell
npm install
npm --prefix studio install
npm run studio
```

Open **http://localhost:3333** and sign in with the account you used to create
the project. If Studio asks you to allow this origin, configure it in
[Sanity Manage](https://www.sanity.io/manage): select your project, open **API**,
then **CORS origins**, and add **http://localhost:3333** with **Allow credentials**
enabled. Use this exact localhost address to open Studio.

In another terminal, from the website folder:

```powershell
npm run dev
```

Open **http://localhost:8080/fleet.html**. This serves the new website in `dist/`.
Opening the old root `fleet.html` directly will show the old static snapshot.

## Add or replace a yacht

1. In Studio, choose **Yacht**, then create a new document.
2. Under **Details**, fill in the name, builder, year, type, tagline, description
   and highlights. Click **Generate** for the page address. Every yacht needs
   a unique page address; keep it stable after publishing.
3. Under **Specifications**, enter cabins, guests, berths, bathrooms, charter
   options and departure bases. Extra specifications accept a label and a value
   with units, for example `Length` and `12.5 m`.
4. Under **Photos**, upload the main image and describe it for accessibility.
   Optionally add gallery photos. Use crop and hotspot to keep the yacht in frame.
5. Under **Website**, enable **Show on website**, optionally enable **Feature on
   homepage**, and set **Display order**. Lower numbers appear first.
6. Click **Publish**. Draft changes are not displayed by the website.
7. In a terminal at the website folder, run `npm run build`, then refresh the
   website preview. Keep the preview server running while rebuilding.

To replace an old yacht, turn off **Show on website** on the old document and
publish it, then create and publish the new yacht. The next build removes the old
yacht's page and references. A hidden yacht remains available to edit in Studio.

## What changes together

- Fleet cards, counts, cabin filters and yacht photos.
- Individual yacht pages, photo galleries, descriptions and specifications.
- Homepage featured yachts, related yachts and footer yacht links.
- The yacht selector on the enquiry form.
- Yacht metadata, structured data and sitemap links.

The homepage and footer use featured yachts when any are selected, otherwise
they use the fleet's display order. General page copy, scenic images, company
details and the experiences gallery remain in the existing source templates.

Sanity is the only source of yacht records. An empty dataset displays an
availability message; the old fleet is not substituted. Network failures or
invalid yacht data fail the build and preserve the previous successful output.

## Hosting later

The website is static: publishing in Sanity changes the stored content; building
and deploying updates the live HTML. Upload only `dist/` to your eventual host.
When hosting is chosen, configure a Sanity webhook for yacht creation, updates
and deletion to trigger the host's rebuild/deployment. Studio can be hosted
separately later. Nothing is deployed by the local commands above.

Official references: [Studio setup](https://www.sanity.io/docs/studio/installation),
[CORS settings](https://www.sanity.io/docs/content-lake/cors), and
[image cropping and hotspots](https://www.sanity.io/docs/apis-and-sdks/presenting-images).
