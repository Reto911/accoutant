import format from 'date-fns/format';


class Form {
    constructor(ID = null, date = format(new Date(), 'yyyy-MM-dd'), type = '餐饮', usage = null, balance = null, desc = null) {
        this.id = ID;
        this.date = date;
        this.type = type;
        this.usage = usage;
        this.balance = balance;
        this.desc = desc;
    }
}

export default Form;