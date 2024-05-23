class ApiError extends Error{
    constructor(
        statusCOde,
        messege="something went wrong",
        error=[],
        stack=""
    )
    {
        // Call the parent constructor with the message
        super(message);
        // Custom properties
        this.statusCode = statusCode;
        this.error = error;// If stack is provided, use it, otherwise use the stack trace of the current error
        this.message=messege;
        this.success=false;
        this.data=null;
        if (stack) {
            this.stack = stack;
        } 
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export {ApiError}