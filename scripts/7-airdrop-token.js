import sdk from "./1-initialize-sdk.js"

// This is the address to our ERC-1155 membership NFT contract.
const editionDrop = sdk.getEditionDrop(
  "0x14F88486b364790f09F29253F033C6694b92f9B1"
)

// This is the address to our ERC-20 token contract.
const token = sdk.getToken("0xE4C14Eb89AC86313D7afA82dF6DaBdF60995310a")

;(async () => {
  try {
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0)

    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!"
      )
      process.exit(0)
    }

    const airdropTargets = walletAddresses.map((address) => {
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000)
      console.log("✅ Going to airdrop", randomAmount, "tokens to", address)

      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      }

      return airdropTarget
    })

    console.log("🌈 Starting airdrop...")
    await token.transferBatch(airdropTargets)
    console.log(
      "✅ Successfully airdropped tokens to all the holders of the NFT!"
    )
  } catch (err) {
    console.error("Failed to airdrop tokens", err)
  }
})()
