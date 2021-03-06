/** Declaration file generated by dts-gen */

declare module "path-match" {
    type Options = {
        sensitive: boolean
        strict: boolean
        end: boolean
        [k: string]: any
    }
    type MatchFN = (url: string) => ({ [k: string]: any })
    type Route = (route: string) => MatchFN
    function pathmatch(options: Options): Route
    export default pathmatch
}