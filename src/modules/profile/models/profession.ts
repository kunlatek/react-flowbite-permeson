export class Profession {
    startDateMonth?: number;
    startDateYear?: number;
    finishDateMonth?: number;
    finishDateYear?: number;
    description?: string;

    constructor(
        startDateMonth?: number, 
        startDateYear?: number, 
        finishDateMonth?: number, 
        finishDateYear?: number, 
        description?: string
    ) {
        this.startDateMonth = startDateMonth;
        this.startDateYear = startDateYear;
        this.finishDateMonth = finishDateMonth;
        this.finishDateYear = finishDateYear;
        this.description = description;
    }
}