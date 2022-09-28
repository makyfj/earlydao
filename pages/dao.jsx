import { Layout } from '@/components/layout'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'
import {
  useAddress,
  useMetamask,
  useEditionDrop,
  useToken,
  useVote,
  useNetwork,
} from '@thirdweb-dev/react'
import { ChainId } from '@thirdweb-dev/sdk'
import { useState, useEffect, useMemo } from 'react'
import { AddressZero } from '@ethersproject/constants'
import { PlusIcon } from '@heroicons/react/20/solid'
import { Button } from '@/components/button'

const Dao = () => {
  // const { data: session } = useSession()
  // const router = useRouter()

  const address = useAddress()
  const network = useNetwork()
  const connectWithMetamask = useMetamask()
  console.log('👋 Address:', address)

  // Initialize our editionDrop contract
  const editionDrop = useEditionDrop(
    '0x980f916838cEdbAC5d640da88D6Cf9B23cd01730'
  )
  // Initialize our token contract
  const token = useToken('0xf7f64a9aeE1F99282f3A7D32d8451af0bc6216a0')

  const vote = useVote('0x3D40193A0D008114ffeD058Aef7D10E1Ab13BA40')

  // State variable for us to know if user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false)
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false)

  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([])
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState([])

  const [proposals, setProposals] = useState([])
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  // A fancy function to shorten someones wallet address, no need to show the whole thing.
  const shortenAddress = (str) => {
    return str.substring(0, 6) + '...' + str.substring(str.length - 4)
  }

  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }

    // A simple call to vote.getAll() to grab the proposals.
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll()
        setProposals(proposals)
        console.log('🌈 Proposals:', proposals)
      } catch (error) {
        console.log('failed to get proposals', error)
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
          console.log('🥵 User has already voted')
        } else {
          console.log('🙂 User has not voted yet')
        }
      } catch (error) {
        console.error('Failed to check if wallet has voted', error)
      }
    }
    checkIfUserHasVoted()
  }, [hasClaimedNFT, proposals, address, vote])

  // This useEffect grabs all the addresses of our members holding our NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }

    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
    // with tokenId 0.
    const getAllAddresses = async () => {
      try {
        const memberAddresses =
          await editionDrop.history.getAllClaimerAddresses(0)
        setMemberAddresses(memberAddresses)
        console.log('🚀 Members addresses', memberAddresses)
      } catch (error) {
        console.error('failed to get member list', error)
      }
    }
    getAllAddresses()
  }, [hasClaimedNFT, editionDrop.history])

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances()
        setMemberTokenAmounts(amounts)
        console.log('👜 Amounts', amounts)
      } catch (error) {
        console.error('failed to get member balances', error)
      }
    }
    getAllBalances()
  }, [hasClaimedNFT, token.history])

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
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
        tokenAmount: member?.balance.displayValue || '0',
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
        console.log('this is the balance', balance)
        if (balance.gt(0)) {
          setHasClaimedNFT(true)
          console.log('🌟 this user has a membership NFT!')
        } else {
          setHasClaimedNFT(false)
          console.log("😭 this user doesn't have a membership NFT.")
        }
      } catch (error) {
        setHasClaimedNFT(false)
        console.error('Failed to get balance', error)
      }
    }
    checkBalance()
  }, [address, editionDrop])

  const mintNft = async () => {
    try {
      setIsClaiming(true)
      await editionDrop.claim('0', 1)
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
      )
      setHasClaimedNFT(true)
    } catch (error) {
      setHasClaimedNFT(false)
      console.error('Failed to mint NFT', error)
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

  if (!address) {
    return (
      <>
        <Head>
          <title>EarlyDAO</title>
        </Head>
        <div className="text-center">
          <h3 className="mt-2 text-sm font-medium">Welcome to EARLYDAO</h3>
          <p className="mt-1 text-sm text-secondary">
            Get started by connecting your wallet.
          </p>
          <Button
            onClick={connectWithMetamask}
            className="mt-6 bottom-0 right-0"
            type="button"
          >
            <span className="sm:block shrink-0">Connect Wallet</span>
          </Button>
        </div>
      </>
    )
  }

  console.log(hasClaimedNFT)

  // If the user has already claimed their NFT we want to display the interal DAO page to them
  // only DAO members will see this. Render all the members + token amounts.
  if (hasClaimedNFT) {
    return (
      <>
        <div>
          <div>
            <div>
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold">Member List</h1>
                    <p className="mt-2 text-sm text-secondary">
                      Congratulations on being a member! Here are our token
                      holders
                    </p>
                  </div>
                </div>
                <div className="-mx-4 mt-3 flex flex-col sm:-mx-6 md:mx-0">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6 md:pl-0"
                        >
                          Address
                        </th>
                        <th
                          scope="col"
                          className="hidden py-3.5 px-3 text-right text-sm font-semibold sm:table-cell"
                        ></th>
                        <th
                          scope="col"
                          className="hidden py-3.5 px-3 text-right text-sm font-semibold sm:table-cell"
                        ></th>
                        <th
                          scope="col"
                          className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold sm:pr-6 md:pr-0"
                        >
                          $EARLY Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberList.map((member) => (
                        <tr
                          key={member.address}
                          className="border-b border-gray-200"
                        >
                          <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                            <div className="font-medium">
                              {shortenAddress(member.address)}
                            </div>
                          </td>
                          <td className="hidden py-4 px-3 text-right text-sm sm:table-cell"></td>
                          <td className="hidden py-4 px-3 text-right text-sm  sm:table-cell"></td>
                          <td className="py-4 pl-3 pr-4 text-right text-sm sm:pr-6 md:pr-0">
                            {member.tokenAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="mx-auto max-w-lg px-4 pt-10 pb-12 lg:pb-16">
              {/* <form> */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-lg font-medium leading-6">
                    Active Proposals
                  </h1>
                  <p className="mt-1 text-sm text-secondary">
                    Please vote on the latest proposals from the DAO
                  </p>
                </div>
              </div>

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
                      //abstain by default
                      vote: 2,
                    }
                    proposal.votes.forEach((vote) => {
                      const elem = document.getElementById(
                        proposal.proposalId + '-' + vote.type
                      )

                      if (elem.checked) {
                        voteResult.vote = vote.type
                        return
                      }
                    })
                    return voteResult
                  })

                  // first we need to make sure the user delegates their token to vote
                  try {
                    //we'll check if the wallet still needs to delegate their tokens before they can vote
                    const delegation = await token.getDelegationOf(address)
                    // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                    if (delegation === AddressZero) {
                      //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                      await token.delegateTo(address)
                    }
                    // then we need to vote on the proposals
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId, vote: _vote }) => {
                          // before voting we first need to check whether the proposal is open for voting
                          // we first need to get the latest state of the proposal
                          const proposal = await vote.get(proposalId)
                          // then we check if the proposal is open for voting (state === 1 means it is open)
                          if (proposal.state === 1) {
                            // if it is open for voting, we'll vote on it
                            return vote.vote(proposalId, _vote)
                          }
                          // if the proposal is not open for voting we just return nothing, letting us continue
                          return
                        })
                      )
                      try {
                        // if any of the propsals are ready to be executed we'll need to execute them
                        // a proposal is ready to be executed if it is in state 4
                        await Promise.all(
                          votes.map(async ({ proposalId }) => {
                            // we'll first get the latest state of the proposal again, since we may have just voted before
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
                        console.log('successfully voted')
                      } catch (err) {
                        console.error('failed to execute votes', err)
                      }
                    } catch (err) {
                      console.error('failed to vote', err)
                    }
                  } catch (err) {
                    console.error('failed to delegate tokens')
                  } finally {
                    // in *either* case we need to set the isVoting state to false to enable the button again
                    setIsVoting(false)
                  }
                }}
              >
                {proposals.map((proposal) => (
                  <>
                    <div className="mt-8">
                      <p className="text-sm leading-5 text-secondary">
                        {proposal.description}
                      </p>
                      <fieldset className="mt-4">
                        <div className="space-y-4">
                          {proposal.votes.map(({ type, label }) => (
                            <div key={type} className="flex items-center">
                              <input
                                id={proposal.proposalId + '-' + type}
                                name={proposal.proposalId}
                                type="radio"
                                value={type}
                                defaultChecked={type === 2}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={proposal.proposalId + '-' + type}
                                className="ml-3 block text-sm font-medium"
                              >
                                {label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  </>
                ))}
                <div>
                  <Button
                    className="mt-8 bottom-0 right-0"
                    disabled={isVoting || hasVoted}
                    type="submit"
                  >
                    <span className="sm:block shrink-0">
                      {isVoting
                        ? 'Voting...'
                        : hasVoted
                        ? 'You Already Voted'
                        : 'Submit Votes'}
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Render mint nft screen.
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-medium">
        Mint your free EARLYDAO Membership NFT
      </h3>
      <p className="mt-1 text-sm text-secondary">
        A community for longevity practitioners
      </p>
      <Button
        disabled={isClaiming}
        onClick={mintNft}
        className="mt-6 bottom-0 right-0"
        type="button"
      >
        <span className="sm:block shrink-0">
          {isClaiming ? 'Minting...' : 'Mint your NFT (FREE)'}
        </span>
      </Button>
    </div>
  )
}

Dao.auth = true

Dao.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default Dao
