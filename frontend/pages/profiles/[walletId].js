import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { Contract } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createClient } from "urql";
import { erc721ABI, useAccount, useContract, useProvider } from "wagmi";
import Navbar from "../../components/Navbar";
import { SUBGRAPH_URL } from "../../constants";

export default function ProofOfKnowledgeDetails() {
  // Extract the user wallet address from the URL
  const router = useRouter();
  const walletId = router.query.walletId;

  // state variables to contain the userSkillsNfts
  const [skills, setSkills] = useState();

  // State variables to contain loading state
  const [loading, setLoading] = useState(true);

  console.log("Extracted WalletId", walletId);

  const { isConnected } = useAccount();
  const { provider } = useProvider();

  // Get the connected address
  const { address } = useAccount();

   // Function to fetch userSkillsNfts and set the user's skills
  async function fetchUserSkillsNfts() {

    if (address !== "") {
      setLoading(true);

      // The GraphQL query to run
      const userSkillsNftsQuery = `query fetchUserSkillsNftsEnitites {
        users (where: {id: "${walletId}"}) {
          skillsNft {
            name
            organization
            metadata
          }
        }
      }`;

      // Creae a urql client
      const urqlClient = createClient({
        url: SUBGRAPH_URL,
      });

      // Send the query to the subgraph GraphQL API, and get the response

      const response = await urqlClient.query(userSkillsNftsQuery).toPromise();

      console.log(response);
      const userSkillsNftsEntities = response.fetchUserSkillsNftsEnitites;

      // Update the state variables
      setSkills(userSkillsNftsEntities);
       console.log("User skills:", userSkillsNftsEntities);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isConnected ) {
      fetchUserSkillsNfts();
      setLoading(false);
    }
    else {
      setLoading(true);
    }
  }, [isConnected]);

  return (
    <>
      {/* Add a Navbar */}
      <Navbar />
    </>
  );
}
