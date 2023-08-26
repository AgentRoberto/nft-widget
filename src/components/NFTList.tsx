import React, { useState, useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

const NFTList = () => {
  const [data, setData] = useState<any[]>([])
  const address = process.env.NEXT_PUBLIC_ADDRESS!;

  const fetchImages = async() => {
    const web3ApiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
    try {
      if(!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: web3ApiKey,
        });
      }
      const chain = EvmChain.ETHEREUM;      

      const res = await Moralis.EvmApi.nft.getWalletNFTs({
        chain,
        address,
      })

      // NFT Metadata which contains image URL
      const metadataArray = res.result
        .filter(item => item.metadata !== null && item.metadata !== undefined && item.name != 'Rarible') // 1 of my Rarible NFTs had IPFS issues
        .map(item => item.metadata);
      const imagesArray = metadataArray.map(metadata => metadata!.image);

      setData(imagesArray);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  return(
    <div className='nft-container'>
      <h2 style={{color: '#ce183e'}}>NFTs held by address: {address}</h2>
      {data ?
        <Carousel className='carousel'>
          {data.map((e, i) => (
            <img key={i} src={e} alt={`Image ${i}`} />
          ))}
        </Carousel>
        :
        <> 
          <h1>Loading NFT Data...</h1>
        </>
      }
    </div>
  )
};

export default NFTList
