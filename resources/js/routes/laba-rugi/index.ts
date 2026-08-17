import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ProfitLossController::index
* @see app/Http/Controllers/ProfitLossController.php:26
* @route '/laba-rugi'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/laba-rugi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfitLossController::index
* @see app/Http/Controllers/ProfitLossController.php:26
* @route '/laba-rugi'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfitLossController::index
* @see app/Http/Controllers/ProfitLossController.php:26
* @route '/laba-rugi'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitLossController::index
* @see app/Http/Controllers/ProfitLossController.php:26
* @route '/laba-rugi'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProfitLossController::index
* @see app/Http/Controllers/ProfitLossController.php:26
* @route '/laba-rugi'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitLossController::index
* @see app/Http/Controllers/ProfitLossController.php:26
* @route '/laba-rugi'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitLossController::index
* @see app/Http/Controllers/ProfitLossController.php:26
* @route '/laba-rugi'
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
* @see \App\Http\Controllers\ProfitLossController::exportMethod
* @see app/Http/Controllers/ProfitLossController.php:125
* @route '/laba-rugi/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/laba-rugi/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfitLossController::exportMethod
* @see app/Http/Controllers/ProfitLossController.php:125
* @route '/laba-rugi/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfitLossController::exportMethod
* @see app/Http/Controllers/ProfitLossController.php:125
* @route '/laba-rugi/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitLossController::exportMethod
* @see app/Http/Controllers/ProfitLossController.php:125
* @route '/laba-rugi/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProfitLossController::exportMethod
* @see app/Http/Controllers/ProfitLossController.php:125
* @route '/laba-rugi/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitLossController::exportMethod
* @see app/Http/Controllers/ProfitLossController.php:125
* @route '/laba-rugi/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitLossController::exportMethod
* @see app/Http/Controllers/ProfitLossController.php:125
* @route '/laba-rugi/export'
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

const labaRugi = {
    index: Object.assign(index, index),
    export: Object.assign(exportMethod, exportMethod),
}

export default labaRugi