import { Accessor, createMemo, createRoot } from "solid-js";
import { makeStore, Module } from ".";
import axios from "../axios";
import { Account } from "../types";

type Getters = {
    all: Accessor<Account[]>;
    parents: Accessor<Account[]>;
}

export type AccountModule = Module<Account> & Getters;

function create(): AccountModule {
    const store = makeStore<Account>();

    const getters = createRoot(function() {
        const all = createMemo(function() {
            return store.state.ids.map(function(id: number) {
                return store.state.byId[id];
            });
        });
        const parents = createMemo(function() {
            return all().filter(function(account: Account) {
                return account.parent_id == null;
            });
        });

        return { all, parents };
    });

    function _normalize(data: Record<string, string>) {
        return {
            name: data.name,
            type: parseInt(data.type),
            parent_id: data.parent_id ? parseInt(data.parent_id) : null,
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
            store.save(id, await axios.get(`/accounts/${id}`));
        }
        return store.state.byId[id];
    }

    async function fetchAccounts() {
        if (!store.state.fetched) {
            store.set(await axios.get('/accounts'));
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
        ...getters,
    }
}

export default create();
