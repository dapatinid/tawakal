import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CabangController::index
* @see app/Http/Controllers/CabangController.php:16
* @route '/cabang-saya'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cabang-saya',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CabangController::index
* @see app/Http/Controllers/CabangController.php:16
* @route '/cabang-saya'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CabangController::index
* @see app/Http/Controllers/CabangController.php:16
* @route '/cabang-saya'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CabangController::index
* @see app/Http/Controllers/CabangController.php:16
* @route '/cabang-saya'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CabangController::index
* @see app/Http/Controllers/CabangController.php:16
* @route '/cabang-saya'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CabangController::index
* @see app/Http/Controllers/CabangController.php:16
* @route '/cabang-saya'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CabangController::index
* @see app/Http/Controllers/CabangController.php:16
* @route '/cabang-saya'
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
* @see \App\Http\Controllers\CabangController::switchMethod
* @see app/Http/Controllers/CabangController.php:42
* @route '/cabang-saya/switch'
*/
export const switchMethod = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: switchMethod.url(options),
    method: 'put',
})

switchMethod.definition = {
    methods: ["put"],
    url: '/cabang-saya/switch',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CabangController::switchMethod
* @see app/Http/Controllers/CabangController.php:42
* @route '/cabang-saya/switch'
*/
switchMethod.url = (options?: RouteQueryOptions) => {
    return switchMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CabangController::switchMethod
* @see app/Http/Controllers/CabangController.php:42
* @route '/cabang-saya/switch'
*/
switchMethod.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: switchMethod.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CabangController::switchMethod
* @see app/Http/Controllers/CabangController.php:42
* @route '/cabang-saya/switch'
*/
const switchMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CabangController::switchMethod
* @see app/Http/Controllers/CabangController.php:42
* @route '/cabang-saya/switch'
*/
switchMethodForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

switchMethod.form = switchMethodForm

const CabangController = { index, switchMethod, switch: switchMethod }

export default CabangController