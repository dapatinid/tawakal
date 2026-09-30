import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\QuestionerController::index
* @see app/Http/Controllers/QuestionerController.php:10
* @route '/questioner'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/questioner',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\QuestionerController::index
* @see app/Http/Controllers/QuestionerController.php:10
* @route '/questioner'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\QuestionerController::index
* @see app/Http/Controllers/QuestionerController.php:10
* @route '/questioner'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\QuestionerController::index
* @see app/Http/Controllers/QuestionerController.php:10
* @route '/questioner'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\QuestionerController::index
* @see app/Http/Controllers/QuestionerController.php:10
* @route '/questioner'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\QuestionerController::index
* @see app/Http/Controllers/QuestionerController.php:10
* @route '/questioner'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\QuestionerController::index
* @see app/Http/Controllers/QuestionerController.php:10
* @route '/questioner'
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

const QuestionerController = { index }

export default QuestionerController