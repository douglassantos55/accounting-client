import { createContext, ParentProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import accounts, { AccountModule } from "../store/accounts";
import customers, { CustomerModule } from "./customers";
import products, { ProductsModule } from "./products";
import vendors, { VendorModule } from "./vendors";

type State<T> = {
    ids: number[];
    fetched: boolean;
    byId: Record<number, T>;
}

type Store<T> = {
    state: State<T>;
    set: (items: T[]) => void;
    remove: (id: number) => void;
    save: (id: number, item: T) => void;
}

export type Module<T> = {
    state: State<T>;
    fetchAll: () => Promise<void>;
    fetch: (id: number) => Promise<T>;
    delete: (id: number) => Promise<void>;
    save: (data: Record<string, string>) => Promise<void>;
    [K: string]: any;
}

export function makeStore<T>(): Store<T> {
    const [state, setState] = createStore<State<T>>({
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

    return { state, set, remove, save }
}

type AppStore = {
    accounts: AccountModule;
    customers: CustomerModule;
    vendors: VendorModule;
    products: ProductsModule;
}

const StoreContext = createContext<AppStore>();

export function Store(props: ParentProps) {
    const state = {
        accounts,
        customers,
        vendors,
        products,
    }

    return (
        <StoreContext.Provider value={{ ...state }}>
            {props.children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    return useContext(StoreContext) as AppStore;
}


