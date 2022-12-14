import { createContext, ParentProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import accounts, { AccountModule } from "../store/accounts";
import customers, { CustomerModule } from "./customers";
import entries, { EntriesModule } from "./entries";
import products, { ProductsModule } from "./products";
import purchases, { PurchaseModule } from "./purchases";
import sales, { SaleModule } from "./sales";
import services, { ServiceModule } from "./services";
import vendors, { VendorModule } from "./vendors";

type State<T> = {
    ids: number[];
    fetched: boolean;
    byId: Record<number, T>;
}

type Store<T> = {
    state: State<T>;
    remove: (id: number) => void;
    save: (id: number, item: T) => void;
    setEntities: (items: Record<number, T>) => void;
    setAll: (ids: number[], items: Record<number, T>) => void;
}

export type Module<T> = {
    state: State<T>;
    fetchAll: () => Promise<void>;
    fetch: (id: number) => Promise<T>;
    delete: (id: number) => Promise<void>;
    save: (data: Record<string, string>) => Promise<void>;
    setEntities: (items: Record<number, T>) => void;
    [K: string]: any;
}

export function makeStore<T>(): Store<T> {
    const [state, setState] = createStore<State<T>>({
        ids: [],
        byId: {},
        fetched: false,
    })

    function setEntities(entities: Record<number, T>) {
        setState('byId', function(items: Record<number, T>) {
            return { ...items, ...entities };
        });
        setState('ids', (prev: number[]) => {
            let next = [...prev];
            if (entities) {
                for (const item of Object.values(entities)) {
                    if (!next.includes((item as any).ID)) {
                        next.push((item as any).ID);
                    }
                }
            }
            return next;
        });
    }

    function setAll(ids: number[], entities: Record<number, T>) {
        setEntities(entities);
        setState('ids', ids);
        setState('fetched', true);
    }

    function save(id: number, item: T) {
        setState('byId', id, item);
        if (state.fetched) {
            setState('ids', function(prev: number[]) {
                if (prev.includes(id)) {
                    return prev;
                }
                return [...prev, id]
            });
        }
    }

    function remove(id: number) {
        setState("ids", function(ids: number[]) {
            ids.splice(ids.indexOf(id), 1);
            return [...ids];
        });
        setState("byId", id, undefined as T);
    }

    return { state, save, setEntities, setAll, remove }
}

type AppStore = {
    accounts: AccountModule;
    customers: CustomerModule;
    vendors: VendorModule;
    products: ProductsModule;
    services: ServiceModule;
    purchases: PurchaseModule;
    entries: EntriesModule;
    sales: SaleModule;
}

const StoreContext = createContext<AppStore>();

export function Store(props: ParentProps) {
    const state = {
        accounts,
        customers,
        vendors,
        products,
        services,
        purchases,
        entries,
        sales,
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


