import {
  useAddress,
  useMetamask,
  useEditionDrop,
  useToken,
  useVote,
  useNetwork,
} from "@thirdweb-dev/react"
import { useState, useEffect, useMemo } from "react"
import { AddressZero } from "@ethersproject/constants"
import { ChainId } from "@thirdweb-dev/sdk"

const App = () => {
  // Using thirdweb hooks
  const address = useAddress()
  const network = useNetwork()
  const connectWithMetamask = useMetamask()
  console.log("👋 Address:", address)

  // Initialize  editionDrop contract
  const editionDrop = useEditionDrop(
    "0x14F88486b364790f09F29253F033C6694b92f9B1"
  )
  const token = useToken("0xE4C14Eb89AC86313D7afA82dF6DaBdF60995310a")
  const vote = useVote("0xc7b03A47fB7D49BC0f374AA060Eb593d2AE60842")

  // State variable to know if user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false)
  // isClaiming lets  easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false)

  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([])
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState([])

  // A fancy function to shorten someones wallet address, no need to show the whole thing.
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4)
  }
  const [proposals, setProposals] = useState([])
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  // This useEffect grabs all the addresses of our members holding our NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }

    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll()
        setProposals(proposals)
        console.log("🌈 Proposals:", proposals)
      } catch (error) {
        console.log("failed to get proposals", error)
      }
    }
    getAllProposals()
  }, [hasClaimedNFT, vote])

  // We also need to check if the user already voted.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }

    // If we haven't finished retrieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
    if (!proposals.length) {
      return
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address)
        setHasVoted(hasVoted)
        if (hasVoted) {
          console.log("🥵 User has already voted")
        } else {
          console.log("🙂 User has not voted yet")
        }
      } catch (error) {
        console.error("Failed to check if wallet has voted", error)
      }
    }
    checkIfUserHasVoted()
  }, [hasClaimedNFT, proposals, address, vote])

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // We're checking if we are finding the address in the memberTokenAmounts array.
      // If we are, we'll return the amount of token the user has.
      // Otherwise, return 0.
      const member = memberTokenAmounts?.find(
        ({ holder }) => holder === address
      )

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    })
  }, [memberAddresses, memberTokenAmounts])

  useEffect(() => {
    // If they don't have a connected wallet, exit!
    if (!address) {
      return
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0)
        if (balance.gt(0)) {
          setHasClaimedNFT(true)
          console.log("🌟 this user has a membership NFT!")
        } else {
          setHasClaimedNFT(false)
          console.log("😭 this user doesn't have a membership NFT.")
        }
      } catch (error) {
        setHasClaimedNFT(false)
        console.error("Failed to get balance", error)
      }
    }
    checkBalance()
  }, [address, editionDrop])

  const mintNft = async () => {
    try {
      setIsClaiming(true)
      await editionDrop.claim("0", 1)
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
      )
      setHasClaimedNFT(true)
    } catch (error) {
      setHasClaimedNFT(false)
      console.error("Failed to mint NFT", error)
    } finally {
      setIsClaiming(false)
    }
  }
  if (address && network?.[0].data.chain.id !== ChainId.Rinkeby) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks in
          your connected wallet.
        </p>
      </div>
    )
  }

  // This is the case where the user hasn't connected their wallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to YogiDAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    )
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1> 🥞DAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                e.stopPropagation()

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true)

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,

                    vote: 2,
                  }
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    )

                    if (elem.checked) {
                      voteResult.vote = vote.type
                      return
                    }
                  })
                  return voteResult
                })

                //  Need to make sure the user delegates  token to vote
                try {
                  //check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(address)
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address)
                  }

                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting  first need to check whether the proposal is open for voting
                        // Need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId)
                        //   check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, vote on it
                          return vote.vote(proposalId, _vote)
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return
                      })
                    )
                    try {
                      // if any of the propsals are ready to be executed ,will execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          const proposal = await vote.get(proposalId)

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId)
                          }
                        })
                      )
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true)
                      // and log out a success message
                      console.log("successfully voted")
                    } catch (err) {
                      console.error("failed to execute votes", err)
                    }
                  } catch (err) {
                    console.error("failed to vote", err)
                  }
                } catch (err) {
                  console.error("failed to delegate tokens")
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false)
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          //default the "abstain" vote to checked
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                  ? "You Already Voted"
                  : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <button disabled={isClaiming} onClick={mintNft}>
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  )
}
export default App
