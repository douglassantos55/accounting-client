import { normalize, schema } from "normalizr";
import { Accessor, createMemo, createRoot } from "solid-js";
import { makeStore, Module } from ".";
import axios from "../axios";
import { Account, AccountType, Transaction } from "../types";
import transactions from "./transactions";

export const AccountEntity = new schema.Entity('accounts', undefined, {
    idAttribute: 'ID',
});

export const TransactionEntity = new schema.Entity('transactions', {
    Account: AccountEntity,
}, { idAttribute: 'ID' });

AccountEntity.define({
    Transactions: [TransactionEntity],
})

type Entities = {
    accounts: Record<number, Account>;
    transactions: Record<number, Transaction>;
}

type Getters = {
    all: Accessor<Account[]>;
    get: (id: number) => Account;
    hierarchical: Accessor<Account[]>;
    type: (type: AccountType) => Account[];
    balance: (accounts: Account[], start: string, endd: string) => Account[];
}

export type AccountModule = Module<Account> & Getters;

function create(): AccountModule {
    const store = makeStore<Account>();

    function getTransactions(accountID: number, start: string, end: string) {
        const startDate = new Date(start);
        const endDate = new Date(end);

        return transactions.forAccount(accountID).filter(function(transaction: Transaction) {
            return !end || new Date(transaction.CreatedAt) < endDate;
        });
    }

    function withBalance(account: Account, start: string, end: string) {
        return {
            ...account,
            Balance: getTransactions(account.ID, start, end).reduce(function(total: number, transaction: Transaction) {
                return total + transaction.Value;
            }, 0),
        }
    }

    const getters = createRoot(function() {
        const get = function(id: number) {
            return store.state.byId[id];
        }

        const all = createMemo(function() {
            return store.state.ids.map(function(id: number) {
                return get(id);
            });
        });

        const parents = createMemo(function() {
            return all().filter(function(account: Account) {
                return account.ParentID == null;
            });
        });

        const hierarchical = createMemo(function() {
            function getChildren(id: number): Account[] {
                return all().filter(acc => acc.ParentID == id).map(child => ({
                    ...child,
                    Children: getChildren(child.ID),
                }));
            }

            return parents().map((account: Account) => ({
                ...account,
                Children: getChildren(account.ID),
            }));
        });

        const type = function(type: AccountType) {
            return all().filter(function(account: Account) {
                return account.Type == type;
            });
        }

        const balance = function(accounts: Account[], start: string, end: string) {
            return accounts.map(function(account: Account) {
                return {
                    ...withBalance(account, start, end),
                    Children: balance(account.Children || [], start, end),
                }
            });
        }

        return { get, all, type, balance, hierarchical };
    });

    function _normalize(data: Record<string, string>) {
        return {
            Name: data.Name,
            Type: parseInt(data.Type),
            ParentID: data.ParentID ? parseInt(data.ParentID) : null,
        };
    }

    async function saveAccount(data: Record<string, string>) {
        let account: Account;
        if (data.ID) {
            account = await axios.put(`/accounts/${data.ID}`, _normalize(data));
        } else {
            account = await axios.post("/accounts", _normalize(data));
        }
        store.save(account.ID, account);
    }

    async function fetchAccount(id: number) {
        if (!store.state.byId[id]) {
            const response = await axios.get(`/accounts/${id}`);
            const { entities } = normalize<Account, Entities>(response, AccountEntity);

            transactions.setEntities(entities.transactions);
            store.setEntities(entities.accounts);
        }
        return store.state.byId[id];
    }

    async function fetchAccounts() {
        if (!store.state.fetched) {
            const response = await axios.get('/accounts');
            const { result, entities } = normalize<Account, Entities>(response, [AccountEntity]);

            transactions.setEntities(entities.transactions);
            store.setAll(result, entities.accounts);
        }
    }

    async function deleteAccount(id: number) {
        await axios.delete(`/accounts/${id}`);
        store.remove(id);
    }

    return {
        state: store.state,
        fetch: fetchAccount,
        delete: deleteAccount,
        fetchAll: fetchAccounts,
        save: saveAccount,
        setEntities: store.setEntities,
        ...getters,
    }
}

export default create();
