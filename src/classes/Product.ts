class Product {
    id: string;
    name: string;
    num: number;
    category: string;
    product: string;
    price: number;
    taxe: boolean;

    constructor(id: string, name: string, num: number, category: string, product: string, price:number, taxe: boolean) {
        this.id = id;
        this.name = name;
        this.num = num;
        this.category = category;
        this.product = product;
        this.price = price;
        this.taxe = taxe;
    }

}

export default Product;