import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\JournalController::store
* @see app/Http/Controllers/JournalController.php:1011
* @route '/jurnal-transfer/store'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/jurnal-transfer/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\JournalController::store
* @see app/Http/Controllers/JournalController.php:1011
* @route '/jurnal-transfer/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalController::store
* @see app/Http/Controllers/JournalController.php:1011
* @route '/jurnal-transfer/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalController::store
* @see app/Http/Controllers/JournalController.php:1011
* @route '/jurnal-transfer/store'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalController::store
* @see app/Http/Controllers/JournalController.php:1011
* @route '/jurnal-transfer/store'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:0
* @route '/jurnal-transfer/{journal}/edit'
*/
export const edit = (args: { journal: string | number } | [journal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/jurnal-transfer/{journal}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:0
* @route '/jurnal-transfer/{journal}/edit'
*/
edit.url = (args: { journal: string | number } | [journal: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { journal: args }
    }

    if (Array.isArray(args)) {
        args = {
            journal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        journal: args.journal,
    }

    return edit.definition.url
            .replace('{journal}', parsedArgs.journal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:0
* @route '/jurnal-transfer/{journal}/edit'
*/
edit.get = (args: { journal: string | number } | [journal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:0
* @route '/jurnal-transfer/{journal}/edit'
*/
edit.head = (args: { journal: string | number } | [journal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:0
* @route '/jurnal-transfer/{journal}/edit'
*/
const editForm = (args: { journal: string | number } | [journal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:0
* @route '/jurnal-transfer/{journal}/edit'
*/
editForm.get = (args: { journal: string | number } | [journal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:0
* @route '/jurnal-transfer/{journal}/edit'
*/
editForm.head = (args: { journal: string | number } | [journal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\JournalController::update
* @see app/Http/Controllers/JournalController.php:0
* @route '/jurnal-transfer/{journal}'
*/
export const update = (args: { journal: string | number } | [journal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/jurnal-transfer/{journal}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\JournalController::update
* @see app/Http/Controllers/JournalController.php:0
* @route '/jurnal-transfer/{journal}'
*/
update.url = (args: { journal: string | number } | [journal: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { journal: args }
    }

    if (Array.isArray(args)) {
        args = {
            journal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        journal: args.journal,
    }

    return update.definition.url
            .replace('{journal}', parsedArgs.journal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalController::update
* @see app/Http/Controllers/JournalController.php:0
* @route '/jurnal-transfer/{journal}'
*/
update.put = (args: { journal: string | number } | [journal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\JournalController::update
* @see app/Http/Controllers/JournalController.php:0
* @route '/jurnal-transfer/{journal}'
*/
const updateForm = (args: { journal: string | number } | [journal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalController::update
* @see app/Http/Controllers/JournalController.php:0
* @route '/jurnal-transfer/{journal}'
*/
updateForm.put = (args: { journal: string | number } | [journal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\JournalController::destroy
* @see app/Http/Controllers/JournalController.php:1116
* @route '/jurnal-transfer/{journal}'
*/
export const destroy = (args: { journal: number | { id: number } } | [journal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/jurnal-transfer/{journal}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\JournalController::destroy
* @see app/Http/Controllers/JournalController.php:1116
* @route '/jurnal-transfer/{journal}'
*/
destroy.url = (args: { journal: number | { id: number } } | [journal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { journal: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { journal: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            journal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        journal: typeof args.journal === 'object'
        ? args.journal.id
        : args.journal,
    }

    return destroy.definition.url
            .replace('{journal}', parsedArgs.journal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalController::destroy
* @see app/Http/Controllers/JournalController.php:1116
* @route '/jurnal-transfer/{journal}'
*/
destroy.delete = (args: { journal: number | { id: number } } | [journal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\JournalController::destroy
* @see app/Http/Controllers/JournalController.php:1116
* @route '/jurnal-transfer/{journal}'
*/
const destroyForm = (args: { journal: number | { id: number } } | [journal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalController::destroy
* @see app/Http/Controllers/JournalController.php:1116
* @route '/jurnal-transfer/{journal}'
*/
destroyForm.delete = (args: { journal: number | { id: number } } | [journal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const transfer = {
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default transfer