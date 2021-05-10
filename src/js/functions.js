import format from 'date-fns/format';

function Form(ID=null, date=format(new Date(), 'yyyy-MM-dd'), usage=null, balance=null, desc=null){
    this.id = ID;
    this.date = date;
    this.usage = usage;
    this.balance = balance;
    this.desc = desc;
}
export default Form;