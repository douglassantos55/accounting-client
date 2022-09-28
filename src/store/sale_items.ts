import { schema } from "normalizr";
import { makeStore } from ".";
import { SaleItem } from "../types";
import { ProductEntity } from "./products";

export type SaleItemModule = {
    get: (id: number) => SaleItem;
    setEntities: (entities: Record<number, SaleItem>) => void;
}

export const SaleItemEntity = new schema.Entity('sale_items', {
    Product: ProductEntity,
}, { idAttribute: 'ID' });

function create(): SaleItemModule {
    const store = makeStore<SaleItem>();

    function get(id: number): SaleItem {
        return store.state.byId[id];
    }

    return {
        get,
        setEntities: store.setEntities,
    };
}

export default create();
