import { makeStore } from ".";
import { Transaction } from "../types";
import accounts from "./accounts";

export type TransactionModule = {
    get: (id: number) => Transaction | undefined;
    forAccount: (accountID: number) => Transaction[];
    setEntities: (entities: Record<number, Transaction>) => void;
}


function create(): TransactionModule {
    const store = makeStore<Transaction>();

    function withRelations(transaction: Transaction) {
        return {
            ...transaction,
            Account: accounts.get(transaction.AccountID),
        };
    }

    function forAccount(accountID: number): Transaction[] {
        return store.state.ids.map(function(id: number) {
            return store.state.byId[id];
        }).filter(function(transaction: Transaction) {
            return transaction.AccountID == accountID;
        });
    }

    function get(id: number) {
        return withRelations(store.state.byId[id]);
    }

    return {
        get,
        forAccount,
        setEntities: store.setEntities,
    };
}

export default create();
