module.exports = class Meal{
    constructor(id,title,price,desc,full_desc,img){
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.full_desc = full_desc;
        this.img = img;
        this.price= price;
    }
}