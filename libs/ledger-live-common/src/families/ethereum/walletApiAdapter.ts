import { EthereumTransaction as WalletAPIEthereumTransaction } from "@ledgerhq/wallet-api-core";
import { Transaction as EvmTx } from "@ledgerhq/coin-evm/types/index";
import {
  AreFeesProvided,
  ConvertToLiveTransaction,
  GetWalletAPITransactionSignFlowInfos,
} from "../../wallet-api/types";
import { Transaction as EthTx } from "./types";

const CAN_EDIT_FEES = true;

type Transaction = EthTx | EvmTx;

const areFeesProvided: AreFeesProvided<WalletAPIEthereumTransaction> = tx =>
  !!((tx.gasLimit && tx.gasPrice) || (tx.gasLimit && tx.maxFeePerGas && tx.maxPriorityFeePerGas));

const convertToLiveTransaction: ConvertToLiveTransaction<
  WalletAPIEthereumTransaction,
  Transaction
> = tx => {
  const hasFeesProvided = areFeesProvided(tx);

  const liveTx: Partial<Transaction> = convertToEvmLiveTransaction(tx);

  return hasFeesProvided ? { ...liveTx, feesStrategy: "custom" } : liveTx;
};

const getWalletAPITransactionSignFlowInfos: GetWalletAPITransactionSignFlowInfos<
  WalletAPIEthereumTransaction,
  Transaction
> = tx => {
  return {
    canEditFees: CAN_EDIT_FEES,
    liveTx: convertToLiveTransaction(tx),
    hasFeesProvided: areFeesProvided(tx),
  };
};

export default { getWalletAPITransactionSignFlowInfos };

function convertToEvmLiveTransaction(tx: WalletAPIEthereumTransaction): Partial<EvmTx> {
  const params = {
    family: "evm" as const,
    nonce: tx.nonce,
    amount: tx.amount,
    recipient: tx.recipient,
    data: tx.data,
    gasLimit: tx.gasLimit,
  };

  return tx.maxPriorityFeePerGas || tx.maxFeePerGas
    ? {
        ...params,
        type: 2,
      }
    : { ...params, type: 0 };
}
