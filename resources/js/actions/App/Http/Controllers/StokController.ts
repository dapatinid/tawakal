import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\StokController::index
* @see app/Http/Controllers/StokController.php:17
* @route '/stok'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/stok',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StokController::index
* @see app/Http/Controllers/StokController.php:17
* @route '/stok'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StokController::index
* @see app/Http/Controllers/StokController.php:17
* @route '/stok'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StokController::index
* @see app/Http/Controllers/StokController.php:17
* @route '/stok'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StokController::index
* @see app/Http/Controllers/StokController.php:17
* @route '/stok'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StokController::index
* @see app/Http/Controllers/StokController.php:17
* @route '/stok'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StokController::index
* @see app/Http/Controllers/StokController.php:17
* @route '/stok'
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

/**
* @see \App\Http\Controllers\StokController::exportMethod
* @see app/Http/Controllers/StokController.php:269
* @route '/stok/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/stok/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StokController::exportMethod
* @see app/Http/Controllers/StokController.php:269
* @route '/stok/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StokController::exportMethod
* @see app/Http/Controllers/StokController.php:269
* @route '/stok/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StokController::exportMethod
* @see app/Http/Controllers/StokController.php:269
* @route '/stok/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StokController::exportMethod
* @see app/Http/Controllers/StokController.php:269
* @route '/stok/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StokController::exportMethod
* @see app/Http/Controllers/StokController.php:269
* @route '/stok/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StokController::exportMethod
* @see app/Http/Controllers/StokController.php:269
* @route '/stok/export'
*/
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

const StokController = { index, exportMethod, export: exportMethod }

export default StokController