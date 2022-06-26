import sdk from "./1-initialize-sdk.js"

const vote = sdk.getVote("0xc7b03A47fB7D49BC0f374AA060Eb593d2AE60842")

const token = sdk.getToken("0xE4C14Eb89AC86313D7afA82dF6DaBdF60995310a")

;(async () => {
  try {
    // Give our treasury the power to mint additional token if needed.
    await token.roles.grant("minter", vote.getAddress())

    console.log(
      "Successfully gave vote contract permissions to act on token contract"
    )
  } catch (error) {
    console.error(
      "failed to grant vote contract permissions on token contract",
      error
    )
    process.exit(1)
  }

  try {
    const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS)

    const ownedAmount = ownedTokenBalance.displayValue
    const percent90 = (Number(ownedAmount) / 100) * 90

    await token.transfer(vote.getAddress(), percent90)

    console.log(
      "✅ Successfully transferred " + percent90 + " tokens to vote contract"
    )
  } catch (err) {
    console.error("failed to transfer tokens to vote contract", err)
  }
})()
