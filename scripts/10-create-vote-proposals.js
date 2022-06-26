import sdk from "./1-initialize-sdk.js"
import { ethers } from "ethers"

const vote = sdk.getVote("0xc7b03A47fB7D49BC0f374AA060Eb593d2AE60842")

const token = sdk.getToken("0xE4C14Eb89AC86313D7afA82dF6DaBdF60995310a")

;(async () => {
  try {
    const amount = 420_000
    const description =
      "Should the DAO mint an additional " +
      amount +
      " tokens into the treasury?"
    const executions = [
      {
        toAddress: token.getAddress(),

        nativeTokenValue: 0,
        // We're doing a mint! And, we're minting to the vote, which is
        // acting as our treasury.
        // in this case, we need to use ethers.js to convert the amount
        // to the correct format. This is because the amount it requires is in wei.
        transactionData: token.encoder.encode("mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ]

    await vote.propose(description, executions)

    console.log("✅ Successfully created proposal to mint tokens")
  } catch (error) {
    console.error("failed to create first proposal", error)
    process.exit(1)
  }

  try {
    // Create proposal to transfer ourselves 6,900 tokens for being awesome.
    const amount = 6_900
    const description =
      "Should the DAO transfer " +
      amount +
      " tokens from the treasury to " +
      process.env.WALLET_ADDRESS +
      " for being awesome?"
    const executions = [
      {
        // Again sending  0 ETH. Just sending  own token.
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // Doing a transfer from the treasury to wallet.
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
        toAddress: token.getAddress(),
      },
    ]

    await vote.propose(description, executions)

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    )
  } catch (error) {
    console.error("failed to create second proposal", error)
  }
})()
