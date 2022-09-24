import { normalize, schema } from "normalizr";
import { Accessor, createMemo, createRoot } from "solid-js";
import { makeStore, Module } from ".";
import axios from "../axios";
import { Account } from "../types";

export const AccountEntity = new schema.Entity('accounts', undefined, {
    idAttribute: 'ID',
});

type Entities = {
    accounts: Record<number, Account>;
}

type Getters = {
    get: (id: number) => Account;
    all: Accessor<Account[]>;
    hierarchical: Accessor<Account[]>;
}

export type AccountModule = Module<Account> & Getters;

function create(): AccountModule {
    const store = makeStore<Account>();

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

        return { get, all, hierarchical };
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
            store.setEntities(entities.accounts);
        }
        return store.state.byId[id];
    }

    async function fetchAccounts() {
        if (!store.state.fetched) {
            const response = await axios.get('/accounts');
            const { result, entities } = normalize<Account, Entities>(response, [AccountEntity]);
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
