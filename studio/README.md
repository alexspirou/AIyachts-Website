# AIyachts Sanity Studio

This is the editor for yacht information and photos. The project and dataset are read from [`../sanity.config.json`](../sanity.config.json).

## Start the editor

Install Node.js 22.12 or later, then run these commands from the website folder:

```powershell
cd studio
npm install
npm run dev
```

Open the local address printed by the command (normally `http://localhost:3333`) and sign in with the Sanity account that owns the project. If prompted to allow this Studio origin, allow `http://localhost:3333` with credentials in your project's **API → CORS origins** settings.

Choose **Yacht**, create a document, and enter the details, specifications, and photos. Click **Generate** for the page address. In **Website**, choose whether the yacht appears on the website or homepage. Click **Publish** when ready.

To remove a yacht from the fleet while keeping its content, turn off **Show on website** and publish. Keep a published yacht's page address stable so existing links keep working.

Publishing saves content in Sanity. The website needs a build and deployment to show those changes; follow the [website setup instructions](../README.md). Only published, active yachts are shown.

## Host the editor online

Run `npm run deploy` from this folder and follow Sanity's sign-in and hostname prompts. This hosts the editor at the selected `sanity.studio` address. Deploying the editor and deploying the website are separate steps.

The schema is in [`schemaTypes/yacht.js`](schemaTypes/yacht.js). `npm run build` checks that the Studio compiles without deploying it.

References: [Sanity Studio installation](https://www.sanity.io/docs/studio/installation), [image fields](https://www.sanity.io/docs/studio/image-type), and [hosting the Studio](https://www.sanity.io/docs/studio/deployment).
