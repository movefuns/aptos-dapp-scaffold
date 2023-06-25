module playground::mycounter {

    use std::signer;
    use std::string;
    use std::error;

    const E_DATA_EXIST:u64 = 0;
    const E_DATA_NOT_FOUND:u64 = 1;
    const E_NOT_ALLOW:u64 = 2;

    struct CounterHolder has key {
        value: u64,
        creator: address,
        allow:address,
        descrition: string::String
    }

    public entry fun make_counter(account:&signer,allow:address,value:u64,descrition:string::String) {
        let creator = signer::address_of(account);
        assert!(!exists<CounterHolder>(creator), error::already_exists(E_DATA_EXIST));
        move_to(account,CounterHolder{value,creator,allow,descrition});
    }

    public entry fun update_counter(account:&signer,holder:address,value:u64,descrition:string::String) acquires CounterHolder {
        assert!(exists<CounterHolder>(holder), error::not_found(E_DATA_NOT_FOUND));
        let current = signer::address_of(account);
        let mut_counter = borrow_global_mut<CounterHolder>(holder);
        assert!(mut_counter.creator == current || mut_counter.allow == current , error::not_found(E_NOT_ALLOW));
        mut_counter.value = value;
        mut_counter.descrition = descrition;
    }


}