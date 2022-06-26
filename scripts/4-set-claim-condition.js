import sdk from "./1-initialize-sdk.js"
import { MaxUint256 } from "@ethersproject/constants"

const editionDrop = sdk.getEditionDrop(
  "0x14F88486b364790f09F29253F033C6694b92f9B1"
)

;(async () => {
  try {
    const claimConditions = [
      {
        // When people are gonna be able to start claiming the NFTs (now)
        startTime: new Date(),
        // The maximum number of NFTs that can be claimed.
        maxQuantity: 50_000,
        // The price of our NFT (free)
        price: 0,
        // The amount of NFTs people can claim in one transaction.
        quantityLimitPerTransaction: 1,
        // We set the wait between transactions to MaxUint256, which means
        // people are only allowed to claim once.
        waitInSeconds: MaxUint256,
      },
    ]

    await editionDrop.claimConditions.set("0", claimConditions)
    console.log("✅ Successfully set claim condition!")
  } catch (error) {
    console.error("Failed to set claim condition", error)
  }
})()
