export class Contact {
    type?: string;
    value?: string;
    complement?: string;

    constructor(
        type?: string, 
        value?: string, 
        complement?: string
    ) {
        this.type = type;
        this.value = value;
        this.complement = complement;
    }
}