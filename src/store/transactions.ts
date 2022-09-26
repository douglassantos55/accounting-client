import { schema } from "normalizr";
import { makeStore } from ".";
import { Transaction } from "../types";
import accounts, { AccountEntity } from "./accounts";

export type TransactionModule = {
    get: (id: number) => Transaction;
    setEntities: (entities: Record<number, Transaction>) => void;
}

export const TransactionEntity = new schema.Entity('transactions', {
    Account: AccountEntity,
}, { idAttribute: 'ID' });

function create(): TransactionModule {
    const store = makeStore<Transaction>();

    function withRelations(transaction: Transaction) {
        return {
            ...transaction,
            Account: accounts.get(transaction.AccountID),
        };
    }

    function get(id: number): Transaction {
        return withRelations(store.state.byId[id]);
    }

    return {
        get,
        setEntities: store.setEntities,
    };
}

export default create();
