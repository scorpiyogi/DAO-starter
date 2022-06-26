import sdk from "./1-initialize-sdk.js"

// This is the address of our ERC-20 contract printed out in the step before.
const token = sdk.getToken("0xE4C14Eb89AC86313D7afA82dF6DaBdF60995310a")

;(async () => {
  try {
    const amount = 1000000
    // Interact with your deployed ERC-20 contract and mint the tokens!
    await token.mintToSelf(amount)
    const totalSupply = await token.totalSupply()

    // Print out how many of our token's are out there now!
    console.log(
      "✅ There now is",
      totalSupply.displayValue,
      "$HOKAGE in circulation"
    )
  } catch (error) {
    console.error("Failed to print money", error)
  }
})()
