# Decentralized jamstack app

Pre-requisites:
* The shdw-drive binary installed (install with `npm i -g @shadow-drive/cli`)
* A Solana wallet with a little SOL (0.02 is enough) and SHDW token (1 is enough)

0. Install with yarn or npm

1. Create a storage account on SHADOW DRIVE
`shdw-drive create-storage-account -n jamstack -kp yourwallet.json -s 1mb`
(replace `jamstack` with any name you want)

2. Put the storage account you created in your `.env` file
`DRIVE=storageaccount`

3. Put the wallet account file in your `.env` file
`WALLETFILE=walletfile location`

4. Build your website 
`npx gulp build` (or `yarn build`)

5. Upload
`npx gulp upload` (or `yarn upload`)
this command will upload any new files as well as replaced the edited ones. Be sure to build first.

6. Done
you can access your website at `https://shdw-drive.genesysgo.net/<storageaccount>/index.html` or you can
go to sdrive.app and claim a subdomain such as `jamstack.shadoweb.app` on the `shadoweb.app` domain.

