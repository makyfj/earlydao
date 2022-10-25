export default async function checkBalance(sdk, address) {
  const editionDrop = sdk.getEditionDrop(
    '0x980f916838cEdbAC5d640da88D6Cf9B23cd01730'
  )

  const balance = await editionDrop.balanceOf(address, 0)

  // gt = greater than
  return balance.gt(0)
}
