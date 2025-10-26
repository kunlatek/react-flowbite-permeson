export class Address {
    type?: string;
    street?: string;
    number?: string;
    complement?: string;
    city?: string;
    state?: string;
    cep?: string;
    country?: string;
    countryCode?: string;
    cepBrasilApi?: string;

    constructor(
        type?: string,
        street?: string,
        number?: string,
        complement?: string,
        city?: string,
        state?: string,
        cep?: string,
        country?: string,
        countryCode?: string,
        cepBrasilApi?: string
    ) {
        this.type = type;
        this.street = street;
        this.number = number;
        this.complement = complement;
        this.city = city;
        this.state = state;
        this.cep = cep;
        this.country = country;
        this.countryCode = countryCode;
        this.cepBrasilApi = cepBrasilApi;
    }
}