import { makeStore, Module } from ".";
import axios from "../axios";
import { Account } from "../types";

function create(): Module<Account> {
    const store = makeStore<Account>();

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
            store.set(await axios.get<any, Account[]>('/accounts'));
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
    }
}

export default create();
