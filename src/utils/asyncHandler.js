const asyncHndler = (func)=>async(req,res,next)=>
    {
        try {

            await func(res,req,next)
        } 
        catch (error) 
        {
            res.status(error.code||500).json({
                success:false,
                messege:error.messege
            })
        }
    }
export {asyncHndler}