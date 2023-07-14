export class ValidationError extends Error{
    elements = {};
    constructor(message, el = {}){
        super(message);
        this.name = "ValidationError";
        this.elements = el;
    }
}