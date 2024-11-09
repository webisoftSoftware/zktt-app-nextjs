import { useAccount } from "@starknet-react/core";
import { useCallback, useState } from "react";

type ContractCall = {
  contractAddress: string;
  entrypoint: string;
  calldata: any[];
};

export function useContractController() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>();
  const { account } = useAccount();

  const executeTransaction = useCallback(
    async (calls: ContractCall[]) => {
      if (!account) {
        throw new Error("No account connected");
      }

      setSubmitted(true);
      setTxnHash(undefined);

      try {
        const result = await account.execute(calls);
        setTxnHash(result.transaction_hash);
        return result;
      } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
      } finally {
        setSubmitted(false);
      }
    },
    [account]
  );

  return {
    executeTransaction,
    submitted,
    txnHash,
  };
}



// how to use the helper function

// const { executeTransaction } = useContractController();

// const handleGameAction = async () => {
//     await executeTransaction([
//         {
//             contractAddress: CONTRACT_ADDRESS_CALLED,
//             entrypoint: "your_game_function",
//             calldata: [/* your parameters */],
//         }
//     ]);
// };