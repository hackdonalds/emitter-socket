import {Express,Response, Request} from "express"
export default (app:Express) => {
    app.use(function (req:Request, res:Response, next:any) {
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    return app
}