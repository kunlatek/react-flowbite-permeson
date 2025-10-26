export class Course {
    name?: string;
    institution?: string;
    startDate?: string;
    finishDate?: string;
    certificateFile?: string;
    
    constructor(
        name?: string,
        institution?: string,
        startDate?: string,
        finishDate?: string,
        certificateFile?: string
    ) {
        this.name = name;
        this.institution = institution;
        this.startDate = startDate;
        this.finishDate = finishDate;
        this.certificateFile = certificateFile;
    }
}