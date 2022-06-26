import sdk from "./1-initialize-sdk.js"
import { readFileSync } from "fs"

const editionDrop = sdk.getEditionDrop(
  "0x14F88486b364790f09F29253F033C6694b92f9B1"
)

;(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Floating Meditation ",
        description: "This NFT will give you access to YogiDAO!",
        image: readFileSync("scripts/assets/floating.png"),
      },
    ])
    console.log("✅ Successfully created a new NFT in the drop!")
  } catch (error) {
    console.error("failed to create the new NFT", error)
  }
})()
