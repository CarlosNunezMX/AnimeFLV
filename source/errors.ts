export class ValidationError extends Error{
    elements = {};
    constructor(message: string, el = {}){
        super(message);
        this.name = "ValidationError";
        this.elements = el;
    }
}

export class HTML_PARSING_ERROR extends Error{
    Where: string | undefined;
    constructor(missing: string, File: string, Function: string, Variable: string){
        super(`Error al obtener "${missing}"`);
        this.name = "HTML Parsing Error";
        this.Where = `${File} -  ${Function}->${Variable}`;
    }
}
