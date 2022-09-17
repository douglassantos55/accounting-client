import { createContext, ParentProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import axios from "../axios";
import { Account } from "../types";

type ModuleData<T> = {
    ids: number[];
    fetched: boolean;
    byId: Record<number, T>;
}

type Module<T> = {
    state: ModuleData<T>;
    set: (items: T[]) => void;
    remove: (id: number) => void;
    save: (id: number, item: T) => void;
}

function createModule<T>(): Module<T> {
    const [state, setState] = createStore<ModuleData<T>>({
        ids: [],
        byId: {},
        fetched: false,
    })

    function save(id: number, item: T) {
        setState("byId", id, item);
        setState("ids", function(ids: number[]) {
            !ids.includes(id) && ids.push(id);
            return [...ids];
        });
    }

    function set(items: T[]) {
        setState('fetched', true);
        for (const item of items as { ID: number }[]) {
            setState("byId", item.ID, item as T);
            setState("ids", ids => [...ids, item.ID]);
        }
    }

    function remove(id: number) {
        setState("ids", function(ids: number[]) {
            ids.splice(ids.indexOf(id), 1);
            return [...ids];
        });
        setState("byId", id, undefined as T);
    }

    return {
        state,
        set,
        remove,
        save,
    }
}

type StoreState = {
    accounts: Module<Account>;
    fetchAccount: (id: number) => Promise<Account>;
    fetchAccounts: () => Promise<void>;
    deleteAccount: (id: number) => Promise<void>;
    saveAccount: (data: Record<string, string>) => Promise<void>;
}

const StoreContext = createContext<StoreState>();


export function Store(props: ParentProps) {
    const accounts = createModule<Account>();

    function normalize(data: Record<string, string>) {
        return {
            name: data.name,
            type: parseInt(data.type),
            parent_id: data.parent_id ? parseInt(data.parent_id) : null,
        };
    }

    async function saveAccount(data: Record<string, string>) {
        let account: Account;
        if (data.ID) {
            account = await axios.put(`/accounts/${data.ID}`, normalize(data));
        } else {
            account = await axios.post("/accounts", normalize(data));
        }
        accounts.save(account.ID, account);
    }

    async function fetchAccount(id: number) {
        if (!accounts.state.byId[id]) {
            accounts.save(id, await axios.get(`/accounts/${id}`));
        }
        return accounts.state.byId[id];
    }

    async function fetchAccounts() {
        if (!accounts.state.fetched) {
            accounts.set(await axios.get<any, Account[]>('/accounts'));
        }
    }

    async function deleteAccount(id: number) {
        await axios.delete(`/accounts/${id}`);
        accounts.remove(id);
    }

    const state = {
        accounts,
    }

    return (
        <StoreContext.Provider value={{ ...state, fetchAccounts, deleteAccount, saveAccount, fetchAccount }}>
            {props.children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    return useContext(StoreContext) as StoreState;
}


