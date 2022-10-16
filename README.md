# Decentralized jamstack app

Pre-requisites:
* The shdw-drive binary installed (install with `npm i -g @shadow-drive/cli`)
* A Solana wallet with a little SOL (0.02 is enough) and SHDW token (1 is enough)

1. Create a storage account on SHADOW DRIVE
`shdw-drive create-storage-account -n jamstack -kp yourwallet.json -s 1mb`
(replace `jamstack` with any name you want)

2. Put the storage account you created in your `.env` file
`DRIVE=storageaccount`

3. Put the wallet account file in your `.env` file
`WALLETFILE=walletfile location`

4. Build your website 
`yarn build`

5. Upload
`yarn upload`

