import sdk from "./1-initialize-sdk.js"

const token = sdk.getToken("0xE4C14Eb89AC86313D7afA82dF6DaBdF60995310a")

;(async () => {
  try {
    const allRoles = await token.roles.getAll()

    console.log("👀 Roles that exist right now:", allRoles)

    // Revoke all the superpowers your wallet had over the ERC-20 contract.
    await token.roles.setAll({ admin: [], minter: [] })
    console.log("🎉 Roles after revoking ourselves", await token.roles.getAll())
    console.log(
      "✅ Successfully revoked our superpowers from the ERC-20 contract"
    )
  } catch (error) {
    console.error("Failed to revoke ourselves from the DAO trasury", error)
  }
})()
