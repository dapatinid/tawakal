import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReturController::index
* @see app/Http/Controllers/ReturController.php:16
* @route '/retur'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/retur',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReturController::index
* @see app/Http/Controllers/ReturController.php:16
* @route '/retur'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReturController::index
* @see app/Http/Controllers/ReturController.php:16
* @route '/retur'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReturController::index
* @see app/Http/Controllers/ReturController.php:16
* @route '/retur'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReturController::index
* @see app/Http/Controllers/ReturController.php:16
* @route '/retur'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReturController::index
* @see app/Http/Controllers/ReturController.php:16
* @route '/retur'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReturController::index
* @see app/Http/Controllers/ReturController.php:16
* @route '/retur'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const ReturController = { index }

export default ReturController