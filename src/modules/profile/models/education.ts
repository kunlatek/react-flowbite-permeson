export class Education {
    course?: string;
    institution?: string;
    startDate?: string;
    finishDate?: string;
    description?: string;
    certificateFile?: string;

    constructor(
        course?: string, 
        institution?: string, 
        startDate?: string, 
        finishDate?: string, 
        description?: string, 
        certificateFile?: string
    ) {
        this.course = course;
        this.institution = institution;
        this.startDate = startDate;
        this.finishDate = finishDate;
        this.description = description;
        this.certificateFile = certificateFile;
    }
}