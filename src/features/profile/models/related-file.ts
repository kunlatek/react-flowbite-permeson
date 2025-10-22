export class RelatedFile {
    description?: string;
    file?: string;
    dateDay?: number;
    dateMonth?: number;
    dateYear?: number;

    constructor(
        description?: string, 
        file?: string, 
        dateDay?: number, 
        dateMonth?: number, 
        dateYear?: number
    ) {
        this.description = description;
        this.file = file;
        this.dateDay = dateDay;
        this.dateMonth = dateMonth;
        this.dateYear = dateYear;
    }
}