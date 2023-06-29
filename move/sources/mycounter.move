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
        description: string::String
    }

    public fun allow_write(address:address,counter:&mut CounterHolder):bool {
        counter.allow == address || counter.creator == address 
    }

    public fun counter_exist(address:address):bool {
        exists<CounterHolder>(address)
    }

    public entry fun make_counter(account:&signer,allow:address,value:u64,description:string::String) {
        let creator = signer::address_of(account);
        assert!(!counter_exist(creator), error::already_exists(E_DATA_EXIST));
        move_to(account,CounterHolder{value,creator,allow,description});
    }

    public entry fun update_counter(account:&signer,holder:address,value:u64,description:string::String) acquires CounterHolder {
        assert!(counter_exist(holder), error::already_exists(E_DATA_NOT_FOUND));
        let current = signer::address_of(account);
        let mut_counter = borrow_global_mut<CounterHolder>(holder);
        assert!(allow_write(current,mut_counter), error::not_found(E_NOT_ALLOW));
        mut_counter.value = value;
        mut_counter.description = description;
    }

    public entry fun delete_counter(account:&signer) acquires CounterHolder {
        let current = signer::address_of(account);
        assert!(counter_exist(current), error::not_found(E_DATA_NOT_FOUND));
        let counter = move_from<CounterHolder>(current);
        let CounterHolder {value:_,creator:_,allow:_,description:_ } = counter;
    }

}